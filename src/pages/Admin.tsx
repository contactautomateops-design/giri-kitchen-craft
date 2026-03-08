import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Trash2, Package, Tag, ToggleLeft, ToggleRight } from "lucide-react";

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"coupons" | "orders">("orders");
  const [coupons, setCoupons] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: "", discount_percent: 0, discount_amount: 0, min_order_amount: 0, max_uses: 100 });
  const [saving, setSaving] = useState(false);

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

  if (authLoading) return <div className="min-h-screen flex items-center justify-center pt-20"><p className="font-body text-muted-foreground">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-background pt-24 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-playfair text-2xl font-bold text-foreground mb-6">Admin Dashboard</h1>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("orders")}
            className={`px-4 py-2 rounded-xl font-body text-sm font-medium transition-colors ${tab === "orders" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
            <Package className="w-3.5 h-3.5 inline mr-1.5" /> Orders ({orders.length})
          </button>
          <button onClick={() => setTab("coupons")}
            className={`px-4 py-2 rounded-xl font-body text-sm font-medium transition-colors ${tab === "coupons" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
            <Tag className="w-3.5 h-3.5 inline mr-1.5" /> Coupons ({coupons.length})
          </button>
        </div>

        {tab === "orders" && (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <p className="font-body font-semibold text-sm text-foreground">{order.customer_name}</p>
                    <p className="font-body text-[10px] text-muted-foreground">{order.customer_phone} • {new Date(order.created_at).toLocaleDateString("en-IN")}</p>
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
      </div>
    </div>
  );
};

export default Admin;
