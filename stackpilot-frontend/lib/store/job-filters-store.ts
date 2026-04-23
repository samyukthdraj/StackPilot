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
  experienceMin: number;
  experienceMax: number;
  remote: boolean;
  filterLocation: string[];
  filterCompany: string[];
}

interface JobFiltersStore {
  filters: JobFilters;
  setFilter: <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => void;
  resetFilters: () => void;
  hasActiveFilters: () => boolean;
}

const defaultFilters: JobFilters = {
  country: "in",
  role: "",
  days: 30,
  search: "software engineer",
  jobType: [],
  salaryMin: 0,
  salaryMax: 200000,
  experienceMin: -1,
  experienceMax: 15,
  remote: false,
  filterLocation: [],
  filterCompany: [],
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
          filters.search !== "software engineer" ||
          filters.jobType.length > 0 ||
          filters.remote ||
          filters.country !== "in" ||
          filters.days !== 30 ||
          filters.salaryMin !== 0 ||
          filters.salaryMax !== 200000 ||
          filters.experienceMin !== -1 ||
          filters.experienceMax !== 15 ||
          filters.filterLocation.length > 0 ||
          filters.filterCompany.length > 0
        );
      },
    }),
    {
      name: "job-filters-storage",
      version: 6,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as { 
          state?: { 
            filters?: JobFilters 
          } 
        };
        
        if (state?.state?.filters) {
          const filters = state.state.filters;
          
          if (version < 4) {
            // Reset days to 0 (all time) since old default of 7 filtered out all db jobs
            filters.days = 0;
          }

          if (version < 6) {
            // Force apply new defaults for India market and 30 day window
            // We check for the old defaults (us/7) or missing values
            if (filters.country === "us" || !filters.country) {
              filters.country = "in";
            }
            if (filters.days === 7 || filters.days === 0 || !filters.days) {
              filters.days = 30;
            }
            
            // Ensure experience is set to "Any" if not present
            if (filters.experienceMin === undefined || filters.experienceMin === null) {
              filters.experienceMin = -1;
            }
          }
        }
        
        return persistedState as JobFiltersStore;
      },
    },
  ),
);
