import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await paramsPromise;
    await connectDB();
    const user = await User.findOne({ userId: params.userId });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 檢查當前用戶是否在追蹤目標用戶（如果已登入）
    const session = await auth();
    let isFollowing = false;
    
    if (session?.user?.id && session.user.id !== user._id.toString()) {
      // 只查詢 following 欄位，減少資料傳輸
      const currentUser = await User.findById(session.user.id).select('following');
      if (currentUser && currentUser.following) {
        // 檢查當前用戶的 following 列表是否包含目標用戶的 _id
        // 這與 Follow API 的邏輯一致
        isFollowing = currentUser.following.includes(user._id.toString());
      }
    }

    const userObj = user.toObject();
    return NextResponse.json({ 
      user: userObj,
      isFollowing // 添加追蹤狀態
    });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await paramsPromise;
    const session = await auth();
    if (!session?.user?.userId || session.user.userId !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, bio, website, birthday, image, coverImage } = await request.json();

    await connectDB();

    const updateData: any = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (website !== undefined) updateData.website = website;
    if (birthday) {
      updateData.birthday = new Date(birthday);
    } else if (birthday === null || birthday === '') {
      updateData.birthday = null;
    }
    if (image) updateData.image = image;
    if (coverImage !== undefined) updateData.coverImage = coverImage;

    const user = await User.findOneAndUpdate(
      { userId: params.userId },
      updateData,
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
