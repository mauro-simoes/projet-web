import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import '@smastrom/react-rating/style.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VideoSon",
  description: "Boutique en ligne d'audiovisuels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <Toaster position="top-right" toastOptions={{
    classNames: {
      error: 'bg-red-400 text-black',
      success: 'bg-green-400 text-black',
      warning: 'text-yellow-400',
      info: 'bg-blue-400',
    },
  }} closeButton />
    </html>
  );
}
