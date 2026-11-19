import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, DeliveryAddress } from "@/types";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  savedAddress: DeliveryAddress | null;
  // Actions
  login: (email: string, username?: string, phone?: string) => void;
  logout: () => void;
  updateAddress: (address: DeliveryAddress) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      savedAddress: null,

      login: (email: string, username?: string, phone?: string) => {
        const derivedUsername =
          username?.trim() || email.split("@")[0] || "Protagonist Member";
        const derivedPhone = phone?.trim() || "+81 90 1234 5678";

        set({
          isAuthenticated: true,
          user: {
            username: derivedUsername,
            email: email.trim(),
            phone: derivedPhone,
            tier: "Protagonist Tier 01",
            joinedDate: new Date().toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            }),
          },
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },

      updateAddress: (address: DeliveryAddress) => {
        set({
          savedAddress: address,
        });
      },
    }),
    {
      name: "maincharacter-auth",
    }
  )
);
