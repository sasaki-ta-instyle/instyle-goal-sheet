import type { Metadata } from "next";
import { Lato, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const lato = Lato({
  weight: ['100', '300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "目標設定シート | INSTYLE GROUP",
  description: "INSTYLE GROUP 目標設定フォーム — 入力内容をPPTXで書き出します",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${lato.variable} ${notoSansJP.variable}`}>
      <body>{children}</body>
    </html>
  );
}
