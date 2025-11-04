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

    // 檢查請求大小（Vercel 限制為 4.5MB）
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 4 * 1024 * 1024) {
      return NextResponse.json(
        { 
          error: '圖片太大。請使用較小的圖片（建議小於 2MB），或設定 Cloudinary 以使用雲端儲存。',
          code: 'PAYLOAD_TOO_LARGE'
        },
        { status: 413 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { 
          error: '請求格式錯誤。圖片可能太大，請使用較小的圖片或設定 Cloudinary。',
          code: 'INVALID_JSON'
        },
        { status: 400 }
      );
    }

    const { name, bio, website, birthday, image, coverImage } = body;

    // 檢查 Base64 圖片大小
    if (image && image.startsWith('data:image/')) {
      const base64Size = Math.ceil(image.length * 0.75); // Base64 約為原始大小的 1.33 倍
      if (base64Size > 3 * 1024 * 1024) { // 3MB 限制
        return NextResponse.json(
          { 
            error: '頭貼圖片太大（超過 3MB）。請使用較小的圖片或設定 Cloudinary。',
            code: 'IMAGE_TOO_LARGE',
            field: 'image'
          },
          { status: 413 }
        );
      }
    }

    if (coverImage && coverImage.startsWith('data:image/')) {
      const base64Size = Math.ceil(coverImage.length * 0.75);
      if (base64Size > 3 * 1024 * 1024) { // 3MB 限制
        return NextResponse.json(
          { 
            error: '背景圖片太大（超過 3MB）。請使用較小的圖片或設定 Cloudinary。',
            code: 'IMAGE_TOO_LARGE',
            field: 'coverImage'
          },
          { status: 413 }
        );
      }
    }

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

    // 清除相關快取，確保貼文中的作者資訊會更新
    const cache = (await import('@/lib/cache')).default;
    cache.deleteByPrefix('posts:');

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Failed to update user:', error);
    
    // 確保總是返回有效的 JSON
    if (error instanceof Error) {
      if (error.message.includes('PayloadTooLargeError') || error.message.includes('413')) {
        return NextResponse.json(
          { 
            error: '圖片太大。請使用較小的圖片（建議小於 2MB），或設定 Cloudinary 以使用雲端儲存。',
            code: 'PAYLOAD_TOO_LARGE'
          },
          { status: 413 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
