import React, { useState } from 'react';
import { useStore, Product } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Upload, Trash2, Edit2, Loader2, X, Plus } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  'Liga Argentina',
  'Ascenso Argentino',
  'Retro / Clásicas',
  'Niños',
  'Shorts',
  'Selecciones',
];

const TAGS = ['BAJO PEDIDO', 'MÁS VENDIDO', 'RETRO', 'ASCENSO'];
const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export function AdminPanel() {
  const { products, addProduct, deleteProduct, fetchProducts } = useStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>(['BAJO PEDIDO']);
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL', 'XXL']);

  // Previews e Imágenes
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  
  const [secImageFile, setSecImageFile] = useState<File | null>(null);
  const [secImagePreview, setSecImagePreview] = useState<string>('');

  const [uploading, setUploading] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const uploadFileToSupabase = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      toast.error(`Error en imagen: ${uploadError.message}`);
      return null;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleEditInit = (product: Product) => {
    setEditingId(product.id);
    setTitle(product.title);
    setPrice(product.price.toString());
    setCategory(product.category);
    setSizes(product.sizes || []);
    setMainImagePreview(product.image);
    setSecImagePreview(product.secondary_image || '');
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setPrice('');
    setCategory(CATEGORIES[0]);
    setSelectedTags(['BAJO PEDIDO']);
    setSizes(['S', 'M', 'L', 'XL', 'XXL']);
    setMainImageFile(null);
    setMainImagePreview('');
    setSecImageFile(null);
    setSecImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !price) {
      toast.error('Completá título y precio');
      return;
    }

    if (!editingId && !mainImageFile) {
      toast.error('Cargá al menos la foto principal');
      return;
    }

    setUploading(true);

    try {
      let finalMainImage = mainImagePreview;
      let finalSecImage = secImagePreview;

      if (mainImageFile) {
        const url = await uploadFileToSupabase(mainImageFile);
        if (url) finalMainImage = url;
      }

      if (secImageFile) {
        const url = await uploadFileToSupabase(secImageFile);
        if (url) finalSecImage = url;
      }

      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update({
            title,
            price: Number(price),
            category,
            sizes,
            image: finalMainImage,
            secondary_image: finalSecImage,
          })
          .eq('id', editingId);

        if (error) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.success('Producto actualizado');
          await fetchProducts();
          resetForm();
        }
      } else {
        const success = await addProduct({
          title,
          price: Number(price),
          category,
          sizes,
          image: finalMainImage,
          secondary_image: finalSecImage,
        });

        if (success) {
          toast.success('Producto guardado en Supabase');
          await fetchProducts(); // Refresca las listas inmediatamente
          resetForm();
        }
      }
    } catch (err: any) {
      toast.error('Error al guardar el producto');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-foreground items-start">
      {/* Columna Izquierda: Formulario (Nuevo / Editar) */}
      <div className="bg-card border border-border p-4 rounded-xl space-y-4">
        <div className="flex justify-between items-center border-b border-border/50 pb-2">
          <h3 className="font-bold text-sm">
            {editingId ? 'Editar producto' : 'Nuevo producto'}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Cancelar
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-secondary/80 border border-border rounded-lg px-3 py-2 text-xs outline-none focus:border-primary"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-secondary/80 border border-border rounded-lg px-3 py-2 text-xs outline-none focus:border-primary"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Precio (ARS)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-secondary/80 border border-border rounded-lg px-3 py-2 text-xs outline-none focus:border-primary"
          />

          {/* Carga de 2 Fotos */}
          <div className="grid grid-cols-2 gap-2">
            <label className="border border-dashed border-border hover:border-primary/50 rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer bg-secondary/30 min-h-[75px]">
              {mainImagePreview ? (
                <img src={mainImagePreview} alt="Frente" className="w-12 h-12 object-cover rounded" />
              ) : (
                <div className="text-center">
                  <Upload className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                  <span className="text-[10px] text-muted-foreground">Foto Frente</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setMainImageFile(f);
                    setMainImagePreview(URL.createObjectURL(f));
                  }
                }}
              />
            </label>

            <label className="border border-dashed border-border hover:border-primary/50 rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer bg-secondary/30 min-h-[75px]">
              {secImagePreview ? (
                <img src={secImagePreview} alt="Espalda" className="w-12 h-12 object-cover rounded" />
              ) : (
                <div className="text-center">
                  <Upload className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                  <span className="text-[10px] text-muted-foreground">Foto Espalda</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setSecImageFile(f);
                    setSecImagePreview(URL.createObjectURL(f));
                  }
                }}
              />
            </label>
          </div>

          {/* Etiquetas / Badges */}
          <div className="flex gap-1.5 flex-wrap pt-1">
            {TAGS.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2 py-1 text-[10px] font-extrabold rounded-md border uppercase transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary/20 text-primary border-primary'
                    : 'bg-secondary/60 text-muted-foreground border-border'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Talles */}
          <div className="flex gap-1 flex-wrap pt-1">
            {AVAILABLE_SIZES.map((sz) => (
              <button
                type="button"
                key={sz}
                onClick={() => toggleSize(sz)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md border transition-colors ${
                  sizes.includes(sz)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary/60 text-muted-foreground border-border'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
          >
            {uploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Guardando...
              </>
            ) : editingId ? (
              'Guardar Cambios'
            ) : (
              <>
                <Plus className="h-4 w-4" /> Agregar producto
              </>
            )}
          </button>
        </form>
      </div>

      {/* Columna Derecha: Lista de Productos */}
      <div className="bg-card border border-border p-4 rounded-xl space-y-3">
        <h3 className="font-bold text-sm border-b border-border/50 pb-2">
          Productos ({products.length})
        </h3>

        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between bg-secondary/30 border border-border p-2 rounded-lg hover:border-border/80 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-9 h-9 rounded object-cover border border-border/50 flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-xs truncate">{p.title}</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {p.category} · ${p.price.toLocaleString('es-AR')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleEditInit(p)}
                  className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"
                  title="Editar"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    if (confirm(`¿Borrar ${p.title}?`)) {
                      await deleteProduct(p.id);
                      toast.success('Eliminado');
                    }
                  }}
                  className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-red-500 transition-colors"
                  title="Borrar"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;