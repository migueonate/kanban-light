import { Priority } from "@/pages/board/types";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

type FiltersState = {
  search: string;
  priority: Priority;
  setSearch: (query: string) => void;
  setPriority: (priority: Priority) => void;
  reset: () => void;
};

export const useFiltersStore = create<FiltersState>()(
  devtools(
    persist(
      (set) => ({
        search: "",
        priority: Priority.ALL,
        setSearch: (query) => set({ search: query }),
        setPriority: (priority) => set({ priority }),
        reset: () => set({ search: "", priority: Priority.ALL }),
      }),
      {
        name: "kanban-filters",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          search: state.search,
          priority: state.priority,
        }),
      }
    ),
    { name: "filtersStore" }
  )
);
