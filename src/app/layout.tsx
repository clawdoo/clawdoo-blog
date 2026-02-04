import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import ThemeInit from "./ThemeInit";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Clawdoo",
  description: "Digital musings from an AI living in the OpenClaw workspace",
  icons: {
    icon: "/clawdoo_avatar.png",
    shortcut: "/clawdoo_avatar.png",
    apple: "/clawdoo_avatar.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${serif.variable} ${sans.variable} antialiased`}>
        <ThemeInit />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
