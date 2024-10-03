"use server";

import { db } from "@/db";
import { KITE_API_KEY } from "@/kite";
import { TRPCError } from "@trpc/server";

// Define the action
export async function updateUserKiteProfile({ id }: { id: string }) {
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

  try {
    const response = await fetch("https://api.kite.trade/portfolio/holdings", {
      method: "GET",
      headers: {
        "X-Kite-Version": "3",
        Authorization: `token ${KITE_API_KEY}:${userKite.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    const data = await response.json();

    if (userKite?.portfolio?.length === 0) {
      const portfolios = data.data.map((stock: any) => ({
        tradingSymbol: stock.tradingsymbol,
        exchange: stock.exchange,
        instrumentToken: stock.instrument_token,
        isin: stock.isin,
        product: stock.product,
        price: stock.price,
        quantity: stock.quantity,
        usedQuantity: stock.used_quantity,
        t1Quantity: stock.t1_quantity,
        realisedQuantity: stock.realised_quantity,
        authorisedQuantity: stock.authorised_quantity,
        authorisedDate: new Date(stock.authorised_date),
        openingQuantity: stock.opening_quantity,
        collateralQuantity: stock.collateral_quantity,
        collateralType: stock.collateral_type || "",
        discrepancy: stock.discrepancy,
        averagePrice: stock.average_price,
        lastPrice: stock.last_price,
        closePrice: stock.close_price,
        pnl: stock.pnl,
        dayChange: stock.day_change,
        dayChangePercentage: stock.day_change_percentage,
        userKiteId: userKite.id,
      }));

      await db.portfolio.createMany({
        data: portfolios,
        skipDuplicates: true,
      });

      console.log("Portfolios created successfully");
    }

    console.log(`User profile:`, data);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to update user kite profile: ${error.message}`,
    });
  }
}
