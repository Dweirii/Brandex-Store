import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CURRENCIES, CurrencyCode, DEFAULT_CURRENCY, COUNTRY_TO_CURRENCY } from '@/lib/currency-config';

interface GeoState {
    countryCode: string | null;
    currency: CurrencyCode;
    setCountry: (countryCode: string) => void;
    setCurrency: (currency: CurrencyCode) => void;
    autoDetect: () => Promise<void>;
}

export const useGeo = create<GeoState>()(
    persist(
        (set, get) => ({
            countryCode: null,
            currency: DEFAULT_CURRENCY,
            setCountry: (countryCode: string) => {
                const currency = COUNTRY_TO_CURRENCY[countryCode] || DEFAULT_CURRENCY;
                set({ countryCode, currency });
            },
            setCurrency: (currency: CurrencyCode) => set({ currency }),
            autoDetect: async () => {

                try {
                    const cookieMatch = document.cookie.match(/user-country=([^;]+)/);
                    if (cookieMatch && cookieMatch[1]) {
                        const country = cookieMatch[1];
                        const currency = COUNTRY_TO_CURRENCY[country] || DEFAULT_CURRENCY;
                        set({ countryCode: country, currency });
                        return;
                    }

                    const res = await fetch('https://ipapi.co/json/');
                    const data = await res.json();
                    if (data.country_code) {
                        const country = data.country_code;
                        const currency = COUNTRY_TO_CURRENCY[country] || DEFAULT_CURRENCY;
                        set({ countryCode: country, currency });
                    }
                } catch (error) {
                    console.error('Failed to detect location:', error);
                }
            },
        }),
        {
            name: 'geo-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
