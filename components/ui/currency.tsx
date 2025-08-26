"use client"

import { useEffect, useState, memo } from "react"

// Memoize formatter to avoid recreation on every render
const formatter = new Intl.NumberFormat("en-US", {
    style: 'currency',
    currency: 'USD'
})

interface CurrencyProps {
    value?: string | number
}

const Currency: React.FC<CurrencyProps> = memo(({
    value = 0,
}) => {
    const [isMounted, setIsMounted] = useState(false)

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
    
    // Handle edge cases for better performance
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : Number(value) || 0
    
    return ( 
        <div className="font-semibold text-foreground">
           {formatter.format(numValue)} 
        </div>
    )
})
Currency.displayName = 'Currency'

export default Currency