'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { ReactNode } from 'react'
import Image from 'next/image'

interface BaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  image?: { src: string; alt: string }
  children?: ReactNode
  actions?: ReactNode
  maxWidth?: string
}

const overlayClass = "fixed inset-0 z-modal bg-black/50 backdrop-blur-sm data-[state=open]:opacity-100 data-[state=closed]:opacity-0 transition-opacity duration-200"
const contentBaseClass = "fixed left-[50%] top-[50%] z-modal w-[calc(90vw-40px)] max-h-[90vh] translate-x-[-50%] translate-y-[-50%] overflow-y-auto bg-white rounded-2xl shadow-2xl data-[state=open]:opacity-100 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=closed]:scale-95 transition-all duration-200"

export function BaseModal({
  open,
  onOpenChange,
  title,
  description,
  image,
  children,
  actions,
  maxWidth = 'max-w-4xl',
}: BaseModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={overlayClass} />
        <Dialog.Content className={`${contentBaseClass} ${maxWidth}`}>
          {image && (
            <div className="relative aspect-video">
              <Image src={image.src} alt={image.alt} fill className="object-cover rounded-t-2xl" />
            </div>
          )}

          <div className="p-6 md:p-8">
            <Dialog.Close asChild>
              <button className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors" aria-label="Close">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Dialog.Close>

            <Dialog.Title className="text-2xl md:text-3xl font-bold mb-4">{title}</Dialog.Title>
            {description && <Dialog.Description className="text-gray-600 mb-6">{description}</Dialog.Description>}
            {children}
            {actions && <div className="flex flex-col sm:flex-row gap-4 mt-6">{actions}</div>}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
