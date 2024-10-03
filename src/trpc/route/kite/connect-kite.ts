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
    .mutation(async ({ ctx, input }) => {
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

        console.log("Generating checksum with:", {
          apiKey: KITE_API_KEY,
          requestToken: request_token,
          apiSecret: KITE_API_KEY_SECRET,
        });

        const checkSum = generateChecksum({
          apiKey: KITE_API_KEY,
          requestToken: request_token,
          apiSecret: KITE_API_KEY_SECRET,
        });

        console.log("Checksum generated:", checkSum);

        // Making the Kite session request
        console.log(
          "Sending POST request to Kite API with the following payload:",
          {
            api_key: KITE_API_KEY,
            request_token: request_token,
            checksum: checkSum,
          },
        );

        try {
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

          console.log("Received response from Kite API:", response.data);

          if (!response.data) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Failed to generate session",
            });
          }

          const kiteData = response.data.data;

          let userKite;
          if (!user?.UserKite[0]?.kiteId) {
            console.log("Creating new Kite session for user:", user.id);

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
            console.error("API Error details:", {
              data: error.response.data,
              status: error.response.status,
              headers: error.response.headers,
            });

            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: `API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
            });
          } else if (error instanceof TRPCError) {
            throw error;
          } else {
            console.error("Unexpected error message:", error);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: `Unexpected error: ${error}`,
            });
          }
        }
      } catch (error) {
        console.error("Error generating session:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to generate session: ${error}`,
        });
      }
    }),

  getUserKite: privateProcedure
    .input(
      z.object({
        id: z.string().uuid(),
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
        throw new Error("Error fetching user kite");
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
          UserKite: {
            include: {
              portfolio: true,
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

      const userKite = await db.userKite.findFirst({
        where: {
          userId: input.id,
        },
        include: {
          portfolio: true,
          User: true,
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

        const existingStocks = user.UserKite[0].portfolio;

        console.log(`Existing stocks: ${JSON.stringify(existingStocks)}`);

        if (!user.isKiteVerfied) {
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

          console.log(`User profile:`, data);
          return {
            success: true,
            data,
          };
        }
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

      const user = await db.user.findUnique({
        where: {
          id: input.id,
        },
        include: {
          UserKite: {
            include: {
              portfolio: true,
              User: true,
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
              User: {
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
