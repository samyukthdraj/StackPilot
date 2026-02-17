import { create } from "zustand";
import { persist } from "zustand/middleware";

interface JobFilters {
  country: string;
  role: string;
  days: number;
  search: string;
  jobType: string[];
  salaryMin: number;
  salaryMax: number;
  remote: boolean;
}

interface JobFiltersStore {
  filters: JobFilters;
  setFilter: <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => void;
  resetFilters: () => void;
  hasActiveFilters: () => boolean;
}

const defaultFilters: JobFilters = {
  country: "us",
  role: "",
  days: 7,
  search: "",
  jobType: [],
  salaryMin: 0,
  salaryMax: 200000,
  remote: false,
};

export const useJobFiltersStore = create<JobFiltersStore>()(
  persist(
    (set, get) => ({
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

      hasActiveFilters: () => {
        const { filters } = get();
        return (
          filters.role !== "" ||
          filters.search !== "" ||
          filters.jobType.length > 0 ||
          filters.remote ||
          filters.country !== "us" ||
          filters.days !== 7 ||
          filters.salaryMin !== 0 ||
          filters.salaryMax !== 200000
        );
      },
    }),
    {
      name: "job-filters-storage",
    },
  ),
);
