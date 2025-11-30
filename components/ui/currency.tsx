"use client"

import { useEffect, useState, memo } from "react"
import { useGeo } from "@/hooks/use-geo"
import { CURRENCIES } from "@/lib/currency-config"

interface CurrencyProps {
    value?: string | number
}

const Currency: React.FC<CurrencyProps> = memo(({
    value = 0,
}) => {
    const [isMounted, setIsMounted] = useState(false)
    const { currency } = useGeo()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return (
            <div className="font-semibold text-foreground animate-pulse">
                <div className="h-4 bg-muted rounded w-16"></div>
            </div>
        )
    }

    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : Number(value) || 0
    const currencyConfig = CURRENCIES[currency] || CURRENCIES.USD
    const convertedValue = numValue * currencyConfig.rate

    const formatter = new Intl.NumberFormat("en-US", {
        style: 'currency',
        currency: currencyConfig.code,
    })

    return (
        <div className="font-semibold text-foreground">
            {formatter.format(convertedValue)}
        </div>
    )
})
Currency.displayName = 'Currency'

export default Currency