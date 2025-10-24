"use client";

import { geistSans } from "@/lib/font";
import { cn } from "@/lib/utils";
import Banner from "./[uid]/_components/banner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn("min-h-screen", geistSans.className)}>
      <Banner />
      
      
      <div className="max-w-7xl mx-auto px-4 md:px-0">{children}</div>
    </div>
  );
}
