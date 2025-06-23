import { create } from "zustand";

interface PasswordModalState {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const usePasswordModalStore = create<PasswordModalState>((set) => ({
  open: false,
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
}));
