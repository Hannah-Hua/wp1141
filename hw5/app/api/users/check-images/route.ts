import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

/**
 * 檢查資料庫中所有用戶的 image 和 coverImage 欄位
 * 可用於：
 * - 查看哪些用戶有/沒有圖片
 * - 檢查圖片 URL 格式（Base64 或 Cloudinary URL）
 * - 統計圖片使用情況
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // 查詢所有用戶，只選擇相關欄位
    const users = await User.find({})
      .select('userId name image coverImage')
      .sort({ createdAt: -1 });

    // 統計資訊
    const stats = {
      total: users.length,
      hasImage: users.filter(u => u.image).length,
      hasCoverImage: users.filter(u => u.coverImage).length,
      hasBase64Image: users.filter(u => u.image && u.image.startsWith('data:image')).length,
      hasCloudinaryImage: users.filter(u => u.image && u.image.includes('cloudinary.com')).length,
      hasBase64CoverImage: users.filter(u => u.coverImage && u.coverImage.startsWith('data:image')).length,
      hasCloudinaryCoverImage: users.filter(u => u.coverImage && u.coverImage.includes('cloudinary.com')).length,
    };

    // 詳細列表
    const userList = users.map(user => ({
      userId: user.userId,
      name: user.name,
      image: {
        exists: !!user.image,
        type: user.image 
          ? (user.image.startsWith('data:image') ? 'Base64' : user.image.includes('cloudinary.com') ? 'Cloudinary' : 'Other URL')
          : 'None',
        // 只顯示前 50 個字符，避免 Base64 資料太長
        preview: user.image 
          ? (user.image.length > 50 ? user.image.substring(0, 50) + '...' : user.image)
          : null,
      },
      coverImage: {
        exists: !!user.coverImage,
        type: user.coverImage 
          ? (user.coverImage.startsWith('data:image') ? 'Base64' : user.coverImage.includes('cloudinary.com') ? 'Cloudinary' : 'Other URL')
          : 'None',
        preview: user.coverImage 
          ? (user.coverImage.length > 50 ? user.coverImage.substring(0, 50) + '...' : user.coverImage)
          : null,
      },
    }));

    return NextResponse.json({
      stats,
      users: userList,
    });
  } catch (error) {
    console.error('Failed to check images:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to check images',
        stats: null,
        users: []
      },
      { status: 500 }
    );
  }
}

