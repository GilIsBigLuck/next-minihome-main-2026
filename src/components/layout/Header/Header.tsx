'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cva } from 'class-variance-authority'
import DateTimeSelector from './DateTimeSelector'

const headerStyles = cva('fixed top-0 left-0 w-full h-16 z-header', {
    variants: {
        variant: {
        default: 'text-black',
        white: 'text-white',
        },
    },
})

const headerInnerStyles = cva('max-w-layout-xl mx-auto h-12 flex items-center justify-between px-4')
const headerNavStyles = cva('hidden md:flex items-center gap-10')
const navLinkStyles = cva('bg-blur transition-colors font-bold')

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className={headerStyles({ variant: 'default' })}>
            <div className={headerInnerStyles()}>
                <DateTimeSelector />

                {/* Desktop Nav */}
                <nav className={headerNavStyles()}>
                    <Link href="/" className={navLinkStyles()}>Home</Link>
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

            {/* Mobile Nav */}
            {isMenuOpen && (
                <nav className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-100">
                    <div className="max-w-layout-xl mx-auto px-4 py-4 flex flex-col gap-4">
                        <Link href="/" className={navLinkStyles()} onClick={() => setIsMenuOpen(false)}>Home</Link>
                        <Link href="/about" className={navLinkStyles()} onClick={() => setIsMenuOpen(false)}>Projects</Link>
                        <Link href="/about" className={navLinkStyles()} onClick={() => setIsMenuOpen(false)}>Templates</Link>
                        <Link href="/contact" className={navLinkStyles()} onClick={() => setIsMenuOpen(false)}>Contact</Link>
                    </div>
                </nav>
            )}
        </header>
    )
}
