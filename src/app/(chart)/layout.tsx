"use client";

import { geistSans } from "@/lib/font";
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <div className={cn("min-h-screen", geistSans.className)}>
    //   {children}
    // </div>

    <div
      className={cn(
        "min-h-screen  ",
        geistSans.className,
      )}
    >
      {children}
    </div>
  );
}
