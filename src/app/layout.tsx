import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BURank — Bennett University LeetCode Leaderboard",
  description:
    "Compete, track progress, and rank among Bennett University coders.",
  openGraph: {
    title: "BURank",
    description: "Bennett University LeetCode Leaderboard",
    type: "website",
    siteName: "BURank",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-bg font-sans">
        {/*
          SessionProvider must wrap everything so useSession()
          works in any client component.
        */}
        <SessionProvider>
          <Providers>{children}</Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
