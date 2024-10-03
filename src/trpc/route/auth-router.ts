import { TRPCError } from "@trpc/server";
import { privateProcedure, publicProcedure, router } from "../trpc";
import { db } from "@/db";
import { z } from "zod";

export const authRouter = router({
  authCallback: privateProcedure
    .input(
      z
        .object({
          email: z.string().optional().nullable(),
        })
        .optional(),
    )
    .mutation(async ({ ctx }) => {
      const { session } = ctx;
      if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const dbUser = await db.user.findFirst({
        where: {
          email: session.user?.email as string,
        },
      });

      console.log("dbUser", dbUser, session.user?.email);

      if (!dbUser) {
        const newUser = await db.user.create({
          data: {
            email: session.user?.email as string,
            name: session.user?.name as string,
            avatar: session.user?.image as string,
          },
        });
        return { success: true, user: newUser };
      }

      return { success: true, user: dbUser };
    }),

  isVerfied: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input }) => {
      const { email } = input;
      try {
        console.log("email", email);
        const dbUser = await db.user.findFirst({
          where: {
            email,
          },
        });
        console.log("dbUser", dbUser);
        if (!dbUser) {
          return { success: false, user: null, message: "User not found" };
        }
        return { success: true, user: dbUser };
      } catch (error) {
        console.error("Error details:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred during verification",
        });
      }
    }),
});
