import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "遺失在台大地下室的秘寶 - LINE Bot",
  description: "LINE Bot 文字冒險 RPG 遊戲",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}

