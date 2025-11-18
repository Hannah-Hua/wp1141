import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const lineUserId = searchParams.get('lineUserId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const phase = searchParams.get('phase');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // 建立查詢條件
    const query: {
      lineUserId?: string;
      'gameState.phase'?: string;
      createdAt?: {
        $gte?: Date;
        $lte?: Date;
      };
    } = {};
    
    if (lineUserId) {
      query.lineUserId = lineUserId;
    }
    
    if (phase) {
      query['gameState.phase'] = phase;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // 查詢會話
    const conversations = await Conversation.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    // 取得總數
    const total = await Conversation.countDocuments(query);

    // 取得使用者資訊
    const userIds = [...new Set(conversations.map((c) => (c as unknown as { lineUserId: string }).lineUserId))];
    const users = await User.find({ lineUserId: { $in: userIds } }).lean();
    const userMap = new Map(users.map((u) => [(u as unknown as { lineUserId: string }).lineUserId, u]));

    // 組合資料
    const result = conversations.map((conv) => {
      const convTyped = conv as unknown as { lineUserId: string; messages: unknown[] };
      return {
        ...conv,
        user: userMap.get(convTyped.lineUserId) || null,
        messageCount: convTyped.messages.length,
        lastMessage: convTyped.messages[convTyped.messages.length - 1] || null,
      };
    });

    return NextResponse.json({
      conversations: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin conversations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

