import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

/**
 * 測試 Cloudinary 環境變數是否正確設定
 * 訪問：/api/upload/test
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    return NextResponse.json({
      hasCloudName: !!cloudName,
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
      cloudNameValue: cloudName ? `${cloudName.substring(0, 3)}...` : null,
      apiKeyValue: apiKey ? `${apiKey.substring(0, 3)}...` : null,
      allSet: !!(cloudName && apiKey && apiSecret),
      message: (cloudName && apiKey && apiSecret) 
        ? 'Cloudinary 環境變數已正確設定' 
        : 'Cloudinary 環境變數未完整設定',
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json(
      { error: 'Failed to test Cloudinary config' },
      { status: 500 }
    );
  }
}

