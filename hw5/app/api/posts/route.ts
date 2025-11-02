import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { triggerPusherEvent } from '@/lib/pusherServer';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const parentPost = searchParams.get('parentPost');
    const following = searchParams.get('following');

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

      query.$or = [
        { author: targetUser._id.toString(), parentPost: { $exists: false } },
        { repostBy: targetUser._id.toString() }
      ];
    } else if (following === 'true') {
      // 獲取追蹤用戶的貼文
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const currentUser = await User.findById(session.user.id);
      if (!currentUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      query.$or = [
        { author: { $in: currentUser.following }, parentPost: { $exists: false } },
        { repostBy: { $in: currentUser.following } }
      ];
    } else {
      // 獲取所有貼文（首頁 feed）
      query.parentPost = { $exists: false };
    }

    const posts = await Post.find(query).sort({ createdAt: -1 }).limit(50);

    // 為每個貼文添加作者資訊
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const postObj = post.toObject();
        
        // 如果是轉發
        if (post.repostBy) {
          // 轉發者資訊
          const reposter = await User.findById(post.repostBy);
          if (reposter) {
            postObj.reposterDetails = {
              userId: reposter.userId,
              name: reposter.name,
              image: reposter.image,
            };
          }

          // 原作者資訊
          const originalAuthor = await User.findById(post.author);
          if (originalAuthor) {
            postObj.authorDetails = {
              userId: originalAuthor.userId,
              name: originalAuthor.name,
              image: originalAuthor.image,
            };
          }
        } else {
          // 一般貼文或留言，取得作者資訊
          const author = await User.findById(post.author);
          if (author) {
            postObj.authorDetails = {
              userId: author.userId,
              name: author.name,
              image: author.image,
            };
          }
        }

        // 計算轉發次數（只對原始貼文計算，不對轉發貼文計算）
        if (!post.repostBy) {
          const repostCount = await Post.countDocuments({
            originalPost: post._id,
          });
          postObj.repostCount = repostCount;
        } else {
          // 如果是轉發，取得原始貼文的轉發次數
          const repostCount = await Post.countDocuments({
            originalPost: post.originalPost,
          });
          postObj.repostCount = repostCount;
        }

        return postObj;
      })
    );

    return NextResponse.json({ posts: postsWithAuthors });
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
      
      // 觸發 Pusher 事件 - 新留言
      await triggerPusherEvent('posts', 'post-updated', {
        postId: parentPost,
      });
    } else {
      // 觸發 Pusher 事件 - 新貼文
      await triggerPusherEvent('posts', 'post-created', {
        postId: post._id,
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
