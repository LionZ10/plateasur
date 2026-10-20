import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import j1 from "@/assets/jersey-1.jpg";
import j2 from "@/assets/jersey-2.jpg";
import j3 from "@/assets/jersey-3.jpg";

export const CATEGORIES = ["Liga Argentina", "Ascenso Argentino", "Retro / Clásicas", "Niños", "Shorts", "Selecciones"] as const;
export const TAGS = ["BAJO PEDIDO", "MÁS VENDIDO", "RETRO", "ASCENSO"] as const;
export const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
export const WHATSAPP = "5491149709340";
export const INSTAGRAM = "https://www.instagram.com/plateasur/";
export const ADMIN_PIN = "1994";

export type Product = { id: string; title: string; category: string; price: number; image: string; tags: string[]; sizes: string[] };
export type CartItem = { id: string; productId: string; title: string; price: number; size: string; qty: number; image: string };

const SEED: Product[] = [
  { id: "p1", title: "Camiseta Lanús 2024", category: "Liga Argentina", price: 45000, image: j3, tags: ["BAJO PEDIDO", "MÁS VENDIDO"], sizes: [...SIZES] },
  { id: "p2", title: "Camiseta Chacarita Retro", category: "Retro / Clásicas", price: 42000, image: j1, tags: ["RETRO"], sizes: [...SIZES] },
  { id: "p3", title: "Camiseta Argentina Retro 94", category: "Selecciones", price: 48000, image: j2, tags: ["RETRO", "MÁS VENDIDO"], sizes: [...SIZES] },
  { id: "p4", title: "Camiseta Banfield 2024/25", category: "Liga Argentina", price: 44000, image: j1, tags: ["BAJO PEDIDO"], sizes: [...SIZES] },
  { id: "p5", title: "Camiseta Temperley 2024", category: "Ascenso Argentino", price: 36000, image: j2, tags: ["ASCENSO"], sizes: ["S", "M", "L", "XL"] },
  { id: "p6", title: "Camiseta Los Andes Titular", category: "Ascenso Argentino", price: 35000, image: j1, tags: ["ASCENSO", "BAJO PEDIDO"], sizes: [...SIZES] },
  { id: "p7", title: "Camiseta Lanús Niños 2024", category: "Niños", price: 30000, image: j3, tags: ["BAJO PEDIDO"], sizes: ["S", "M", "L"] },
  { id: "p8", title: "Short Racing Titular 2024/25", category: "Shorts", price: 22000, image: j2, tags: ["BAJO PEDIDO"], sizes: [...SIZES] },
];

type Ctx = {
  products: Product[];
  saveProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  cart: CartItem[];
  addToCart: (p: Product, size: string) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  category: string;
  setCategory: (c: string) => void;
  search: string;
  setSearch: (s: string) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SEED);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [category, setCategory] = useState("Todas");
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const p = localStorage.getItem("ps_products");
      const c = localStorage.getItem("ps_cart");
      if (p) setProducts(JSON.parse(p));
      if (c) setCart(JSON.parse(c));
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem("ps_products", JSON.stringify(products)); }, [products, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("ps_cart", JSON.stringify(cart)); }, [cart, loaded]);

  const value: Ctx = {
    products,
    saveProduct: (p) => setProducts((prev) => (prev.some((x) => x.id === p.id) ? prev.map((x) => (x.id === p.id ? p : x)) : [p, ...prev])),
    deleteProduct: (id) => setProducts((prev) => prev.filter((x) => x.id !== id)),
    cart,
    addToCart: (p, size) =>
      setCart((prev) => {
        const id = `${p.id}-${size}`;
        const ex = prev.find((i) => i.id === id);
        if (ex) return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
        return [...prev, { id, productId: p.id, title: p.title, price: p.price, size, qty: 1, image: p.image }];
      }),
    updateQty: (id, qty) => setCart((prev) => (qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i)))),
    removeItem: (id) => setCart((prev) => prev.filter((i) => i.id !== id)),
    clearCart: () => setCart([]),
    cartOpen, setCartOpen, category, setCategory, search, setSearch,
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}

export const formatARS = (n: number) => "$" + n.toLocaleString("es-AR");

export function buildWhatsAppMessage(cart: CartItem[], name: string, location: string, delivery: string) {
  const lines = cart.map((i) => `- ${i.qty}x ${i.title} (Talle ${i.size}) - ${formatARS(i.price * i.qty)}`);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return [
    "¡Hola! Quiero hacer el siguiente pedido Bajo Pedido en PLATEA SUR:",
    ...lines,
    `Total: ${formatARS(total)}`,
    `Cliente: ${name}`,
    `Ubicación: ${location}`,
    `Entrega: ${delivery}`,
  ].join("\n");
}
