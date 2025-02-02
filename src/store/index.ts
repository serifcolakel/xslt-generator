import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import type {} from "@redux-devtools/extension";

type BearStore = {
  bears: number;
  addBear: () => void;
};

export const useBearStore = create<BearStore>()(
  devtools(
    persist(
      (set, get) => ({
        bears: 0,
        addBear: () => set({ bears: get().bears + 1 }),
      }),
      {
        name: "food-storage",
        storage: createJSONStorage(() => localStorage),
      }
    ),
    {
      name: "food-storage",
    }
  )
);
