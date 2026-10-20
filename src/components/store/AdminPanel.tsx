import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ADMIN_PIN, CATEGORIES, SIZES, TAGS, formatARS, useStore, type Product } from "@/lib/store";
import j1 from "@/assets/jersey-1.jpg";

const empty = (): Product => ({ id: "", title: "", category: CATEGORIES[0], price: 0, image: "", tags: ["BAJO PEDIDO"], sizes: [...SIZES] });
const field = "w-full rounded-lg border bg-secondary px-3 py-2 text-sm outline-none focus:border-primary";

export function AdminPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { products, saveProduct, deleteProduct } = useStore();
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [form, setForm] = useState<Product>(empty);

  const toggle = (key: "tags" | "sizes", v: string) =>
    setForm((f) => ({ ...f, [key]: f[key].includes(v) ? f[key].filter((x) => x !== v) : [...f[key], v] }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || form.price <= 0 || !form.sizes.length) { toast.error("Completá título, precio y talles"); return; }
    saveProduct({ ...form, id: form.id || `p${Date.now()}`, image: form.image.trim() || j1 });
    toast.success(form.id ? "Producto actualizado" : "Producto agregado");
    setForm(empty());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader><DialogTitle className="font-display text-3xl">Acceso Staff</DialogTitle></DialogHeader>
        {!authed ? (
          <form onSubmit={(e) => { e.preventDefault(); if (pin === ADMIN_PIN) setAuthed(true); else toast.error("PIN incorrecto"); }} className="space-y-3">
            <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Ingresar PIN" className={field} autoFocus />
            <button className="btn-glow w-full rounded-lg py-2.5 font-bold">Ingresar</button>
          </form>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <form onSubmit={submit} className="space-y-3">
              <h3 className="font-semibold">{form.id ? "Editar producto" : "Nuevo producto"}</h3>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título" className={field} />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={field}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="Precio (ARS)" className={field} />
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="URL de imagen" className={field} />
              <div className="flex flex-wrap gap-1.5">
                {TAGS.map((t) => <button type="button" key={t} onClick={() => toggle("tags", t)} className={`rounded-md border px-2 py-1 text-xs ${form.tags.includes(t) ? "border-primary bg-primary text-primary-foreground" : ""}`}>{t}</button>)}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SIZES.map((s) => <button type="button" key={s} onClick={() => toggle("sizes", s)} className={`w-11 rounded-md border py-1 text-xs ${form.sizes.includes(s) ? "border-primary bg-accent" : "text-muted-foreground"}`}>{s}</button>)}
              </div>
              <div className="flex gap-2">
                <button className="btn-glow flex flex-1 items-center justify-center gap-1 rounded-lg py-2.5 text-sm font-bold"><Plus className="h-4 w-4" /> {form.id ? "Guardar cambios" : "Agregar producto"}</button>
                {form.id && <button type="button" onClick={() => setForm(empty())} className="rounded-lg border px-3 text-sm">Cancelar</button>}
              </div>
            </form>
            <div className="space-y-2">
              <h3 className="font-semibold">Productos ({products.length})</h3>
              <div className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-lg border bg-secondary p-2">
                    <img src={p.image} alt="" className="h-12 w-10 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.category} · {formatARS(p.price)}</p>
                    </div>
                    <button onClick={() => setForm(p)} aria-label="Editar" className="p-1.5 hover:text-primary"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => { deleteProduct(p.id); toast("Producto eliminado"); }} aria-label="Eliminar" className="p-1.5 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
