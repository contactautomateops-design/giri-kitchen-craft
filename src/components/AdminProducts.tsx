import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/hooks/useProducts";
import { Plus, Pencil, Trash2, X, Upload, ToggleLeft, ToggleRight } from "lucide-react";

interface Props {
  products: Product[];
  onRefresh: () => void;
}

const emptyProduct = {
  name: "", weight: "", price: 0, mrp: 0, emoji: "📦",
  accent: "#E87000", badge: "", category: "spices", image_url: "" as string | null,
};

const AdminProducts = ({ products, onRefresh }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyProduct);
    setImageFile(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name, weight: p.weight, price: p.price, mrp: p.mrp,
      emoji: p.emoji, accent: p.accent, badge: p.badge, category: p.category,
      image_url: p.image_url,
    });
    setImageFile(null);
    setShowForm(true);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.image_url;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name: form.name.trim(),
        weight: form.weight.trim(),
        price: form.price,
        mrp: form.mrp,
        emoji: form.emoji,
        accent: form.accent,
        badge: form.badge.toUpperCase(),
        category: form.category,
        image_url: imageUrl || null,
      };

      if (editing) {
        await supabase.from("products").update(payload).eq("id", editing.id);
      } else {
        await supabase.from("products").insert(payload);
        // Also add to inventory
        await supabase.from("product_inventory").insert({
          product_name: payload.name,
          stock: 100,
        });
      }
      setShowForm(false);
      onRefresh();
    } catch (err) {
      console.error("Error saving product:", err);
    }
    setSaving(false);
  };

  const toggleActive = async (p: Product) => {
    await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    onRefresh();
  };

  const deleteProduct = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    await supabase.from("products").delete().eq("id", p.id);
    onRefresh();
  };

  return (
    <div>
      <button onClick={openAdd}
        className="mb-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-body text-xs font-semibold flex items-center gap-1.5">
        <Plus className="w-3.5 h-3.5" /> Add Product
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-5 mb-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-body font-semibold text-sm text-foreground">
              {editing ? "Edit Product" : "Add New Product"}
            </h3>
            <button type="button" onClick={() => setShowForm(false)} className="p-1 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="font-body text-[10px] font-semibold text-foreground block mb-1">Name *</label>
              <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border font-body text-xs bg-background" placeholder="Groundnut Oil" />
            </div>
            <div>
              <label className="font-body text-[10px] font-semibold text-foreground block mb-1">Weight *</label>
              <input type="text" required value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border font-body text-xs bg-background" placeholder="1 Litre" />
            </div>
            <div>
              <label className="font-body text-[10px] font-semibold text-foreground block mb-1">Category *</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border font-body text-xs bg-background">
                <option value="oils">Oils</option>
                <option value="spices">Spices</option>
                <option value="grains">Grains</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="font-body text-[10px] font-semibold text-foreground block mb-1">Price (₹) *</label>
              <input type="number" required min="1" value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border font-body text-xs bg-background" />
            </div>
            <div>
              <label className="font-body text-[10px] font-semibold text-foreground block mb-1">MRP (₹) *</label>
              <input type="number" required min="1" value={form.mrp} onChange={e => setForm(f => ({ ...f, mrp: +e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border font-body text-xs bg-background" />
            </div>
            <div>
              <label className="font-body text-[10px] font-semibold text-foreground block mb-1">Badge</label>
              <input type="text" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border font-body text-xs bg-background" placeholder="BESTSELLER" />
            </div>
            <div>
              <label className="font-body text-[10px] font-semibold text-foreground block mb-1">Emoji</label>
              <input type="text" value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border font-body text-xs bg-background" placeholder="🥜" />
            </div>
            <div>
              <label className="font-body text-[10px] font-semibold text-foreground block mb-1">Accent Color</label>
              <div className="flex gap-2">
                <input type="color" value={form.accent} onChange={e => setForm(f => ({ ...f, accent: e.target.value }))}
                  className="w-8 h-8 rounded-lg border border-border cursor-pointer" />
                <input type="text" value={form.accent} onChange={e => setForm(f => ({ ...f, accent: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded-lg border border-border font-body text-xs bg-background" />
              </div>
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="font-body text-[10px] font-semibold text-foreground block mb-1">Product Image</label>
            <div className="flex items-center gap-3">
              {(form.image_url || imageFile) && (
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : form.image_url || ""}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg border border-border"
                />
              )}
              <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-background cursor-pointer hover:bg-secondary transition-colors">
                <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-body text-xs text-muted-foreground">Upload Image</span>
                <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-body text-xs font-semibold disabled:opacity-50">
              {saving ? "Saving..." : editing ? "Update Product" : "Add Product"}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg border border-border font-body text-xs">Cancel</button>
          </div>
        </form>
      )}

      {/* Products list */}
      <div className="space-y-3">
        {products.length === 0 && (
          <p className="font-body text-sm text-muted-foreground text-center py-8">No products yet. Add your first product!</p>
        )}
        {products.map(p => (
          <div key={p.id} className={`bg-card rounded-2xl border border-border p-4 flex items-center gap-4 ${!p.is_active ? "opacity-60" : ""}`}>
            {p.image_url ? (
              <img src={p.image_url} alt={p.name} className="w-14 h-14 rounded-xl object-cover border border-border" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-2xl">{p.emoji}</div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-body font-semibold text-sm text-foreground truncate">{p.name}</p>
                {p.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: p.accent }}>
                    {p.badge}
                  </span>
                )}
              </div>
              <p className="font-body text-[10px] text-muted-foreground">
                {p.weight} • {p.category} • ₹{p.price} (MRP ₹{p.mrp})
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => toggleActive(p)}
                className={`p-1.5 rounded-lg ${p.is_active ? "text-green-600" : "text-muted-foreground"}`}
                title={p.is_active ? "Deactivate" : "Activate"}>
                {p.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              </button>
              <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => deleteProduct(p)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
