import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// 取得所有用戶列表（用於登入頁面顯示）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    await connectDB();

    // 如果提供了 userId，查詢特定用戶的 Provider 資訊
    if (userId) {
      const user = await User.findOne({ userId }).select('userId name image provider');
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        user: {
          userId: user.userId,
          name: user.name,
          image: user.image,
          provider: user.provider,
        }
      });
    }

    // 否則返回所有用戶列表（只返回 userID 和名稱）
    const users = await User.find({})
      .select('userId name image')
      .sort({ createdAt: -1 })
      .limit(100); // 限制返回數量

    // 如果沒有用戶，返回空陣列而不是錯誤
    return NextResponse.json({
      users: users.map(user => ({
        userId: user.userId,
        name: user.name,
        image: user.image,
      }))
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    // 即使出錯也返回空陣列，避免前端顯示錯誤
    return NextResponse.json(
      { 
        users: [],
        error: error instanceof Error ? error.message : 'Failed to fetch users' 
      },
      { status: 500 }
    );
  }
}

