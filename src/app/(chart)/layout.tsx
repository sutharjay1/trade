"use client";

import MaxWidthWrapper from "@/components/global/max-width-wrapper";
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
        "min-h-screen pt-40 sm:pt-36 md:pt-32",
        geistSans.className,
      )}
    >
      {children}
    </div>
  );
}
