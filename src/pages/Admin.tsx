import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useInventory } from "@/hooks/useInventory";
import { products } from "@/data/products";
import { Plus, Trash2, Package, Tag, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight, ClipboardPlus, Minus, X, BoxesIcon, Users, ChevronDown, ChevronUp } from "lucide-react";

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { inventory, refetch: refetchInventory } = useInventory();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"coupons" | "orders" | "stock">("orders");
  const [coupons, setCoupons] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showManualOrder, setShowManualOrder] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: "", discount_percent: 0, discount_amount: 0, min_order_amount: 0, max_uses: 100 });
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [viewAll, setViewAll] = useState(false);

  // Manual order state
  const [manualOrder, setManualOrder] = useState({
    customer_name: "",
    customer_phone: "",
    delivery_address: "",
    items: [] as { name: string; price: number; quantity: number }[],
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/");
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchCoupons();
      fetchOrders();
    }
  }, [isAdmin]);

  const fetchCoupons = async () => {
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    if (data) setCoupons(data);
  };

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
    if (data) setOrders(data);
  };

  const filteredOrders = useMemo(() => {
    if (viewAll) return orders;
    return orders.filter(o => {
      const orderDate = new Date(o.created_at).toISOString().slice(0, 10);
      return orderDate === selectedDate;
    });
  }, [orders, selectedDate, viewAll]);

  const todayTotal = useMemo(() => filteredOrders.reduce((s, o) => s + o.total, 0), [filteredOrders]);

  const shiftDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().slice(0, 10));
    setViewAll(false);
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from("coupons").insert({
      code: newCoupon.code.toUpperCase(),
      discount_percent: newCoupon.discount_percent,
      discount_amount: newCoupon.discount_amount,
      min_order_amount: newCoupon.min_order_amount,
      max_uses: newCoupon.max_uses,
    });
    setNewCoupon({ code: "", discount_percent: 0, discount_amount: 0, min_order_amount: 0, max_uses: 100 });
    setShowAdd(false);
    fetchCoupons();
    setSaving(false);
  };

  const toggleCoupon = async (id: string, isActive: boolean) => {
    await supabase.from("coupons").update({ is_active: !isActive }).eq("id", id);
    fetchCoupons();
  };

  const deleteCoupon = async (id: string) => {
    await supabase.from("coupons").delete().eq("id", id);
    fetchCoupons();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    fetchOrders();
  };

  const updateStock = async (productName: string, newStock: number) => {
    await supabase.from("product_inventory").update({ stock: Math.max(0, newStock), updated_at: new Date().toISOString() } as any).eq("product_name", productName);
    refetchInventory();
  };

  // Manual order helpers
  const addProductToManual = (product: typeof products[0]) => {
    setManualOrder(prev => {
      const existing = prev.items.find(i => i.name === product.name);
      if (existing) {
        return { ...prev, items: prev.items.map(i => i.name === product.name ? { ...i, quantity: i.quantity + 1 } : i) };
      }
      return { ...prev, items: [...prev.items, { name: product.name, price: product.price, quantity: 1 }] };
    });
  };

  const updateManualQty = (name: string, delta: number) => {
    setManualOrder(prev => ({
      ...prev,
      items: prev.items.map(i => i.name === name ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i),
    }));
  };

  const removeManualItem = (name: string) => {
    setManualOrder(prev => ({ ...prev, items: prev.items.filter(i => i.name !== name) }));
  };

  const manualTotal = manualOrder.items.reduce((s, i) => s + i.price * i.quantity, 0);

  const submitManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualOrder.items.length || !user) return;
    setSaving(true);

    const { data: order, error } = await supabase.from("orders").insert({
      user_id: user.id,
      customer_name: manualOrder.customer_name,
      customer_phone: manualOrder.customer_phone,
      delivery_address: manualOrder.delivery_address || "STORE PICKUP",
      subtotal: manualTotal,
      total: manualTotal,
      status: "confirmed",
    }).select().single();

    if (order && !error) {
      await supabase.from("order_items").insert(
        manualOrder.items.map(i => ({ order_id: order.id, product_name: i.name, price: i.price, quantity: i.quantity }))
      );
    }

    setManualOrder({ customer_name: "", customer_phone: "", delivery_address: "", items: [] });
    setShowManualOrder(false);
    fetchOrders();
    setSaving(false);
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center pt-20"><p className="font-body text-muted-foreground">Loading...</p></div>;

  const formatDate = (d: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (d === today) return "Today";
    if (d === yesterday) return "Yesterday";
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-playfair text-2xl font-bold text-foreground mb-6">Admin Dashboard</h1>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("orders")}
            className={`px-4 py-2 rounded-xl font-body text-sm font-medium transition-colors ${tab === "orders" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
            <Package className="w-3.5 h-3.5 inline mr-1.5" /> Orders
          </button>
          <button onClick={() => setTab("coupons")}
            className={`px-4 py-2 rounded-xl font-body text-sm font-medium transition-colors ${tab === "coupons" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
            <Tag className="w-3.5 h-3.5 inline mr-1.5" /> Coupons
          </button>
          <button onClick={() => setTab("stock")}
            className={`px-4 py-2 rounded-xl font-body text-sm font-medium transition-colors ${tab === "stock" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
            <BoxesIcon className="w-3.5 h-3.5 inline mr-1.5" /> Stock
          </button>
        </div>

        {tab === "orders" && (
          <div>
            {/* Date filter & summary */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <button onClick={() => shiftDate(-1)} className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>
                <button
                  onClick={() => { setSelectedDate(new Date().toISOString().slice(0, 10)); setViewAll(false); }}
                  className={`px-3 py-1.5 rounded-lg font-body text-xs font-semibold transition-colors ${!viewAll ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                  {formatDate(selectedDate)}
                </button>
                <button onClick={() => shiftDate(1)} className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                  <ChevronRight className="w-4 h-4 text-foreground" />
                </button>
                <button onClick={() => setViewAll(!viewAll)}
                  className={`px-3 py-1.5 rounded-lg font-body text-xs font-medium transition-colors ${viewAll ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                  All
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-body text-[10px] text-muted-foreground">{filteredOrders.length} orders</p>
                  <p className="font-body font-bold text-sm text-primary">₹{todayTotal}</p>
                </div>
                <button onClick={() => setShowManualOrder(true)}
                  className="px-3 py-2 rounded-xl bg-primary text-primary-foreground font-body text-xs font-semibold flex items-center gap-1.5">
                  <ClipboardPlus className="w-3.5 h-3.5" /> New Order
                </button>
              </div>
            </div>

            {/* Manual order form */}
            {showManualOrder && (
              <form onSubmit={submitManualOrder} className="bg-card rounded-2xl border border-border p-5 mb-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-body font-semibold text-sm text-foreground">Manual Order Entry</h3>
                  <button type="button" onClick={() => setShowManualOrder(false)} className="p-1 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-body text-[10px] font-semibold text-foreground block mb-1">Customer Name *</label>
                    <input type="text" required value={manualOrder.customer_name} onChange={e => setManualOrder(p => ({ ...p, customer_name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border font-body text-xs bg-background" />
                  </div>
                  <div>
                    <label className="font-body text-[10px] font-semibold text-foreground block mb-1">Phone *</label>
                    <input type="tel" required value={manualOrder.customer_phone} onChange={e => setManualOrder(p => ({ ...p, customer_phone: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border font-body text-xs bg-background" />
                  </div>
                  <div>
                    <label className="font-body text-[10px] font-semibold text-foreground block mb-1">Address (blank = Store Pickup)</label>
                    <input type="text" value={manualOrder.delivery_address} onChange={e => setManualOrder(p => ({ ...p, delivery_address: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border font-body text-xs bg-background" />
                  </div>
                </div>

                {/* Product selector */}
                <div>
                  <label className="font-body text-[10px] font-semibold text-foreground block mb-2">Add Products</label>
                  <div className="flex flex-wrap gap-2">
                    {products.map(p => (
                      <button key={p.id} type="button" onClick={() => addProductToManual(p)}
                        className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 font-body text-xs transition-colors">
                        {p.emoji} {p.name} — ₹{p.price}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected items */}
                {manualOrder.items.length > 0 && (
                  <div className="space-y-2">
                    {manualOrder.items.map(item => (
                      <div key={item.name} className="flex items-center justify-between bg-secondary/50 rounded-lg px-3 py-2">
                        <span className="font-body text-xs text-foreground">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => updateManualQty(item.name, -1)} className="p-0.5 rounded bg-background border border-border"><Minus className="w-3 h-3" /></button>
                          <span className="font-body text-xs font-semibold w-5 text-center">{item.quantity}</span>
                          <button type="button" onClick={() => updateManualQty(item.name, 1)} className="p-0.5 rounded bg-background border border-border"><Plus className="w-3 h-3" /></button>
                          <span className="font-body text-xs text-muted-foreground w-14 text-right">₹{item.price * item.quantity}</span>
                          <button type="button" onClick={() => removeManualItem(item.name)} className="p-0.5 text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
                        </div>
                      </div>
                    ))}
                    <div className="text-right font-body font-bold text-sm text-primary">Total: ₹{manualTotal}</div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button type="submit" disabled={saving || !manualOrder.items.length}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-body text-xs font-semibold disabled:opacity-50">
                    {saving ? "Saving..." : "Create Order"}
                  </button>
                  <button type="button" onClick={() => setShowManualOrder(false)}
                    className="px-4 py-2 rounded-lg border border-border font-body text-xs">Cancel</button>
                </div>
              </form>
            )}

            {/* Orders list */}
            <div className="space-y-4">
              {filteredOrders.length === 0 && (
                <p className="font-body text-sm text-muted-foreground text-center py-8">No orders for {viewAll ? "any date" : formatDate(selectedDate)}</p>
              )}
              {filteredOrders.map(order => (
                <div key={order.id} className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div>
                      <p className="font-body font-semibold text-sm text-foreground">{order.customer_name}</p>
                      <p className="font-body text-[10px] text-muted-foreground">
                        {order.customer_phone} • {new Date(order.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className="font-body text-[10px] text-muted-foreground">{order.delivery_address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-border font-body text-xs bg-background">
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between font-body text-xs text-muted-foreground">
                        <span>{item.product_name} × {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
                    {order.discount > 0 && <span className="font-body text-[10px] text-green-600">-₹{order.discount} ({order.coupon_code})</span>}
                    <span className="font-body font-bold text-sm text-primary ml-auto">₹{order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "coupons" && (
          <div>
            <button onClick={() => setShowAdd(!showAdd)}
              className="mb-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-body text-xs font-semibold flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Coupon
            </button>

            {showAdd && (
              <form onSubmit={handleAddCoupon} className="bg-card rounded-2xl border border-border p-5 mb-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-body text-[10px] font-semibold text-foreground block mb-1">Code</label>
                    <input type="text" value={newCoupon.code} onChange={e => setNewCoupon(c => ({ ...c, code: e.target.value }))} required
                      className="w-full px-3 py-2 rounded-lg border border-border font-body text-xs bg-background" placeholder="SAVE10" />
                  </div>
                  <div>
                    <label className="font-body text-[10px] font-semibold text-foreground block mb-1">Discount %</label>
                    <input type="number" value={newCoupon.discount_percent} onChange={e => setNewCoupon(c => ({ ...c, discount_percent: +e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border font-body text-xs bg-background" min="0" max="100" />
                  </div>
                  <div>
                    <label className="font-body text-[10px] font-semibold text-foreground block mb-1">Flat ₹ Off</label>
                    <input type="number" value={newCoupon.discount_amount} onChange={e => setNewCoupon(c => ({ ...c, discount_amount: +e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border font-body text-xs bg-background" min="0" />
                  </div>
                  <div>
                    <label className="font-body text-[10px] font-semibold text-foreground block mb-1">Min Order ₹</label>
                    <input type="number" value={newCoupon.min_order_amount} onChange={e => setNewCoupon(c => ({ ...c, min_order_amount: +e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border font-body text-xs bg-background" min="0" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={saving}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-body text-xs font-semibold disabled:opacity-50">
                    {saving ? "Saving..." : "Create Coupon"}
                  </button>
                  <button type="button" onClick={() => setShowAdd(false)}
                    className="px-4 py-2 rounded-lg border border-border font-body text-xs">Cancel</button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {coupons.map(coupon => (
                <div key={coupon.id} className="bg-card rounded-2xl border border-border p-4 flex items-center justify-between">
                  <div>
                    <p className="font-body font-bold text-sm text-foreground">{coupon.code}</p>
                    <p className="font-body text-[10px] text-muted-foreground">
                      {coupon.discount_percent > 0 && `${coupon.discount_percent}% off`}
                      {coupon.discount_percent > 0 && coupon.discount_amount > 0 && " + "}
                      {coupon.discount_amount > 0 && `₹${coupon.discount_amount} off`}
                      {coupon.min_order_amount > 0 && ` • Min ₹${coupon.min_order_amount}`}
                      {` • Used ${coupon.used_count}/${coupon.max_uses || "∞"}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleCoupon(coupon.id, coupon.is_active)}
                      className={`p-1.5 rounded-lg ${coupon.is_active ? "text-green-600" : "text-muted-foreground"}`}>
                      {coupon.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                    <button onClick={() => deleteCoupon(coupon.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === "stock" && (
          <div className="space-y-3">
            <p className="font-body text-xs text-muted-foreground mb-2">Set available stock for each product. Products with 0 stock will show as "Out of Stock".</p>
            {inventory.map(item => (
              <div key={item.id} className="bg-card rounded-2xl border border-border p-4 flex items-center justify-between">
                <div>
                  <p className="font-body font-semibold text-sm text-foreground">{item.product_name}</p>
                  <p className={`font-body text-[10px] ${item.stock <= 0 ? "text-destructive font-bold" : item.stock <= 10 ? "text-accent-foreground" : "text-muted-foreground"}`}>
                    {item.stock <= 0 ? "OUT OF STOCK" : `${item.stock} in stock`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateStock(item.product_name, item.stock - 10)}
                    className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                    <Minus className="w-3.5 h-3.5 text-foreground" />
                  </button>
                  <input
                    type="number"
                    value={item.stock}
                    onChange={e => updateStock(item.product_name, parseInt(e.target.value) || 0)}
                    className="w-16 text-center px-2 py-1.5 rounded-lg border border-border font-body text-xs bg-background"
                    min="0"
                  />
                  <button onClick={() => updateStock(item.product_name, item.stock + 10)}
                    className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                    <Plus className="w-3.5 h-3.5 text-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
