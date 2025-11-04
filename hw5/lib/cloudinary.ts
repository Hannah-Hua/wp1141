import { v2 as cloudinary } from 'cloudinary';

// 配置 Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * 上傳圖片到 Cloudinary
 * @param base64Image - Base64 格式的圖片字串（包含 data:image/... 前綴）
 * @param folder - 上傳的資料夾名稱（可選）
 * @returns Cloudinary 上傳結果，包含 secure_url
 */
export async function uploadImage(
  base64Image: string,
  folder: string = 'x-clone'
): Promise<string> {
  try {
    // 檢查環境變數是否設定
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary 環境變數未設定');
    }

    // 上傳圖片到 Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: folder,
      resource_type: 'image',
      // 自動優化圖片
      transformation: [
        {
          quality: 'auto',
          fetch_format: 'auto',
        },
      ],
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

/**
 * 刪除 Cloudinary 上的圖片
 * @param publicId - Cloudinary 的 public_id（從 URL 中提取）
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary 環境變數未設定');
    }

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
}

/**
 * 從 Cloudinary URL 提取 public_id
 * @param url - Cloudinary 的 secure_url
 * @returns public_id
 */
export function extractPublicId(url: string): string | null {
  try {
    // Cloudinary URL 格式: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{folder}/{filename}
    const match = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp|svg)$/i);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  } catch (error) {
    console.error('Failed to extract public_id:', error);
    return null;
  }
}

export default cloudinary;

