import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  itemIds: string[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  getTotalItems: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      itemIds: [],
      addItem: (id: string) => {
        if (!get().itemIds.includes(id)) {
          set({ itemIds: [...get().itemIds, id] });
        }
      },
      removeItem: (id: string) => {
        set({ itemIds: get().itemIds.filter((item) => item !== id) });
      },
      toggleItem: (id: string) => {
        if (get().itemIds.includes(id)) {
          set({ itemIds: get().itemIds.filter((item) => item !== id) });
        } else {
          set({ itemIds: [...get().itemIds, id] });
        }
      },
      hasItem: (id: string) => get().itemIds.includes(id),
      getTotalItems: () => get().itemIds.length,
    }),
    {
      name: "maincharacter-wishlist",
    }
  )
);
