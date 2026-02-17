import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MatchFilters {
  minScore: number;
  maxScore: number;
  sortBy: "score" | "date" | "company";
  sortOrder: "asc" | "desc";
  showMatchedSkills: boolean;
  showMissingSkills: boolean;
}

interface MatchesStore {
  filters: MatchFilters;
  setFilter: <K extends keyof MatchFilters>(
    key: K,
    value: MatchFilters[K],
  ) => void;
  resetFilters: () => void;
}

const defaultFilters: MatchFilters = {
  minScore: 0,
  maxScore: 100,
  sortBy: "score",
  sortOrder: "desc",
  showMatchedSkills: true,
  showMissingSkills: true,
};

export const useMatchesStore = create<MatchesStore>()(
  persist(
    (set) => ({
      filters: defaultFilters,

      setFilter: (key, value) => {
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value,
          },
        }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },
    }),
    {
      name: "matches-filters-storage",
    },
  ),
);
