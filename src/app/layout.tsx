import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "DigiTwin — Biological Digital Twin",
  description:
    "DigiTwin is an AI-powered Biological Digital Twin operating system that simulates metabolic and physiological impact of choices before they happen. Built for Alpic/Skybridge with Dify workflow orchestration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
