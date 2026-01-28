'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import { useLoading } from '@/contexts/LoadingContext'

const cityConfig = {
    seoul: {
        timezone: 'Asia/Seoul',
        locale: 'ko' as const,
        nameKey: 'seoul'
    },
    newyork: {
        timezone: 'America/New_York',
        locale: 'en' as const,
        nameKey: 'newyork'
    },
    tokyo: {
        timezone: 'Asia/Tokyo',
        locale: 'ja' as const,
        nameKey: 'tokyo'
    }
} as const

type CityKey = keyof typeof cityConfig

export default function DateTimeSelector() {

    const t = useTranslations('cities')
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const { startLoading, finishLoading } = useLoading()
    const [currentCity, setCurrentCity] = useState<CityKey>('seoul')
    const [currentDateTime, setCurrentDateTime] = useState<string>('')
    const [shortDateTime, setShortDateTime] = useState<string>('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
    const buttonRef = useRef<HTMLButtonElement>(null)
    const previousLocaleRef = useRef<string>('')

    useEffect(() => {
        const currentLocale = locale
        
        // locale이 변경된 경우 로딩 종료
        if (previousLocaleRef.current && previousLocaleRef.current !== currentLocale) {
            finishLoading()
        }
        previousLocaleRef.current = currentLocale
        
        const city = Object.entries(cityConfig).find(
            ([_, config]) => config.locale === currentLocale
        )?.[0] as CityKey
        
        if (city) {
            setCurrentCity(city)
        }
    }, [locale, finishLoading])

    useEffect(() => {
        const updateDateTime = () => {
            const config = cityConfig[currentCity]
            const now = new Date()
            
            // 타임존에 맞는 날짜/시간 가져오기
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: config.timezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            })
            
            const parts = formatter.formatToParts(now)
            const year = parts.find(p => p.type === 'year')?.value
            const month = parts.find(p => p.type === 'month')?.value
            const day = parts.find(p => p.type === 'day')?.value
            const hour = parts.find(p => p.type === 'hour')?.value
            const minute = parts.find(p => p.type === 'minute')?.value
            const second = parts.find(p => p.type === 'second')?.value
            const dayPeriod = parts.find(p => p.type === 'dayPeriod')?.value?.toUpperCase()
            
            // 2026.01.26 12:24:23 PM 형식
            setCurrentDateTime(`${year}.${month}.${day} ${hour}:${minute}:${second} ${dayPeriod}`)
            // 모바일용 짧은 형식: 12:24 PM
            setShortDateTime(`${hour}:${minute} ${dayPeriod}`)
        }

        updateDateTime()
        const interval = setInterval(updateDateTime, 1000)

        return () => clearInterval(interval)
    }, [currentCity])

    const handleCityChange = (city: CityKey) => {
        setCurrentCity(city)
        setIsDropdownOpen(false)
        
        const config = cityConfig[city]
        const currentLocale = locale
        
        if (config.locale !== currentLocale) {
            startLoading()
            router.push(pathname, { locale: config.locale })
        }
    }

    useEffect(() => {
        const updateDropdownPosition = () => {
            if (buttonRef.current && isDropdownOpen) {
                const rect = buttonRef.current.getBoundingClientRect()
                setDropdownPosition({
                    top: rect.bottom + window.scrollY + 8, // 8px = mt-2
                    left: rect.left + window.scrollX,
                })
            }
        }

        if (isDropdownOpen) {
            updateDropdownPosition()
            window.addEventListener('scroll', updateDropdownPosition, true)
            window.addEventListener('resize', updateDropdownPosition)
        }

        return () => {
            window.removeEventListener('scroll', updateDropdownPosition, true)
            window.removeEventListener('resize', updateDropdownPosition)
        }
    }, [isDropdownOpen])

    const dropdownContent = isDropdownOpen && (
        <>
            <div
                className="fixed inset-0 z-[800]"
                onClick={() => setIsDropdownOpen(false)}
            />
            <div 
                className="fixed w-48 bg-white shadow-lg border border-gray-200 z-[900]"
                style={{
                    top: `${dropdownPosition.top}px`,
                    left: `${dropdownPosition.left}px`,
                }}
            >
                {(Object.keys(cityConfig) as CityKey[]).map((city) => {
                    const config = cityConfig[city]
                    return (
                        <button
                            key={city}
                            onClick={() => handleCityChange(city)}
                            className="w-full text-left px-4 py-2 transition-colors text-black hover:bg-gray-50"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm">{t(config.nameKey)}</span>
                                <span className="text-sm text-gray-500">
                                    {config.locale.toUpperCase()}
                                </span>
                            </div>
                        </button>
                    )
                })}
            </div>
        </>
    )

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 md:gap-2"
            >
                <span className="text-sm">{t(cityConfig[currentCity].nameKey)}</span>
                <span className="text-sm hidden sm:inline">{currentDateTime}</span>
                <span className="text-sm sm:hidden">{shortDateTime}</span>
                <svg
                    className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            
            {typeof window !== 'undefined' && createPortal(dropdownContent, document.body)}
        </div>
    )
}
