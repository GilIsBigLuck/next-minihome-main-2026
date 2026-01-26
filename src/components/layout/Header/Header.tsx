'use client'

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
const headerNavStyles = cva('flex items-center gap-10')
const navLinkStyles = cva('bg-blur transition-colors font-bold')

export default function Header() {
    return (
        <header className={headerStyles({ variant: 'default' })}>
            <div className={headerInnerStyles()}>
                <DateTimeSelector />
                <nav className={headerNavStyles()}>
                    <Link href="/" className={navLinkStyles()}>Home</Link>
                    <Link href="/about" className={navLinkStyles()}>Projects</Link>
                    <Link href="/about" className={navLinkStyles()}>Templates</Link>
                    <Link href="/contact" className={navLinkStyles()}>Contact</Link>
                </nav>
            </div>
        </header>
    )
}
