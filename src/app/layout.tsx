import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChinaAI API - Access Chinese LLMs Without Barriers",
  description: "Unified API for DeepSeek, Qwen, and other Chinese AI models. No Chinese phone number required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
