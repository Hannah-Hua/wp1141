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

    // 查找用戶按讚過的貼文（只查詢原始貼文，排除 repost）
    // 因為 repost 會繼承原始貼文的 likes，所以會重複顯示
    const posts = await Post.find({ 
      likes: user._id.toString(),
      repostBy: { $exists: false } // 排除 repost，只顯示原始貼文
    }).sort({ createdAt: -1 });

    // 為每個貼文添加作者資訊（批量查詢優化）
    const userIds = new Set<string>();
    posts.forEach(post => {
      userIds.add(post.author);
    });

    const users = await User.find({ _id: { $in: Array.from(userIds) } });
    const userMap = new Map();
    users.forEach(u => {
      userMap.set(u._id.toString(), {
        userId: u.userId,
        name: u.name,
        image: u.image,
      });
    });

    // 批量計算轉發次數
    const postIds = posts.map(p => p._id.toString());
    const repostCounts = await Post.aggregate([
      {
        $match: {
          originalPost: { $in: postIds },
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

    const postsWithAuthors = posts.map(post => {
      const postObj = post.toObject();
      const authorData = userMap.get(post.author);
      
      if (authorData) {
        postObj.authorDetails = authorData;
      }

      // 添加轉發次數
      postObj.repostCount = repostCountMap.get(post._id.toString()) || 0;

      return postObj;
    });

    return NextResponse.json({ posts: postsWithAuthors });
  } catch (error) {
    console.error('Failed to fetch liked posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch liked posts' },
      { status: 500 }
    );
  }
}
