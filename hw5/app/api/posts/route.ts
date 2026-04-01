import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { triggerPusherEvent } from '@/lib/pusherServer';
import cache from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const parentPost = searchParams.get('parentPost');
    const following = searchParams.get('following');

    // 建立快取 key
    // 對於 Following 頁面，包含用戶 ID 以確保每個用戶的快取獨立
    let cacheKey = `posts:${userId || ''}:${parentPost || ''}:${following || ''}`;
    
    if (following === 'true') {
      // Following 頁面需要包含當前用戶 ID，因為每個用戶的 following 列表不同
      const session = await auth();
      if (session?.user?.id) {
        cacheKey = `posts:${session.user.id}:following:true`;
      } else {
        // 未登入，不使用快取
        cacheKey = '';
      }
    }
    
    // 檢查快取（如果有有效的快取鍵）
    if (cacheKey) {
      const cachedData = cache.get<any>(cacheKey);
      if (cachedData) {
        console.log('[Posts API] Returning cached data for:', cacheKey);
        return NextResponse.json(cachedData);
      }
      console.log('[Posts API] No cache, querying database for:', cacheKey);
    } else {
      console.log('[Posts API] No cache key (unauthorized), querying database');
    }

    await connectDB();

    let query: any = {};

    if (parentPost) {
      // 獲取特定貼文的回覆
      query.parentPost = parentPost;
    } else if (userId) {
      // 獲取特定用戶的貼文和轉發
      // 先找到該用戶的 _id
      const targetUser = await User.findOne({ userId });
      if (!targetUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // 只顯示：
      // 1. 該用戶自己發表的原創貼文（不是 repost，不是回覆）
      // 2. 該用戶 repost 的貼文
      // 不顯示：別人 repost 該用戶的貼文（即 author === userId && repostBy 存在且不是該用戶）
      query.$or = [
        { 
          author: targetUser._id.toString(), 
          parentPost: { $exists: false },
          repostBy: { $exists: false } // 只顯示原創貼文，不顯示被 repost 的貼文
        },
        { 
          repostBy: targetUser._id.toString() // 顯示該用戶 repost 的貼文
        }
      ];
    } else if (following === 'true') {
      // 獲取追蹤用戶的貼文和轉發（不包括當前用戶自己的轉發）
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // 優化：只查詢 following 欄位，減少資料傳輸
      const currentUser = await User.findById(session.user.id).select('following');
      if (!currentUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      console.log('[Posts API] Current user following list:', currentUser.following);

      // 確保 following 列表不是空的
      if (!currentUser.following || currentUser.following.length === 0) {
        // 如果沒有追蹤任何人，返回空列表
        console.log('[Posts API] No following, returning empty');
        return NextResponse.json({ posts: [] });
      }

      // 只顯示追蹤用戶的原創貼文和追蹤用戶的 repost
      // 明確排除：1) 當前用戶自己的 repost 2) 回覆（parentPost 存在的貼文）
      query.$or = [
        // 追蹤用戶的原創貼文（不是 repost，不是回覆）
        { 
          author: { $in: currentUser.following }, 
          parentPost: { $exists: false },
          repostBy: { $exists: false }
        },
        // 追蹤用戶的 repost（明確排除當前用戶自己的 repost）
        { 
          repostBy: { 
            $in: currentUser.following,
            $ne: currentUser._id.toString()
          },
          parentPost: { $exists: false } // repost 也不應該是回覆
        }
      ];
    } else {
      // 獲取所有貼文（首頁 feed）
      query.parentPost = { $exists: false };
    }

    // 獲取當前用戶的 session（用於檢查 like 狀態）
    const session = await auth();
    const currentUserId = session?.user?.id;

    const posts = await Post.find(query).sort({ createdAt: -1 }).limit(50);

    // 批量查詢優化：收集所有需要的用戶 ID 和原始貼文 ID
    const userIds = new Set<string>();
    const postIds = new Set<string>();
    const originalPostIds = new Set<string>();
    
    posts.forEach(post => {
      userIds.add(post.author);
      if (post.repostBy) {
        userIds.add(post.repostBy);
        // 如果是 repost，需要取得原始貼文的統計數據
        if (post.originalPost) {
          originalPostIds.add(post.originalPost.toString());
        }
      }
      postIds.add(post._id.toString());
      if (post.originalPost) {
        originalPostIds.add(post.originalPost.toString());
      }
    });

    // 批量查詢所有用戶
    const users = await User.find({ _id: { $in: Array.from(userIds) } });
    const userMap = new Map();
    users.forEach(user => {
      userMap.set(user._id.toString(), {
        userId: user.userId,
        name: user.name,
        image: user.image,
      });
    });

    // 批量查詢原始貼文以獲取統計數據（replies, likes）
    const originalPosts = await Post.find({ 
      _id: { $in: Array.from(originalPostIds) } 
    }).select('replies likes');
    
    const originalPostStatsMap = new Map();
    originalPosts.forEach(originalPost => {
      originalPostStatsMap.set(originalPost._id.toString(), {
        replies: originalPost.replies || [],
        likes: originalPost.likes || [],
      });
    });

    // 批量計算轉發次數（使用聚合查詢）
    const repostCounts = await Post.aggregate([
      {
        $match: {
          originalPost: { $in: Array.from(originalPostIds) },
        }
      },
      {
        $group: {
          _id: '$originalPost',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const repostCountMap = new Map();
    repostCounts.forEach(item => {
      repostCountMap.set(item._id.toString(), item.count);
    });

    // 為每個貼文添加作者資訊（使用緩存的用戶資料）
    const postsWithAuthors = posts.map(post => {
      const postObj = post.toObject();
      
      // 如果是轉發
      if (post.repostBy && post.originalPost) {
        // 轉發者資訊
        const reposterData = userMap.get(post.repostBy);
        if (reposterData) {
          postObj.reposterDetails = reposterData;
        }

        // 原作者資訊
        const originalAuthorData = userMap.get(post.author);
        if (originalAuthorData) {
          postObj.authorDetails = originalAuthorData;
        }
        
        // 使用原始貼文的統計數據（留言數、轉發數、愛心數）
        const originalStats = originalPostStatsMap.get(post.originalPost.toString());
        if (originalStats) {
          postObj.replies = originalStats.replies;  // 使用原始貼文的留言
          postObj.likes = originalStats.likes;      // 使用原始貼文的愛心
          postObj.repostCount = repostCountMap.get(post.originalPost.toString()) || 0;  // 使用原始貼文的轉發數
        }
      } else {
        // 一般貼文或留言，取得作者資訊
        const authorData = userMap.get(post.author);
        if (authorData) {
          postObj.authorDetails = authorData;
        }
        
        // 轉發次數
        postObj.repostCount = repostCountMap.get(post._id.toString()) || 0;
      }

      return postObj;
    });

    const result = { posts: postsWithAuthors };
    
    // 將結果存入快取（TTL: 30 秒，因為有 Pusher 即時更新）
    // 只有當有有效的快取鍵時才設置快取
    if (cacheKey) {
      cache.set(cacheKey, result, 30 * 1000);
      console.log('[Posts API] Set cache for:', cacheKey);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, links, hashtags, mentions, parentPost } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const post = await Post.create({
      content: content.trim(),
      author: session.user.id,
      links: links || [],
      hashtags: hashtags || [],
      mentions: mentions || [],
      parentPost: parentPost || undefined,
      likes: [],
      replies: [],
      hasMedia: false,
    });

    // 如果是回覆，更新父貼文的 replies 陣列
    if (parentPost) {
      await Post.findByIdAndUpdate(parentPost, {
        $push: { replies: post._id },
      });
      
      // 清除相關快取
      cache.deleteByPrefix('posts:');
      
      // 觸發 Pusher 事件 - 新留言（包含完整貼文資訊）
      const parentPostDoc = await Post.findById(parentPost);
      await triggerPusherEvent('posts', 'post-updated', {
        postId: parentPost,
        updatedPost: parentPostDoc ? {
          _id: parentPostDoc._id.toString(),
          replies: parentPostDoc.replies,
          likes: parentPostDoc.likes,
        } : null,
      });
    } else {
      // 清除相關快取
      cache.deleteByPrefix('posts:');
      
      // 取得完整貼文資訊（包含作者資訊）
      const author = await User.findById(session.user.id).select('userId name image');
      const newPostWithAuthor = {
        ...post.toObject(),
        authorDetails: author ? {
          userId: author.userId,
          name: author.name,
          image: author.image,
        } : null,
        likes: [],
        replies: [],
        repostCount: 0,
      };
      
      // 觸發 Pusher 事件 - 新貼文（包含完整貼文資訊）
      await triggerPusherEvent('posts', 'post-created', {
        post: newPostWithAuthor,
      });
    }

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
