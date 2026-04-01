import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await paramsPromise;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.userId === params.userId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    await connectDB();

    const targetUser = await User.findOne({ userId: params.userId });
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const currentUser = await User.findById(session.user.id);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Current user not found' },
        { status: 404 }
      );
    }

    const isFollowing = currentUser.following.includes(targetUser._id.toString());

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(session.user.id, {
        $pull: { following: targetUser._id.toString() },
      });
      await User.findByIdAndUpdate(targetUser._id, {
        $pull: { followers: session.user.id },
      });
      console.log('[Follow API] Unfollowed user:', targetUser._id.toString());
    } else {
      // Follow
      await User.findByIdAndUpdate(session.user.id, {
        $addToSet: { following: targetUser._id.toString() },
      });
      await User.findByIdAndUpdate(targetUser._id, {
        $addToSet: { followers: session.user.id },
      });
      console.log('[Follow API] Followed user:', targetUser._id.toString());
    }

    // 清除貼文快取，確保 Following 頁面會重新查詢
    const cache = (await import('@/lib/cache')).default;
    
    // 清除當前用戶的 Following 快取（使用新的快取鍵格式）
    const followingCacheKey = `posts:${session.user.id}:following:true`;
    cache.delete(followingCacheKey);
    console.log('[Follow API] Deleted Following cache for user:', session.user.id, 'key:', followingCacheKey);
    
    // 同時清除所有 posts 快取（以防萬一）
    cache.deleteByPrefix('posts:');
    console.log('[Follow API] Cleared posts cache');

    return NextResponse.json({ success: true, isFollowing: !isFollowing });
  } catch (error) {
    console.error('Failed to follow/unfollow:', error);
    return NextResponse.json(
      { error: 'Failed to follow/unfollow' },
      { status: 500 }
    );
  }
}
