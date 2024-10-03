import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type KiteRequest = {
  requestToken: string;
  setRequestToken: (requestToken: string) => void;
};

export const useKiteRequest = create<KiteRequest>()(
  persist(
    (set) => ({
      requestToken: "",
      setRequestToken: (requestToken: string) => set({ requestToken }), //
    }),
    {
      name: "kite-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
