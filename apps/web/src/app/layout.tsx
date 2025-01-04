import { cn } from "@repo/ui";
import "./globals.css";
import "@repo/ui/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { JSX } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PEI Engineering Dashboard",
  description: "A comprehensive dashboard for PEI engineering projects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-white text-black")}>{children}</body>
    </html>
  );
}
