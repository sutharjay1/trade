import { authRouter } from "./route/auth-router";
import { kiteRouter } from "./route/kite/connect-kite";
import { router } from "./trpc";

export const appRouter = router({
  auth: authRouter,
  kite: kiteRouter,
});

export type AppRouter = typeof appRouter;
