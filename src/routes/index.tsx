import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "sonner";
import { Package, Truck, MapPin, MessageCircle, Instagram } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { StoreProvider, INSTAGRAM, WHATSAPP } from "@/lib/store";
import { AnnouncementBar, Header, Logo } from "@/components/store/Header";
import { Catalog } from "@/components/store/Catalog";
import { CartDrawer } from "@/components/store/CartDrawer";
import { SizeGuide } from "@/components/store/SizeGuide";
import { AdminPanel } from "@/components/store/AdminPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Platea Sur - Indumentaria Futbolera | Camisetas bajo pedido" },
      { name: "description", content: "Camisetas de Liga Argentina, Ascenso, Retro, Selecciones y Niños bajo pedido. Envíos a todo el país y entregas en Zona Sur." },
      { property: "og:title", content: "Platea Sur - Indumentaria Futbolera" },
      { property: "og:description", content: "Camisetas de fútbol bajo pedido. Pedidos directos por WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FAQ = [
  ["¿Cuánto tarda un pedido?", "Al ser bajo pedido, coordinamos los tiempos por WhatsApp según el modelo y talle."],
  ["¿Cómo pago?", "Te pasamos los medios de pago al confirmar tu encargo por WhatsApp."],
  ["¿Dónde entregan?", "Envíos a domicilio a todo el país y puntos de encuentro acordados en Zona Sur."],
];

function Index() {
  const [guide, setGuide] = useState(false);
  const [admin, setAdmin] = useState(false);
  return (
    <StoreProvider>
      <AnnouncementBar />
      <Header />
      <main>
        <section className="relative overflow-hidden">
          <img src={hero} alt="" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
          <div className="pitch-lines absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-36">
            <p className="mb-4 inline-flex rounded-full border border-primary/40 bg-accent/60 px-3 py-1 text-xs uppercase tracking-[0.25em] text-primary">Cultura futbolera · Zona Sur</p>
            <h1 className="max-w-3xl font-display text-6xl leading-[0.9] md:text-8xl">
              Las Camisetas de Fútbol que Buscás, <span className="bg-gradient-primary bg-clip-text text-transparent">Bajo Pedido</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">Liga Argentina, Ascenso, Retro, Selecciones y Niños. Elegí tu talle y coordinamos tu encargo.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#catalogo" className="btn-glow rounded-full px-7 py-3.5 font-bold">Ver Catálogo</a>
              <a href="#envios" className="rounded-full border border-foreground/30 px-7 py-3.5 font-bold transition hover:border-primary hover:text-primary">Medios de Envío</a>
            </div>
          </div>
        </section>

        <section id="envios" className="mx-auto max-w-7xl scroll-mt-32 px-4">
          <div className="relative -mt-8 grid gap-4 rounded-2xl border border-primary/40 bg-card p-6 shadow-glow md:grid-cols-[auto_1fr] md:p-8">
            <Package className="h-10 w-10 text-primary" />
            <div>
              <h2 className="font-display text-3xl">Modelo Bajo Pedido & Envíos</h2>
              <p className="mt-1 text-muted-foreground">📦 Todas nuestras prendas se manejan bajo pedido. Realizamos envíos a domicilio a todo el país y entregas en puntos de encuentro acordados en Zona Sur.</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Envío a domicilio</span>
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Punto de encuentro Zona Sur</span>
                <span className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-primary" /> Pedido por WhatsApp</span>
              </div>
            </div>
          </div>
        </section>

        <Catalog onSizeGuide={() => setGuide(true)} />

        <section id="faq" className="mx-auto max-w-3xl px-4 pb-20">
          <h2 className="font-display text-4xl">Preguntas Frecuentes</h2>
          <div className="mt-4 space-y-2">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group rounded-xl border bg-card p-4">
                <summary className="cursor-pointer font-semibold marker:text-primary">{q}</summary>
                <p className="mt-2 text-sm text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground">Platea Sur - Indumentaria Futbolera. Camisetas bajo pedido para todo el país.</p>
          </div>
          <div className="space-y-2 text-sm">
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary"><Instagram className="h-4 w-4" /> @plateasur</a>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary"><MessageCircle className="h-4 w-4" /> 11 4970-9340</a>
            <a href="#faq" className="block hover:text-primary">Preguntas Frecuentes</a>
          </div>
          <div className="flex items-end md:justify-end">
            <button onClick={() => setAdmin(true)} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              Acceso Staff
            </button>
          </div>
        </div>
      </footer>

      <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="btn-glow fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full">
        <MessageCircle className="h-6 w-6" />
      </a>

      <CartDrawer />
      <AdminPanel open={admin} onOpenChange={setAdmin} />
      <Toaster theme="dark" position="bottom-left" richColors />
    </StoreProvider>
  );
}
