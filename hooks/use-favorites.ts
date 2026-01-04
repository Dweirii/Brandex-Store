"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";

interface FavoritesStore {
    items: Product[];
    isLoading: boolean;
    isSyncing: boolean;
    addItem: (data: Product, token?: string | null) => Promise<void>;
    removeItem: (id: string, token?: string | null) => Promise<void>;
    removeAll: () => void;
    syncFromServer: (token: string | null) => Promise<void>;
    checkIsFavorite: (productId: string, token?: string | null) => Promise<boolean>;
}

const getApiUrl = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://admin.wibimax.com";
    const storeId = process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || "";
    
    if (!storeId) {
        console.warn("NEXT_PUBLIC_DEFAULT_STORE_ID is not configured");
        return null;
    }

    // Construct the full API URL
    const cleanApiUrl = apiUrl.replace(/\/$/, '');
    if (cleanApiUrl.includes(`/${storeId}`)) {
        return `${cleanApiUrl}/favorites`;
    } else if (cleanApiUrl.endsWith('/api')) {
        return `${cleanApiUrl}/${storeId}/favorites`;
    } else {
        return `${cleanApiUrl}/api/${storeId}/favorites`;
    }
};

const useFavorites = create<FavoritesStore>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,
            isSyncing: false,

            syncFromServer: async (token: string | null) => {
                if (!token) {
                    // If no token, just use localStorage
                    return;
                }

                const apiUrl = getApiUrl();
                if (!apiUrl) {
                    console.warn("Cannot sync favorites: API URL not configured");
                    return;
                }

                set({ isSyncing: true });
                try {
                    const response = await fetch(apiUrl, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        set({ items: data.products || [] });
                    } else if (response.status === 401) {
                        // Not authenticated, use localStorage
                        console.log("Not authenticated, using localStorage favorites");
                    } else {
                        console.error("Failed to sync favorites:", response.status);
                    }
                } catch (error) {
                    console.error("Error syncing favorites:", error);
                    // On error, continue using localStorage
                } finally {
                    set({ isSyncing: false });
                }
            },

            checkIsFavorite: async (productId: string, token?: string | null) => {
                const localItems = get().items;
                const isInLocal = localItems.some((item) => item.id === productId);
                
                // If no token, just check local
                if (!token) {
                    return isInLocal;
                }

                // If in local, return true (optimistic)
                if (isInLocal) {
                    return true;
                }

                // Could also check server, but for now just use local
                return isInLocal;
            },

            addItem: async (data: Product, token?: string | null) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === data.id);

                if (existingItem) {
                    toast("Item already in favorites.");
                    return;
                }

                // Optimistically update local state
                const newItems = [...currentItems, data];
                set({ items: newItems });
                toast.success("Item added to favorites.");

                // Sync with server if authenticated
                if (token) {
                    const apiUrl = getApiUrl();
                    if (apiUrl) {
                        try {
                        const response = await fetch(apiUrl, {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ productId: data.id }),
                        });

                        if (!response.ok && response.status !== 401) {
                            console.error("Failed to sync favorite to server:", response.status);
                            // Don't remove from local on error - keep optimistic update
                        }
                        } catch (error) {
                            console.error("Error syncing favorite to server:", error);
                            // Keep the local update even if sync fails
                        }
                    }
                }
            },

            removeItem: async (id: string, token?: string | null) => {
                // Optimistically update local state
                const newItems = get().items.filter((item) => item.id !== id);
                set({ items: newItems });
                toast.success("Item removed from favorites.");

                // Sync with server if authenticated
                if (token) {
                    const apiUrl = getApiUrl();
                    if (apiUrl) {
                        try {
                        const response = await fetch(`${apiUrl}?productId=${id}`, {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        });

                        if (!response.ok && response.status !== 401) {
                            console.error("Failed to remove favorite from server:", response.status);
                        }
                        } catch (error) {
                            console.error("Error removing favorite from server:", error);
                        }
                    }
                }
            },

            removeAll: () => {
                set({ items: [] });
            },
        }),
        {
            name: "favorites-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// Hook to use favorites with automatic auth
export const useFavoritesWithAuth = () => {
    const { getToken, isSignedIn } = useAuth();
    const favorites = useFavorites();

    const addItem = async (data: Product) => {
        const token = isSignedIn ? await getToken({ template: "CustomerJWTBrandex" }) : null;
        await favorites.addItem(data, token);
    };

    const removeItem = async (id: string) => {
        const token = isSignedIn ? await getToken({ template: "CustomerJWTBrandex" }) : null;
        await favorites.removeItem(id, token);
    };

    const syncFromServer = async () => {
        if (isSignedIn) {
            const token = await getToken({ template: "CustomerJWTBrandex" });
            await favorites.syncFromServer(token);
        }
    };

    return {
        ...favorites,
        addItem,
        removeItem,
        syncFromServer,
    };
};

export default useFavorites;
