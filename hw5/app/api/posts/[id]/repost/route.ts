import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

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

    return NextResponse.json({ repost }, { status: 201 });
  } catch (error) {
    console.error('Failed to repost:', error);
    return NextResponse.json(
      { error: 'Failed to repost' },
      { status: 500 }
    );
  }
}
