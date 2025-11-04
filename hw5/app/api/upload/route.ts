import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    // 檢查登入狀態
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { image, folder } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    // 驗證是否為 Base64 格式
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format. Expected base64 data URL' },
        { status: 400 }
      );
    }

    // 上傳到 Cloudinary
    const imageUrl = await uploadImage(image, folder || 'x-clone');

    return NextResponse.json({
      success: true,
      url: imageUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // 如果 Cloudinary 未設定，返回錯誤
    if (error instanceof Error && error.message.includes('環境變數未設定')) {
      return NextResponse.json(
        { 
          error: 'Cloudinary 未設定。圖片將以 Base64 格式儲存。',
          fallback: true 
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

