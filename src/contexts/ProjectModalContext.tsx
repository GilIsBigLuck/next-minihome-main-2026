'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ProjectModalContextType {
  selectedProjectId: number | null
  openModal: (id: number) => void
  closeModal: () => void
}

const ProjectModalContext = createContext<ProjectModalContextType | null>(null)

export function ProjectModalProvider({ children }: { children: ReactNode }) {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  const openModal = (id: number) => setSelectedProjectId(id)
  const closeModal = () => setSelectedProjectId(null)

  return (
    <ProjectModalContext.Provider value={{ selectedProjectId, openModal, closeModal }}>
      {children}
    </ProjectModalContext.Provider>
  )
}

export function useProjectModal() {
  const context = useContext(ProjectModalContext)
  if (!context) {
    throw new Error('useProjectModal must be used within ProjectModalProvider')
  }
  return context
}
