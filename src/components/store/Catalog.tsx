import React, { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { ShoppingCart, Shirt } from "lucide-react";
import { toast } from "sonner";

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

export function Catalog() {
  const { products, isLoading, fetchProducts, search, category, setCategory, addToCart } = useStore();
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});
  const [sortBy, setSortBy] = useState("recomendados");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "Todas" || p.category === category;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "nombre-asc") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "precio-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "precio-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, search, category, sortBy]);

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product: any) => {
    const size = selectedSizes[product.id];
    if (!size) {
      toast.error("Por favor, seleccioná un talle primero.");
      return;
    }
    addToCart(product, size);
    toast.success(`${product.title} agregada al carrito (Talle ${size})`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Encabezado del Catálogo y Ordenar por */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-[0.25em] text-primary uppercase block">
            Catálogo
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight uppercase font-black">
            Elegí Tu Camiseta
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-semibold">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-secondary/80 border border-border text-xs rounded-xl px-3 py-2 outline-none focus:border-primary font-bold cursor-pointer"
          >
            <option value="recomendados">Recomendados</option>
            <option value="nombre-asc">Nombre (A - Z)</option>
            <option value="precio-asc">Menor precio</option>
            <option value="precio-desc">Mayor precio</option>
          </select>
        </div>
      </div>

      {/* Píldoras de Categorías */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
              category === cat
                ? "bg-primary text-primary-foreground border-primary shadow-glow"
                : "bg-secondary/60 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Productos (2 Columnas en Celular / 4 en Escritorio) */}
      {isLoading ? (
        <div className="text-center py-20 text-muted-foreground font-semibold">
          Cargando camisetas...
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Estado vacío limpio y estilizado para mantener la estructura */
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-card/40 border border-border/50 rounded-2xl text-center my-4 space-y-3">
          <div className="p-3 bg-secondary/80 rounded-full text-primary">
            <Shirt className="h-8 w-8" />
          </div>
          <h3 className="font-bold text-base">Próximamente más modelos</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            No hay productos cargados en <span className="text-primary font-bold">{category}</span> en este momento. Consultanos por WhatsApp si buscás un modelo específico.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pt-2">
          {filteredProducts.map((product) => {
            const currentSize = selectedSizes[product.id] || "";
            return (
              <div
                key={product.id}
                className="group bg-card border border-border rounded-xl sm:rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:border-primary/50 transition-all duration-300 relative"
              >
                <div>
                  {/* Contenedor de Imagen con soporte Hover (PC) y Tap (Mobile) */}
<div 
  className="relative aspect-square overflow-hidden bg-secondary/40 cursor-pointer"
  onTouchStart={(e) => {
    // Alterna la visibilidad al tocar en mobile
    const target = e.currentTarget;
    target.classList.toggle("mobile-active");
  }}
>
 <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-wrap gap-1">
  {product.tags && product.tags.map((tag: string) => (
    <span
      key={tag}
      className={`text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider backdrop-blur-md border ${
        tag === 'BAJO PEDIDO'
          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
          : tag === 'MÁS VENDIDO'
          ? 'bg-amber-950/80 text-amber-400 border-amber-500/30'
          : 'bg-primary/80 text-primary-foreground border-primary/30'
      }`}
    >
      {tag}
    </span>
  ))}
</div>

  {/* Foto Frente */}
  <img
    src={product.image}
    alt={product.title}
    className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
      product.secondary_image ? "group-hover:opacity-0 [.mobile-active_&]:opacity-0" : "group-hover:scale-105"
    }`}
  />

  {/* Foto Espalda */}
  {product.secondary_image && (
    <img
      src={product.secondary_image}
      alt={`${product.title} vista trasera`}
      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 [.mobile-active_&]:opacity-100 transition-opacity duration-500 ease-in-out"
    />
  )}
                  </div>
                  <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2">
                    <span className="text-[9px] sm:text-[11px] text-primary font-black uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h3 className="font-bold text-xs sm:text-base leading-tight truncate">
                      {product.title}
                    </h3>
                    <p className="text-base sm:text-xl font-extrabold text-foreground">
                      ${product.price.toLocaleString("es-AR")}
                    </p>

                    {/* Seleccionar Talle */}
                    <div className="pt-1 sm:pt-2">
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground mb-1 font-semibold">
                        Talles:
                      </p>
                      <div className="flex gap-1 flex-wrap">
                        {product.sizes?.map((sz: string) => (
                          <button
                            key={sz}
                            onClick={() => handleSizeSelect(product.id, sz)}
                            className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-bold rounded-md sm:rounded-lg border transition-all ${
                              currentSize === sz
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-secondary/80 text-foreground border-border hover:border-primary/50"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 sm:p-4 pt-0">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-primary text-primary-foreground py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-extrabold text-[10px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Agregar al Carrito</span>
                    <span className="sm:hidden">Agregar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Catalog;