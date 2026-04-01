import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
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

    const post = await Post.findById(params.id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const userId = session.user.id;
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike
      await Post.findByIdAndUpdate(params.id, {
        $pull: { likes: userId },
      });
    } else {
      // Like
      await Post.findByIdAndUpdate(params.id, {
        $addToSet: { likes: userId },
      });
    }

    // 清除相關快取（確保返回首頁時能看到最新狀態）
    cache.deleteByPrefix('posts:');
    console.log('[Like API] Cleared posts cache after like/unlike');
    
    // 觸發 Pusher 事件（包含完整更新資訊）
    // 重要：需要同時更新原始貼文和所有 repost
    const updatedPost = await Post.findById(params.id);
    
    // 觸發原始貼文的更新事件
    await triggerPusherEvent('posts', 'post-updated', {
      postId: params.id,
      originalPostId: params.id, // 原始貼文 ID
      likesCount: updatedPost.likes.length,
      likes: updatedPost.likes,
      isLiked: !isLiked,
      userId: userId,
    });
    
    console.log('[Like API] Pusher event triggered for post:', params.id);

    console.log('[Like API] Like operation successful:', {
      postId: params.id,
      isLiked: !isLiked,
      likesCount: updatedPost.likes.length
    });

    return NextResponse.json({ success: true, isLiked: !isLiked });
  } catch (error) {
    console.error('Failed to like/unlike post:', error);
    return NextResponse.json(
      { error: 'Failed to like/unlike post' },
      { status: 500 }
    );
  }
}
