import { create } from "zustand";
import {persist, createJSONStorage} from "zustand/middleware"
import { Product } from "@/types";
import toast from "react-hot-toast";


interface CartStore {
    items: Product[];
    addItem: (data: Product) => void;
    removeItem: (id: string) => void;
    removeAll: () => void;
  }
  
  const useCart = create(
    persist<CartStore>((set, get) => ({
      items: [],
      addItem: (data: Product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);
  
        if (existingItem) {
          return toast("Item already in cart.");
        }
  
        set({ items: [...get().items, data] });
        
        // Show success toast with duration
        toast.success(`${data.name} added to cart`, {
          duration: 4000,
          icon: '🛒',
        });
      },
      removeItem: (id: string) => {
        const removedItem = get().items.find((item) => item.id === id)
        
        set({
          items: get().items.filter((item) => item.id !== id),
        });
        
        if (removedItem) {
          toast.success(`${removedItem.name} removed from cart`, {
            duration: 4000,
          });
        }
      },
      removeAll: () => set({ items: [] }),
    }), {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    })
  );
  
  export default useCart;
  