import { z } from "zod";
import axios from "axios";
import crypto from "crypto";
import { db } from "@/db";
import { DematConsentType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { privateProcedure, router } from "../../trpc";
import { KITE_API_KEY, KITE_API_KEY_SECRET } from "@/kite";

export function generateChecksum({
  apiKey,
  requestToken,
  apiSecret,
}: {
  apiKey: string;
  requestToken: string;
  apiSecret: string;
}) {
  const combinedString = `${apiKey}${requestToken}${apiSecret}`;
  const hash = crypto.createHash("sha256");
  hash.update(combinedString);
  return hash.digest("hex");
}

export const kiteRouter = router({
  generateSession: privateProcedure
    .input(
      z.object({
        userInfo: z.object({
          id: z.number().or(z.string()),
          email: z.string(),
          name: z.string(),
          avatar: z.string().nullable(),
        }),
        request_token: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { request_token, userInfo } = input;
      const { session } = ctx;

      try {
        const user = await db.user.findUnique({
          where: {
            email: session?.user?.email as string,
          },
          include: {
            UserKite: true,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const checkSum = generateChecksum({
          apiKey: KITE_API_KEY,
          requestToken: request_token,
          apiSecret: KITE_API_KEY_SECRET,
        });

        const response = await axios.post(
          "https://api.kite.trade/session/token",
          new URLSearchParams({
            api_key: KITE_API_KEY,
            request_token: request_token,
            checksum: checkSum,
          }).toString(),
          {
            headers: {
              "X-Kite-Version": "3",
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );

        if (!response.data) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to generate session",
          });
        }

        const kiteData = response.data.data;
        let userKite;

        if (!user?.UserKite[0]?.kiteId) {
          userKite = await db.userKite.create({
            data: {
              userId: user.id,
              kiteId: kiteData.user_id,
              userType: kiteData.user_type,
              broker: "ZERODHA",
              exchanges: kiteData.exchanges,
              products: kiteData.products,
              orderTypes: kiteData.order_types,
              email: kiteData.email,
              userName: kiteData.user_name,
              apiKey: kiteData.api_key,
              userShortname: kiteData.user_shortname,
              accessToken: kiteData.access_token,
              publicToken: kiteData.public_token,
              refreshToken: kiteData.refresh_token || null,
              enctoken: kiteData.enctoken,
              loginTime: new Date(kiteData.login_time),
              dematConsent: DematConsentType.CONSENT,
            },
          });

          const findUpdatedUser = await db.user.findFirst({
            where: {
              id: user.id,
            },
            include: {
              UserKite: true,
            },
          });

          return {
            success: true,
            user: findUpdatedUser,
          };
        }

        const findUpdatedUser = await db.user.findFirst({
          where: {
            id: user.id,
          },
          include: {
            UserKite: true,
          },
        });
        return {
          success: true,
          user: findUpdatedUser,
        };
      } catch (error: any) {
        console.error("Error generating session:", error);
        if (axios.isAxiosError(error) && error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
          });
        } else if (error instanceof TRPCError) {
          throw error;
        } else {
          console.error("Error message:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Unexpected error: ${error}`,
          });
        }
      }
    }),

  getUserKite: privateProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const { session } = ctx;

      try {
        const data = await db.userKite.findFirst({
          where: {
            userId: id,
          },
        });

        if (!data) {
          return null;
        }

        return data;
      } catch (error) {
        console.error("Error fetching user kite:", error);
        // redirect(`/u/${id}`);
      }
    }),

  updateUserKiteProfile: privateProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const { session } = ctx;

      const user = await db.user.findFirst({
        where: {
          id: input.id,
        },
        include: {
          UserKite: true,
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
          userId: input.id,
        },
        include: {
          portfolio: true,
          user: true,
        },
      });

      if (!userKite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "UserKite not found",
        });
      }

      try {
        const response = await fetch(
          "https://api.kite.trade/portfolio/holdings",
          {
            method: "GET",
            headers: {
              "X-Kite-Version": "3",
              Authorization: `token ${KITE_API_KEY}:${userKite.accessToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }

        const data = await response.json();

        if (userKite.portfolio.length === 0) {
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
            authorisedDate: new Date(stock.authorised_date), // Convert to Date
            openingQuantity: stock.opening_quantity,
            collateralQuantity: stock.collateral_quantity,
            collateralType: stock.collateral_type || "", // Default to empty string if null
            discrepancy: stock.discrepancy,
            averagePrice: stock.average_price,
            lastPrice: stock.last_price,
            closePrice: stock.close_price,
            pnl: stock.pnl,
            dayChange: stock.day_change,
            dayChangePercentage: stock.day_change_percentage,
            userKiteId: userKite.id, // Associate with the userKite entity
          }));

          await db.portfolio
            .createMany({
              data: portfolios,
              skipDuplicates: true,
            })
            .then(() => {
              console.log("Portfolios created successfully");
            });
        }

        console.log(`User profile:`, data);
        return {
          success: true,
          data,
        };
      } catch (error) {
        console.error("Error  fetching user profile:", error);
        // redirect(`/u/${id}`);
      }
    }),

  getUserPortfolioStocks: privateProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const { session } = ctx;

      const user = await db.user.findFirst({
        where: {
          id: input.id,
        },
        include: {
          UserKite: {
            include: {
              portfolio: true,
              user: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      try {
        const data = await db.portfolio.findMany({
          where: {
            userKite: {
              user: {
                id: user.id,
              },
            },
          },
        });

        return data;
      } catch (error) {
        console.error("Error  fetching user profile:", error);
      }
    }),

  isConnectedKite: privateProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const { session } = ctx;

      const user = await db.user.findFirst({
        where: {
          id: input.id,
        },
        include: {
          UserKite: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (
        !user.UserKite[0].accessToken &&
        !user.UserKite[0].refreshToken &&
        !user.UserKite[0].enctoken
      ) {
        return false;
      }

      return true;
    }),
});