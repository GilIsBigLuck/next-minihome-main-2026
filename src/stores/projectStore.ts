import { create } from 'zustand'

interface ProjectStore {
  clickedIndex: number | null
  setClicked: (index: number | null) => void
}

export const useProjectStore = create<ProjectStore>((set) => ({
  clickedIndex: null,
  setClicked: (index) => set({ clickedIndex: index }),
}))
