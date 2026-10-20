import React, { useState } from "react";
import { Minus, Plus, Trash2, X, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { buildWhatsAppMessage, formatARS, useStore, WHATSAPP } from "@/lib/store";

const DELIVERY_OPTIONS = [
  "Envío a domicilio",
  "Punto de encuentro Zona Sur"
];

// Estaciones del Tren Roca para Puntos de Encuentro
const ESTACIONES_ROCA = [
  "Glew",
  "Guernica",
  "Alejandro Korn",
  "Longchamps",
  "Burzaco",
  "Adrogué",
  "Temperley",
  "Lomas de Zamora",
  "Banfield",
  "Lanús",
  "Plaza Constitución"
];

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeItem } = useStore();
  const [name, setName] = useState("");
  const [delivery, setDelivery] = useState<string>(DELIVERY_OPTIONS[0]);
  
  // Campos dinámicos según tipo de entrega
  const [puntoEncuentro, setPuntoEncuentro] = useState<string>(ESTACIONES_ROCA[0]);
  const [direccion, setDireccion] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const checkout = () => {
    if (!cart.length) {
      toast.error("Tu carrito está vacío");
      return;
    }

    if (!name.trim()) {
      toast.error("Por favor completá tu Nombre y Apellido");
      return;
    }

    // Validación según opción seleccionada
    if (delivery === "Punto de encuentro Zona Sur") {
      if (!puntoEncuentro) {
        toast.error("Seleccioná una estación para el punto de encuentro");
        return;
      }
    } else {
      if (!direccion.trim() || !localidad.trim()) {
        toast.error("Completá dirección y localidad para el envío a domicilio");
        return;
      }
    }

    // Construcción de detalles del envío
    const detallesEnvio =
      delivery === "Punto de encuentro Zona Sur"
        ? `Punto de encuentro: Estación ${puntoEncuentro}`
        : `Envío a domicilio: ${direccion}, ${localidad}${codigoPostal ? ` (CP ${codigoPostal})` : ""}`;

    // Construir mensaje de WhatsApp pasando los datos correspondientes
    const msg = buildWhatsAppMessage(cart, name.trim(), detallesEnvio, delivery);
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const field = "w-full rounded-lg border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors";

  return (
    <div className={`fixed inset-0 z-50 ${cartOpen ? "" : "pointer-events-none"}`}>
      {/* Fondo oscuro */}
      <div
        onClick={() => setCartOpen(false)}
        className={`absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity ${
          cartOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l bg-card transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-display text-3xl">Tu Pedido</h2>
          <button
            onClick={() => setCartOpen(false)}
            aria-label="Cerrar"
            className="rounded-full p-2 hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Lista de camisetas */}
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {cart.length === 0 && (
            <p className="py-10 text-center text-muted-foreground">
              Todavía no agregaste camisetas.
            </p>
          )}
          {cart.map((i) => (
            <div key={i.id} className="flex gap-3 rounded-xl border bg-secondary p-3">
              <img
                src={i.image}
                alt={i.title}
                className="h-20 w-16 rounded-md object-cover"
              />
              <div className="flex flex-1 flex-col">
                <p className="text-sm font-semibold leading-tight">{i.title}</p>
                <p className="text-xs text-muted-foreground">Talle {i.size}</p>
                <div className="mt-auto flex items-center gap-2">
                  <button
                    onClick={() => updateQty(i.id, i.qty - 1)}
                    className="rounded border p-1 hover:border-primary"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold">{i.qty}</span>
                  <button
                    onClick={() => updateQty(i.id, i.qty + 1)}
                    className="rounded border p-1 hover:border-primary"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => removeItem(i.id)}
                    aria-label="Quitar"
                    className="ml-auto text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Formulario de checkout dinámico */}
        <div className="space-y-3 border-t p-4">
          {/* Nombre y Apellido obligatorio */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre y Apellido"
            className={field}
          />

          {/* Botones de Selección de Tipo de Entrega */}
          <div className="grid grid-cols-2 gap-2">
            {DELIVERY_OPTIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDelivery(d)}
                className={`rounded-lg border px-2 py-2 text-xs font-medium transition ${
                  delivery === d
                    ? "border-primary bg-accent text-foreground"
                    : "text-muted-foreground hover:border-primary"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Campos dinámicos según entrega */}
          {delivery === "Punto de encuentro Zona Sur" ? (
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium pl-1">
                Seleccioná la estación del Tren Roca:
              </label>
              <select
                value={puntoEncuentro}
                onChange={(e) => setPuntoEncuentro(e.target.value)}
                className={field}
              >
                {ESTACIONES_ROCA.map((est) => (
                  <option key={est} value={est}>
                    Estación {est}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Dirección (Calle, Número, Piso/Depto)"
                className={field}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={localidad}
                  onChange={(e) => setLocalidad(e.target.value)}
                  placeholder="Localidad / Barrio"
                  className={field}
                />
                <input
                  type="text"
                  value={codigoPostal}
                  onChange={(e) => setCodigoPostal(e.target.value)}
                  placeholder="Código Postal (Opcional)"
                  className={field}
                />
              </div>
            </div>
          )}

          {/* Totales */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-display text-3xl font-bold">{formatARS(total)}</span>
          </div>

          {/* Botón enviar por WhatsApp */}
          <button
            onClick={checkout}
            className="btn-glow flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-bold"
          >
            <MessageCircle className="h-5 w-5" /> Enviar Pedido por WhatsApp
          </button>
        </div>
      </aside>
    </div>
  );
}