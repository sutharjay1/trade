import { TUser } from "@/type";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UserState = {
  user: TUser | {};
  order: {
    orderId: string;
    transactionId: string;
  };
  setOrder: ({
    orderId,
    transactionId,
  }: {
    orderId: string;
    transactionId: string;
  }) => void;
};

export const useOrder = create<UserState>()(
  persist(
    (set) => ({
      user: {},
      order: {
        orderId: "",
        transactionId: "",
      },
      setOrder: (userData) => set(() => ({ order: userData })),
    }),
    {
      name: "order-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
