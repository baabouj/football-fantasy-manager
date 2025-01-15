import { create } from "zustand";

import { type Team } from "@/lib/types";

type TeamStore = {
  team?: Team;
  setTeam: (team?: Team) => void;
};

export const useTeamsStore = create<TeamStore>()((set) => ({
  team: undefined,
  setTeam: (team) => set({ team }),
}));
