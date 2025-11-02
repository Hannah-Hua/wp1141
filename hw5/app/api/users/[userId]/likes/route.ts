import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';

export async function GET(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await paramsPromise;
    const session = await auth();
    
    // 只能查看自己的 likes
    if (!session?.user?.userId || session.user.userId !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ userId: params.userId });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 查找用戶按讚過的貼文
    const posts = await Post.find({ likes: user._id.toString() }).sort({ createdAt: -1 });

    // 為每個貼文添加作者資訊
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const author = await User.findById(post.author);
        const postObj = post.toObject();
        
        if (author) {
          postObj.authorDetails = {
            userId: author.userId,
            name: author.name,
            image: author.image,
          };
        }

        return postObj;
      })
    );

    return NextResponse.json({ posts: postsWithAuthors });
  } catch (error) {
    console.error('Failed to fetch liked posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch liked posts' },
      { status: 500 }
    );
  }
}
