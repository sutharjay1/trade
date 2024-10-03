import "./globals.css";

import Header from "@/components/global/navbar";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { geistSans } from "@/lib/font";
import { cn } from "@/lib/utils";
import ClientProvider from "@/providers/client-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import TRPCProvider from "@/providers/trpc-provider";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "./api/auth/[...nextauth]/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen scroll-smooth w-full bg-background antialiased",
          geistSans.className,
        )}
      >
        <TRPCProvider>
          <TooltipProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <ClientProvider session={session}>
                <Toaster />

                <Header />
                {children}
              </ClientProvider>
            </ThemeProvider>
          </TooltipProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
