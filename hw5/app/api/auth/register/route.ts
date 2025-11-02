import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { userId, provider, providerId, name, email, image } = await request.json();

    // 驗證必填欄位
    if (!userId || !provider || !providerId || !name || !email) {
      return NextResponse.json(
        { error: '缺少必填欄位' },
        { status: 400 }
      );
    }

    // 驗證 userId 格式
    if (userId.length < 3 || userId.length > 20) {
      return NextResponse.json(
        { error: 'UserID 必須介於 3-20 個字元之間' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(userId)) {
      return NextResponse.json(
        { error: 'UserID 只能包含字母、數字和底線' },
        { status: 400 }
      );
    }

    await connectDB();

    // 檢查 userId 是否已被使用
    const existingUserId = await User.findOne({ userId });
    if (existingUserId) {
      return NextResponse.json(
        { error: '此 UserID 已被使用，請選擇其他 UserID' },
        { status: 400 }
      );
    }

    // 檢查是否已用此 provider 註冊過
    const existingProvider = await User.findOne({ provider, providerId });
    if (existingProvider) {
      return NextResponse.json(
        { error: '此帳號已註冊過' },
        { status: 400 }
      );
    }

    // 建立新用戶
    const user = await User.create({
      userId,
      name,
      email,
      image,
      provider,
      providerId,
      following: [],
      followers: [],
    });

    return NextResponse.json(
      { 
        success: true,
        user: {
          id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: '註冊時發生錯誤' },
      { status: 500 }
    );
  }
}
