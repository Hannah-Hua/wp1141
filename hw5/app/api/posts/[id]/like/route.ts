import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Pusher from 'pusher';

// 初始化 Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

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

    // 觸發 Pusher 事件
    const updatedPost = await Post.findById(params.id);
    await pusher.trigger('posts', 'post-updated', {
      postId: params.id,
      likesCount: updatedPost.likes.length,
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
