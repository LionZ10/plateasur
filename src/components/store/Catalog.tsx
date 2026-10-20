import React, { useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { formatARS, useStore, type Product } from "@/lib/store";

// LISTA DE CATEGORÍAS ÚNICA Y SINCRONIZADA
const CATEGORIES = [
  "Todas",
  "Liga Argentina",
  "Ascenso Argentino",
  "Retro / Clásicas",
  "Niños",
  "Shorts",
  "Selecciones",
];

function ProductCard({ p }: { p: Product }) {
  const { addToCart } = useStore();
  const [size, setSize] = useState("");

  const add = () => {
    if (!size) {
      toast.error("Elegí un talle primero");
      return;
    }
    addToCart(p, size);
    toast.success(`${p.title} agregada`, { description: `Talle ${size}` });
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition hover:border-primary/50">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          width={768}
          height={960}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {p.tags.map((t) => (
            <span
              key={t}
              className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider ${
                t === "MÁS VENDIDO"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/80 text-foreground backdrop-blur"
              }`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary">{p.category}</p>
          <h3 className="mt-1 font-semibold leading-tight">{p.title}</h3>
          <p className="mt-1 font-display text-2xl">{formatARS(p.price)}</p>
        </div>

        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="mt-auto w-full rounded-lg border bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">Seleccionar Talle</option>
          {p.sizes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          onClick={add}
          className="btn-glow flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold"
        >
          <ShoppingCart className="h-4 w-4" /> Agregar al Carrito
        </button>
      </div>
    </article>
  );
}

export function Catalog() {
  const { products, category, setCategory, search } = useStore();
  const [sort, setSort] = useState("default");

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    let r = products.filter(
      (p) =>
        (category === "Todas" || p.category === category) &&
        (!q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    );
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "name") r = [...r].sort((a, b) => a.title.localeCompare(b.title));
    return r;
  }, [products, category, search, sort]);

  return (
    <section id="catalogo" className="mx-auto max-w-7xl scroll-mt-32 px-4 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary">CATÁLOGO</p>
          <h2 className="font-display text-4xl font-bold">ELEGÍ TU CAMISETA</h2>
        </div>

        {/* ORDENAR POR PRECIO Y NOMBRE */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-muted-foreground font-medium">Ordenar por:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border bg-secondary px-3 py-1.5 text-xs outline-none focus:border-primary"
          >
            <option value="default">Recomendados</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
            <option value="name">Nombre (A-Z)</option>
          </select>
        </div>
      </div>

      {/* BOTONES DE FILTRO DE CATEGORÍAS SINCRONIZADOS */}
      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
              category === cat
                ? "bg-primary text-primary-foreground font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                : "bg-secondary border border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRILLA DE PRODUCTOS */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>

      {list.length === 0 && (
        <p className="py-20 text-center text-muted-foreground">
          No encontramos camisetas en esta categoría o búsqueda.
        </p>
      )}
    </section>
  );
}