import { create } from 'zustand';

interface UserInfo {
  id: number;
  email: string;
  name: string;
  userCode: string;
}

interface UserStore {
  user: UserInfo | null;
  setUser: (user: UserInfo) => void;
  clearUser: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export default useUserStore;
