import { User } from "@/lib/types";
import { create } from "zustand";

type UserStore = {
  user?: User;
  setUser: (user?: User) => void;
};

export const useUsersStore = create<UserStore>()((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));
