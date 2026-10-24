import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "sonner";
import { Package, Truck, MapPin, MessageCircle, Instagram, ShieldCheck, X, ChevronDown } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { AnnouncementBar, Header, Logo } from "@/components/store/Header";
import Catalog from "@/components/store/Catalog";
import CartDrawer from "@/components/store/CartDrawer";
import AdminPanel from "@/components/store/AdminPanel";

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

const INSTAGRAM = "https://instagram.com/plateasur";
const WHATSAPP = "5491149709340";

const FAQ = [
  ["¿Cuánto tarda un pedido?", "Al ser bajo pedido, coordinamos los tiempos por WhatsApp según el modelo y talle."],
  ["¿Cómo pago?", "Te pasamos los medios de pago al confirmar tu encargo por WhatsApp."],
  ["¿Dónde entregan?", "Envíos a domicilio a todo el país y puntos de encuentro acordados en Zona Sur."],
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-card/60 overflow-hidden transition-all duration-300 hover:border-primary/40">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 sm:p-5 font-bold text-base flex items-center justify-between gap-4 outline-none select-none cursor-pointer"
      >
        <span>{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-primary flex-shrink-0 transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-4 pb-5 sm:px-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/30">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function Index() {
  const [guide, setGuide] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_STAFF_PASSWORD || "1234";
    if (password === correctPassword) {
      setAuthenticated(true);
      setErrorMsg("");
      setPassword("");
    } else {
      setErrorMsg("Contraseña incorrecta");
    }
  };

  const handleCloseAdmin = () => {
    setAdmin(false);
    setPassword("");
    setErrorMsg("");
  };

  return (
    <> 
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

        <section id="catalogo" className="scroll-mt-20">
          <Catalog />
        </section>

        {/* PREGUNTAS FRECUENTES (Con animación) */}
        <section id="faq" className="mx-auto max-w-3xl px-4 py-16">
  <h2 className="font-display text-4xl mb-6 uppercase tracking-tight font-black">
    Preguntas Frecuentes
  </h2>
  <div className="space-y-3">
    {FAQ.map(([q, a]) => (
      <FaqItem key={q} question={q} answer={a} />
    ))}
  </div>
</section>
      </main>

      {/* FOOTER (Reorganizado para que Acceso Staff no quede tapado) */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 items-center">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground">
              Platea Sur - Indumentaria Futbolera. Camisetas bajo pedido para todo el país.
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Instagram className="h-4 w-4 text-primary" /> @plateasur
            </a>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
              <MessageCircle className="h-4 w-4 text-primary" /> 11 4970-9340
            </a>
            <a href="#faq" className="block hover:text-primary transition-colors">
              Preguntas Frecuentes
            </a>
          </div>

          <div className="flex md:justify-start">
            <button
              onClick={() => setAdmin(true)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-semibold underline underline-offset-4"
            >
              Acceso Staff
            </button>
          </div>
        </div>
      </footer>

      <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="btn-glow fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full">
        <MessageCircle className="h-6 w-6" />
      </a>

      {/* MODAL DE ACCESO STAFF / ADMIN PANEL */}
      {admin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-card border border-border rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-border">
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-wider text-base">
                <ShieldCheck className="h-5 w-5" />
                <span>ACCESO STAFF</span>
              </div>
              <button onClick={handleCloseAdmin} className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {!authenticated ? (
              <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto py-6">
                <div>
                  <input
                    type="password"
                    placeholder="Ingresá Clave..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary text-center font-bold tracking-widest"
                    autoFocus
                  />
                  {errorMsg && <p className="text-red-500 text-xs text-center mt-2 font-semibold">{errorMsg}</p>}
                </div>
                <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-extrabold hover:opacity-90 transition-opacity uppercase text-sm tracking-wider">
                  Ingresar
                </button>
              </form>
            ) : (
              <AdminPanel />
            )}
          </div>
        </div>
      )}

      <CartDrawer />
      <Toaster theme="dark" position="bottom-left" richColors />
    </>
  );
}