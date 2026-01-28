'use client'

import { useProjectModal } from '@/contexts/ProjectModalContext'
import { PROJECTS } from '@/components/pages/home/canvas/projects/projects.config'
import { BaseModal } from './BaseModal'

export function ProjectModal() {
  const { selectedProjectId, closeModal } = useProjectModal()
  const open = selectedProjectId !== null

  const project = PROJECTS.find((p) => p.id === selectedProjectId)

  if (!project) return null

  return (
    <BaseModal
      open={open}
      onOpenChange={(isOpen) => !isOpen && closeModal()}
      title={`Project ${project.id}`}
      description={`This is a preview of project ${project.id}. Add more details here later.`}
      image={{
        src: project.image,
        alt: `Project ${project.id}`,
      }}
      actions={
        <>
          <button className="flex-1 px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
            View Details
          </button>
          <button className="flex-1 px-8 py-3 border border-gray-300 rounded-full font-medium hover:border-black transition-colors">
            Live Demo
          </button>
        </>
      }
    />
  )
}
