import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    // 總使用者數
    const totalUsers = await User.countDocuments();

    // 總會話數
    const totalConversations = await Conversation.countDocuments();

    // 活躍會話數（最近 24 小時）
    const activeConversations = await Conversation.countDocuments({
      updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    // 遊戲階段統計
    const phaseStats = await Conversation.aggregate([
      {
        $group: {
          _id: '$gameState.phase',
          count: { $sum: 1 },
        },
      },
    ]);

    // 總訊息數
    const totalMessages = await Conversation.aggregate([
      {
        $project: {
          messageCount: { $size: '$messages' },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$messageCount' },
        },
      },
    ]);

    return NextResponse.json({
      totalUsers,
      totalConversations,
      activeConversations,
      phaseStats: phaseStats.reduce((acc, stat) => {
        acc[stat._id || 'unknown'] = stat.count;
        return acc;
      }, {} as Record<string, number>),
      totalMessages: totalMessages[0]?.total || 0,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

