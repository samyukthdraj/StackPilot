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
  country: "us",
  role: "",
  days: 7,
  search: "",
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
          filters.search !== "" ||
          filters.jobType.length > 0 ||
          filters.remote ||
          filters.country !== "us" ||
          filters.days !== 7 ||
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
      version: 3,
      migrate: (persistedState: unknown, version: number) => {
        if (version < 3 && persistedState && typeof persistedState === 'object') {
          const state = persistedState as { state?: { filters?: Record<string, unknown> } };
          // Zustand persist wraps the state in a 'state' key
          if (state.state && state.state.filters) {
            const filters = state.state.filters;
            // Migrating old string values to arrays (v0 -> v1)
            if (typeof filters.filterLocation === "string") {
              filters.filterLocation = 
                filters.filterLocation === "all" ? [] : [filters.filterLocation];
            }
            if (typeof filters.filterCompany === "string") {
              filters.filterCompany = 
                filters.filterCompany === "all" ? [] : [filters.filterCompany];
            }
            // Inject new experience defaults
            if (filters.experienceMin === undefined) {
              filters.experienceMin = 0;
            }
            if (filters.experienceMax === undefined) {
              filters.experienceMax = 15;
            }
          }
        }
        return persistedState as JobFiltersStore;
      },
    },
  ),
);
