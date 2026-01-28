'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { cva } from 'class-variance-authority'
import DateTimeSelector from './DateTimeSelector'

const headerStyles = cva('fixed top-0 left-0 w-full h-16 z-header mix-blend-difference', {
    variants: {
        variant: {
        default: 'text-white',
        white: 'text-white',
        },
    },
})

const headerInnerStyles = cva('max-w-layout-max mx-auto relative h-12 flex items-center justify-between px-8')
const headerNavStyles = cva('hidden md:flex items-center gap-10')
const navLinkStyles = cva('transition-colors text-sm')

const logoStyles = cva('text-sm absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2')


export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const headerRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const handleResize = () => {
            // 데스크톱으로 전환 시 메뉴 닫기
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const mobileNavContent = isMenuOpen && typeof window !== 'undefined' && (
        <>
            <div
                className="fixed inset-0 z-[800] bg-black/20"
                onClick={() => setIsMenuOpen(false)}
            />
            <nav 
                className="fixed top-16 left-0 right-0 bg-white border-t border-gray-200 z-[900] md:hidden"
            >
                <div className="max-w-layout-xl mx-auto px-4 py-4 flex flex-col gap-4">
                    <Link 
                        href="/" 
                        className="transition-colors text-sm text-black hover:text-gray-600" 
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link 
                        href="/about" 
                        className="transition-colors text-sm text-black hover:text-gray-600" 
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Projects
                    </Link>
                    <Link 
                        href="/about" 
                        className="transition-colors text-sm text-black hover:text-gray-600" 
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Templates
                    </Link>
                    <Link 
                        href="/contact" 
                        className="transition-colors text-sm text-black hover:text-gray-600" 
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Contact
                    </Link>
                </div>
            </nav>
        </>
    )

    return (
        <>
            <header ref={headerRef} className={headerStyles({ variant: 'default' })} style={{ isolation: 'isolate' }}>
                <div className={headerInnerStyles()}>
                    <DateTimeSelector />

                    <div>
                        <Link href="/" className={logoStyles()}>www.minihome.page</Link>
                    </div>

                    {/* Desktop Nav */}
                    <nav className={headerNavStyles()}>
                        <Link href="/about" className={navLinkStyles()}>Projects</Link>
                        <Link href="/about" className={navLinkStyles()}>Templates</Link>
                        <Link href="/contact" className={navLinkStyles()}>Contact</Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="메뉴 열기"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </header>

            {typeof window !== 'undefined' && createPortal(mobileNavContent, document.body)}
        </>
    )
}
