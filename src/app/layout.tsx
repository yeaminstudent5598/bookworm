import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BookWorm | Your Personalized Reading Tracker",
  description: "Discover new books, track your reading progress, and get personalized recommendations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#05140b] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}