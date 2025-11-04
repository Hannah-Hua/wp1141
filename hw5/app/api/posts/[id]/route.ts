import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { triggerPusherEvent } from '@/lib/pusherServer';
import cache from '@/lib/cache';

export async function GET(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  try {
    const params = await paramsPromise;
    await connectDB();
    const post = await Post.findById(params.id);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const postObj = post.toObject();

    // 如果是 repost，使用原始貼文的統計數據
    if (post.repostBy && post.originalPost) {
      const originalPost = await Post.findById(post.originalPost);
      if (originalPost) {
        // 使用原始貼文的統計數據
        postObj.replies = originalPost.replies || [];
        postObj.likes = originalPost.likes || [];
        
        // 計算原始貼文的轉發次數
        const repostCount = await Post.countDocuments({
          originalPost: post.originalPost,
        });
        postObj.repostCount = repostCount;
      }

      // 取得轉發者和原作者資訊
      const [reposter, originalAuthor] = await Promise.all([
        User.findById(post.repostBy),
        User.findById(post.author),
      ]);

      if (reposter) {
        postObj.reposterDetails = {
          userId: reposter.userId,
          name: reposter.name,
          image: reposter.image,
        };
      }

      if (originalAuthor) {
        postObj.authorDetails = {
          userId: originalAuthor.userId,
          name: originalAuthor.name,
          image: originalAuthor.image,
        };
      }
    } else {
      // 一般貼文，取得作者資訊
      const author = await User.findById(post.author);
      if (author) {
        postObj.authorDetails = {
          userId: author.userId,
          name: author.name,
          image: author.image,
        };
      }

      // 計算轉發次數
      const repostCount = await Post.countDocuments({
        originalPost: post._id,
      });
      postObj.repostCount = repostCount;
    }

    return NextResponse.json({ post: postObj });
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // 只能刪除自己的貼文，且不能刪除轉發的貼文
    if (post.author !== session.user.id || post.repostBy) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await Post.findByIdAndDelete(params.id);

    // 如果有父貼文，從父貼文的 replies 中移除
    if (post.parentPost) {
      await Post.findByIdAndUpdate(post.parentPost, {
        $pull: { replies: params.id },
      });
    }

    // 清除相關快取
    cache.deleteByPrefix('posts:');
    
    // 觸發 Pusher 事件
    await triggerPusherEvent('posts', 'post-deleted', {
      postId: params.id,
      parentPostId: post.parentPost,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
