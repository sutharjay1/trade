"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth/next";

export default async function getUserStockSymbolData({
  stockSymbol,
}: {
  stockSymbol: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to view this data",
    });
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email: session.user?.email as string,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const userKite = await db.userKite.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!userKite) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User's Kite information not found",
      });
    }

    const userStock = await db.portfolio.findFirst({
      where: {
        userKiteId: userKite.id,
        tradingSymbol: stockSymbol,
      },
    });

    if (!userStock) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Stock with symbol ${stockSymbol} not found in user's portfolio`,
      });
    }

    return userStock;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occurred while retrieving stock data",
    });
  }
}
