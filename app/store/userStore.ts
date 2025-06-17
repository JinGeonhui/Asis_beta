// store/userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserInfo = {
  name: string;
  email: string;
  userCode: string;
};

type UserStore = {
  user: UserInfo | null;
  setUser: (user: UserInfo) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-storage",
    }
  )
);
