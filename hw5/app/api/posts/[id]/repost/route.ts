import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { triggerPusherEvent } from '@/lib/pusherServer';
import cache from '@/lib/cache';

export async function POST(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  try {
    const params = await paramsPromise;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const originalPost = await Post.findById(params.id);
    
    if (!originalPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // 檢查是否已經轉發過
    const existingRepost = await Post.findOne({
      originalPost: params.id,
      repostBy: session.user.id,
    });

    if (existingRepost) {
      return NextResponse.json(
        { error: 'Already reposted' },
        { status: 400 }
      );
    }

    // 建立轉發
    const repost = await Post.create({
      content: originalPost.content,
      author: originalPost.author,
      repostBy: session.user.id,
      originalPost: params.id,
      links: originalPost.links,
      hashtags: originalPost.hashtags,
      mentions: originalPost.mentions,
      likes: [],
      replies: [],
      hasMedia: originalPost.hasMedia,
    });

    // 取得轉發者和原作者資訊
    const [reposter, originalAuthor] = await Promise.all([
      User.findById(session.user.id).select('userId name image'),
      User.findById(originalPost.author).select('userId name image'),
    ]);

    // 清除相關快取（確保返回首頁時能看到新轉發的貼文）
    cache.deleteByPrefix('posts:');
    console.log('[Repost API] Cleared posts cache after repost');
    
    // 建立完整的 repost 物件供 Pusher 使用
    const repostWithDetails = {
      ...repost.toObject(),
      reposterDetails: reposter ? {
        userId: reposter.userId,
        name: reposter.name,
        image: reposter.image,
      } : null,
      authorDetails: originalAuthor ? {
        userId: originalAuthor.userId,
        name: originalAuthor.name,
        image: originalAuthor.image,
      } : null,
      likes: originalPost.likes || [],  // 使用原始貼文的 likes
      replies: originalPost.replies || [],  // 使用原始貼文的 replies
      repostCount: 0,
    };
    
    // 計算原始貼文的 repostCount
    const repostCount = await Post.countDocuments({
      originalPost: params.id,
    });
    
    // 觸發新 repost 的創建事件
    await triggerPusherEvent('posts', 'post-created', {
      post: repostWithDetails,
    });
    
    // 觸發原始貼文的更新事件（更新 repostCount）
    await triggerPusherEvent('posts', 'post-updated', {
      postId: params.id,
      originalPostId: params.id,
      repostCount: repostCount,
    });
    
    console.log('[Repost API] Pusher events triggered - new repost created, original post repostCount updated');

    console.log('[Repost API] Repost created successfully:', {
      repostId: repost._id,
      originalPostId: params.id,
      reposterId: session.user.id
    });

    return NextResponse.json({ repost }, { status: 201 });
  } catch (error) {
    console.error('Failed to repost:', error);
    return NextResponse.json(
      { error: 'Failed to repost' },
      { status: 500 }
    );
  }
}
