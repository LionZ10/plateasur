import React, { useState } from "react";
import { Search, ShoppingBag, X } from "lucide-react";
import { useStore } from "@/lib/store";
import PlateaSurLogo from "../ui/plateasurlogo";

const CATEGORIES = [
  "Todas",
  "Liga Argentina",
  "Ascenso Argentino",
  "Internacional",
  "Retro / Clásicas",
  "Niños",
  "Shorts",
  "Selecciones",
];

export function Logo() {
  return (
    <a href="#" className="flex items-center">
      <PlateaSurLogo />
    </a>
  );
}

export function AnnouncementBar() {
  const text = " Envíos a todo el país a domicilio |  Puntos de encuentro en Zona Sur | ";
  return (
    <div className="overflow-hidden border-b bg-turf py-1.5 text-xs font-semibold">
      <div className="flex w-max animate-marquee whitespace-pre">
        <span>{text.repeat(4)}</span>
      </div>
    </div>
  );
}

export function Header() {
  const { cart, setCartOpen, search, setSearch, category, setCategory } = useStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const count = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        {/* Logo */}
        <Logo />

        {/* Búsqueda Desktop (fija en PC) */}
        <div className="hidden sm:relative sm:flex sm:flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar camiseta..."
            className="w-full rounded-full border bg-secondary pl-9 pr-4 py-2 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Acciones Mobile & Carrito */}
        <div className="flex items-center gap-2">
          {/* Botón Lupa Toggle solo en Mobile */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 sm:hidden rounded-full border bg-secondary/80 hover:border-primary text-foreground transition-colors"
            aria-label="Buscar"
          >
            {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>

          {/* Carrito */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative rounded-full border bg-secondary p-2.5 hover:border-primary transition-colors"
            aria-label="Carrito"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desplegable de Búsqueda para Mobile */}
      {isSearchOpen && (
        <div className="px-4 pb-3 sm:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar camiseta..."
              className="w-full rounded-full border bg-secondary pl-9 pr-4 py-2 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      )}

      {/* Categorías */}
      <nav className="border-t bg-card/50 px-4 py-2">
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              onClick={() => {
                setCategory(item);
                const el = document.getElementById("catalogo");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className={`text-xs font-semibold whitespace-nowrap transition-colors hover:text-primary ${
                category === item
                  ? "text-primary font-bold border-b-2 border-primary pb-0.5"
                  : "text-muted-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}