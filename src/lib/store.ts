import { create } from 'zustand';
import { supabase } from './supabase';

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  secondary_image?: string;
  sizes?: string[];
  tags?: string[];
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

interface StoreState {
  products: Product[];
  cart: CartItem[];
  isLoading: boolean;
  isCartOpen: boolean;
  search: string;
  category: string;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<void>;
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  buildWhatsAppMessage: (data: { customerName: string; deliveryMethod: 'envio' | 'punto'; station?: string }) => string;
}

export const useStore = create<StoreState>((set, get) => ({
  products: [],
  cart: [],
  isLoading: false,
  isCartOpen: false,
  search: '',
  category: 'Todas',

  fetchProducts: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Error cargando productos:', error.message);
    } else {
      set({ products: data || [] });
    }
    set({ isLoading: false });
  },

  addProduct: async (newProd) => {
    const { error } = await supabase.from('products').insert([newProd]);
    if (error) {
      console.error('Error insertando producto:', error.message);
      return false;
    }
    await get().fetchProducts();
    return true;
  },

  deleteProduct: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      await get().fetchProducts();
    }
  },

  addToCart: (product, size) => {
    set((state) => {
      const existingIndex = state.cart.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );

      if (existingIndex > -1) {
        const newCart = [...state.cart];
        newCart[existingIndex].quantity += 1;
        return { cart: newCart, isCartOpen: true };
      }

      return {
        cart: [...state.cart, { product, size, quantity: 1 }],
        isCartOpen: true,
      };
    });
  },

  removeFromCart: (productId, size) => {
    set((state) => ({
      cart: state.cart.filter(
        (item) => !(item.product.id === productId && item.size === size)
      ),
    }));
  },

  updateQuantity: (productId, size, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId, size);
      return;
    }
    set((state) => ({
      cart: state.cart.map((item) =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      ),
    }));
  },

  clearCart: () => set({ cart: [] }),
  setCartOpen: (open) => set({ isCartOpen: open }),
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),

  buildWhatsAppMessage: ({ customerName, deliveryMethod, station }) => {
    const { cart } = get();
    let msg = `*NUEVO PEDIDO - PLATEA SUR*\n\n`;
    msg += `*Cliente:* ${customerName}\n`;
    msg += `*Entrega:* ${deliveryMethod === 'envio' ? 'Envío a domicilio' : `Punto de encuentro (${station})`}\n\n`;
    msg += `*Detalle del pedido:*\n`;

    let total = 0;
    cart.forEach((item) => {
      const subtotal = item.product.price * item.quantity;
      total += subtotal;
      msg += `• ${item.product.title} (Talle: ${item.size}) x${item.quantity} - $${subtotal.toLocaleString('es-AR')}\n`;
    });

    msg += `\n*TOTAL: $${total.toLocaleString('es-AR')}*`;
    return msg;
  },
}));

export const formatARS = (price: number) => `$${price.toLocaleString('es-AR')}`;
export const INSTAGRAM = 'https://instagram.com/plateasur';
export const WHATSAPP = '5491149709340';