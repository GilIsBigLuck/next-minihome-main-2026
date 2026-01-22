import Link from 'next/link'
import { cva } from 'class-variance-authority'

const headerStyles = cva('fixed top-0 left-0 w-full h-16 z-header', {
    variants: {
        variant: {
        default: 'text-black',
        white: 'text-white',
        },
    },
})

const headerInnerStyles = cva('max-w-layout-xl mx-auto h-12 flex items-center justify-between')

const headerNavStyles = cva('flex items-center gap-4')

export default function Header() {
    return (
        <header className={headerStyles({ variant: 'default' })}>
            <div className={headerInnerStyles()}>
                <div>
                    Logo
                </div>
                <nav className={headerNavStyles()}>
                    <Link href="/">Home</Link>
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                </nav>
            </div>
        </header>
    )
}