'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface TemplateModalContextType {
  selectedTemplateId: number | null
  openModal: (id: number) => void
  closeModal: () => void
}

const TemplateModalContext = createContext<TemplateModalContextType | null>(null)

export function TemplateModalProvider({ children }: { children: ReactNode }) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null)

  const openModal = (id: number) => setSelectedTemplateId(id)
  const closeModal = () => setSelectedTemplateId(null)

  return (
    <TemplateModalContext.Provider value={{ selectedTemplateId, openModal, closeModal }}>
      {children}
    </TemplateModalContext.Provider>
  )
}

export function useTemplateModal() {
  const context = useContext(TemplateModalContext)
  if (!context) {
    throw new Error('useTemplateModal must be used within TemplateModalProvider')
  }
  return context
}
