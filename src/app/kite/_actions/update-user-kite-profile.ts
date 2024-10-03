"use server";

import { db } from "@/db";
import { TRPCError } from "@trpc/server";

// Define the action
export async function isPortfolioConnected({ id }: { id: string }) {
  try {
    const user = await db.user.findUnique({
      where: { id },
      include: { UserKite: true },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const userKite = await db.userKite.findFirst({
      where: { userId: id },
      include: { portfolio: true, User: true },
    });

    if (!userKite) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "UserKite not found",
      });
    }

    const isPortfolioConnected = !!userKite.portfolio;

    return isPortfolioConnected;
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to update user kite profile: ${error.message}`,
    });
  }
}
