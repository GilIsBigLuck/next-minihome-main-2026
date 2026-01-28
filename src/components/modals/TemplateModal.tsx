'use client'

import { useTemplateModal } from '@/contexts/TemplateModalContext'
import { TEMPLATES } from '@/components/pages/home/canvas/templates/templates.config'
import { BaseModal } from './BaseModal'

export function TemplateModal() {
  const { selectedTemplateId, closeModal } = useTemplateModal()
  const open = selectedTemplateId !== null

  const template = TEMPLATES.find((t) => t.id === selectedTemplateId)

  if (!template) return null

  return (
    <BaseModal
      open={open}
      onOpenChange={(isOpen) => !isOpen && closeModal()}
      title={`Template ${template.id}`}
      description={`This is a preview of template ${template.id}. Add more details here later.`}
      image={{
        src: template.image,
        alt: `Template ${template.id}`,
      }}
      actions={
        <>
          <button className="flex-1 px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
            Purchase
          </button>
          <button className="flex-1 px-8 py-3 border border-gray-300 rounded-full font-medium hover:border-black transition-colors">
            Preview
          </button>
        </>
      }
    />
  )
}
