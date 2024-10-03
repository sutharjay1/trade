import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from ".";
import { QueryClient } from "@tanstack/react-query";

export const trpc = createTRPCReact<AppRouter>({});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});
