import { ModalType } from "@/type";
import { Portfolio } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const defaultValues: Portfolio = {
  id: "",
  authorisedDate: new Date(),
  quantity: 0,
  authorisedQuantity: 0,
  averagePrice: 0,
  closePrice: 0,
  collateralQuantity: 0,
  collateralType: "",
  dayChange: 0,
  dayChangePercentage: 0,
  discrepancy: false,
  exchange: "",
  instrumentToken: 0,
  isin: "",
  lastPrice: 0,
  pnl: 0,
  openingQuantity: 0,
  price: 0,
  product: "",
  realisedQuantity: 0,
  t1Quantity: 0,
  tradingSymbol: "",
  usedQuantity: 0,
  userKiteId: "",
};

interface ModalState {
  isOpen: boolean;
  stockData: Portfolio;
  modalType: ModalType | null;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
  updateStockData: (data: Portfolio) => void;
}

export const useModal = create<ModalState>()(
  persist(
    (set) => ({
      isOpen: false,
      modalType: null,
      stockData: defaultValues,
      onOpen: (type: ModalType) => {
        if (type === "VIEW_STOCK") {
          set({ isOpen: true, modalType: type });
        } else if (type === "LOADING") {
          set({ isOpen: true, modalType: "LOADING" });
        }
      },
      onClose: () => set({ isOpen: false, modalType: null }),
      updateStockData: (data: Portfolio) => set({ stockData: data }),
    }),
    { name: "modal", storage: createJSONStorage(() => localStorage) },
  ),
);
