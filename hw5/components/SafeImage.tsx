'use client';

import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  [key: string]: any; // 允許其他 props
}

/**
 * SafeImage 組件：自動處理 Base64 圖片
 * - 如果是 Base64（data:image/...），使用普通的 <img> 標籤
 * - 如果是 URL，使用 Next.js Image 組件進行優化
 */
export default function SafeImage({ src, alt, width, height, fill, className, loading, sizes, ...props }: SafeImageProps) {
  // 檢查是否為 Base64 圖片
  const isBase64 = src && src.startsWith('data:image/');

  if (isBase64) {
    // Base64 圖片使用普通的 <img> 標籤，因為 Next.js Image 無法優化 Base64
    if (fill) {
      // 如果使用 fill，使用絕對定位的 <img>
      return (
        <img
          src={src}
          alt={alt}
          className={className}
          loading={loading}
          style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', inset: 0 }}
          {...props}
        />
      );
    }
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loading}
        {...props}
      />
    );
  }

  // URL 圖片使用 Next.js Image 組件進行優化
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        loading={loading}
        sizes={sizes}
        {...props}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
      {...props}
    />
  );
}

