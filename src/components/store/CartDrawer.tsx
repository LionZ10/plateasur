import React, { useState } from "react";
import { useStore, formatARS } from "@/lib/store";
import { X, Trash2, Plus, Minus, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const STATIONS = [
  "Estación A. Korn",
  "Estacion Guernica",
  "Estación Glew",  
  "Estación Longchamps",
  "Estación Burzaco",
  "Estación Adrogué",
  "Estación Temperley",
  "Estación Lomas de Zamora",
  "Estación Banfield",
  "Estación Remedios de Escalada",
  "Estación Lanús",
  "Estación Gerli",
  "Estación Avellaneda",
  "Estación Plaza Constitución",
];

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    buildWhatsAppMessage,
  } = useStore();

  const [customerName, setCustomerName] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"envio" | "punto">("envio");
  
  // Campos Envío a Domicilio
  const [address, setAddress] = useState("");
  const [locality, setLocality] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Campo Punto de Encuentro
  const [station, setStation] = useState(STATIONS[0]);

  const total = cart.reduce((acc, item) => {
    const price = Number(item.product?.price || 0);
    return acc + (isNaN(price) ? 0 : price) * item.quantity;
  }, 0);

  const handleSendWhatsApp = () => {
    if (cart.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }
    if (!customerName.trim()) {
      toast.error("Por favor, ingresá tu Nombre y Apellido");
      return;
    }

    if (deliveryMethod === "envio" && (!address.trim() || !locality.trim())) {
      toast.error("Por favor, completá tu Dirección y Localidad para el envío");
      return;
    }

    // Construcción del mensaje pasando los datos del formulario
    let deliveryDetails = "";
    if (deliveryMethod === "envio") {
      deliveryDetails = `Envío a domicilio\n• Dirección: ${address}\n• Localidad: ${locality}${zipCode ? `\n• C.P.: ${zipCode}` : ""}`;
    } else {
      deliveryDetails = `Punto de encuentro (${station})`;
    }

    let message = `*NUEVO PEDIDO - PLATEA SUR*\n\n`;
    message += `*Cliente:* ${customerName}\n`;
    message += `*Método de Entrega:* ${deliveryDetails}\n\n`;
    message += `*Detalle del pedido:*\n`;

    cart.forEach((item) => {
      const subtotal = item.product.price * item.quantity;
      message += `• ${item.product.title} (Talle: ${item.size}) x${item.quantity} - $${subtotal.toLocaleString("es-AR")}\n`;
    });

    message += `\n*TOTAL: $${total.toLocaleString("es-AR")}*`;

    const phone = "5491149709340";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border-l border-border h-full flex flex-col justify-between p-6 overflow-y-auto shadow-2xl relative">
        <div>
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-border">
            <h2 className="font-display text-2xl uppercase font-black tracking-wider text-foreground">
              Tu Pedido
            </h2>
            <button
              onClick={() => setCartOpen(false)}
              className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground font-semibold">
              Tu carrito está vacío.
            </div>
          ) : (
            <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
              {cart.map((item) => {
                const prod = item.product;
                const priceNum = Number(prod.price || 0);

                return (
                  <div
                    key={`${prod.id}-${item.size}`}
                    className="flex items-center gap-3 bg-secondary/40 border border-border p-3 rounded-xl"
                  >
                    <div className="w-14 h-14 bg-secondary rounded-lg overflow-hidden border border-border/60 flex-shrink-0">
                      {prod.image ? (
                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                          Sin foto
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs truncate">{prod.title}</h4>
                      <p className="text-[11px] text-primary font-bold">
                        Talle {item.size}
                      </p>
                      <p className="text-xs font-black text-foreground mt-0.5">
                        ${priceNum.toLocaleString("es-AR")}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-secondary px-2 py-1 rounded-lg border border-border">
                      <button
                        onClick={() => updateQuantity(prod.id, item.size, item.quantity - 1)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(prod.id, item.size, item.quantity + 1)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(prod.id, item.size)}
                      className="text-muted-foreground hover:text-red-500 p-1 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border space-y-3">
          {/* Nombre y Apellido */}
          <div>
            <input
              type="text"
              placeholder="Nombre y Apellido"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-primary font-bold"
            />
          </div>

          {/* Selector de Método */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDeliveryMethod("envio")}
              className={`py-2 px-3 text-[11px] font-bold rounded-xl border transition-all ${
                deliveryMethod === "envio"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/60 text-muted-foreground border-border"
              }`}
            >
              Envío a domicilio
            </button>
            <button
              type="button"
              onClick={() => setDeliveryMethod("punto")}
              className={`py-2 px-3 text-[11px] font-bold rounded-xl border transition-all ${
                deliveryMethod === "punto"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/60 text-muted-foreground border-border"
              }`}
            >
              Punto de encuentro Zona Sur
            </button>
          </div>

          {/* Campos condicionales según el método elegido */}
          {deliveryMethod === "envio" ? (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Dirección (Calle, Número, Piso/Depto)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-primary font-bold"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Localidad / Barrio"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-primary font-bold"
                />
                <input
                  type="text"
                  placeholder="Código Postal (Opcional)"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-primary font-bold"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-[11px] text-muted-foreground font-semibold block mb-1">
                Seleccioná la estación del Tren Roca:
              </label>
              <select
                value={station}
                onChange={(e) => setStation(e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary font-bold cursor-pointer"
              >
                {STATIONS.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-muted-foreground font-bold">Total</span>
            <span className="text-2xl font-black text-primary tracking-tight">
              ${total.toLocaleString("es-AR")}
            </span>
          </div>

          <button
            onClick={handleSendWhatsApp}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="h-4 w-4" /> Enviar Pedido por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartDrawer;