'use client'
import { cva } from 'class-variance-authority';

export function HeroSection() {

    const heroSectionSt = cva('relative w-full h-screen flex items-center justify-center');

    const bandItemsA = [
        {id: 1, name: 'CREATIVE'},
        {id: 2, name: 'DESIGN'},
        {id: 3, name: 'DEVELOPMENT'},
        {id: 4, name: 'MARKETING'},
        {id: 5, name: 'BRANDING'},
        {id: 6, name: 'SOCIAL MEDIA'},
        {id: 7, name: 'SEO'},
        {id: 8, name: 'ANALYTICS'},
        {id: 9, name: 'CREATIVE'},
        {id: 10, name: 'DESIGN'},
        {id: 11, name: 'DEVELOPMENT'},
        {id: 12, name: 'MARKETING'},
        {id: 13, name: 'BRANDING'},
        {id: 14, name: 'SOCIAL MEDIA'},
        {id: 15, name: 'SEO'},
        {id: 16, name: 'ANALYTICS'},
        {id: 17, name: 'CREATIVE'},
        {id: 18, name: 'DESIGN'},
        {id: 19, name: 'DEVELOPMENT'},
        {id: 20, name: 'MARKETING'},
        {id: 21, name: 'BRANDING'},
        {id: 22, name: 'SOCIAL MEDIA'},
        {id: 23, name: 'SEO'},
        {id: 24, name: 'ANALYTICS'},
        {id: 25, name: 'CREATIVE'},
        {id: 26, name: 'DESIGN'},
        {id: 27, name: 'DEVELOPMENT'},
        {id: 28, name: 'MARKETING'},
        {id: 29, name: 'BRANDING'},
        {id: 30, name: 'SOCIAL MEDIA'},
        {id: 31, name: 'SEO'},
        {id: 32, name: 'ANALYTICS'},
    ]

    const bandItemsB = bandItemsA.reverse();

    const bandItemWrapSt = cva([
        'absolute z-frontToCanvas mix-blend-difference', 
        'bottom-0 w-full flex',
        'gap-[10vw] items-center justify-center py-2',
    ], {
        variants: {
            direction: {
                left: 'left-[-50%] bottom-6 animate-marquee',
                right: 'right-[-50%] bottom-0 animate-marquee-reverse',
            },
        },
    });

    const bandItemSt = cva('whitespace-nowrap text-sm text-white transition-colors');

    return (
        <section id="heroSection" className={heroSectionSt()}>
            <div className={bandItemWrapSt({ direction: 'left' })}>
                {
                    bandItemsA.map((item,index) => {
                        return (
                            <div className={bandItemSt()} key={index}>
                                {item.name}
                            </div>
                        )
                    })
                }
            </div>
            <div className={bandItemWrapSt({ direction: 'right' })}>
                {
                    bandItemsB.map((item,index) => {
                        return (
                            <div className={bandItemSt()} key={index}>
                                {item.name}
                            </div>
                        )
                    })
                }
            </div>
        </section>
    )
}