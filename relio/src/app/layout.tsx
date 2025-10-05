import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const arrayRegular = localFont({
  src: "../../Array-Regular.otf",
  variable: "--font-array",
});

export const metadata: Metadata = {
  title: "Relio - Turn Your Resume Into a Portfolio in Seconds",
  description: "Instantly convert your resume into a beautiful portfolio website using AI. No coding required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${arrayRegular.variable} antialiased bg-black text-white`}
      >
  <Providers>{children}</Providers>
  <Analytics />
  <SpeedInsights />
      </body>
    </html>
  );
}
