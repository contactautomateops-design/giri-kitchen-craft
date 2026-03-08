import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { User, Phone, MapPin, Package, LogOut } from "lucide-react";
import InvoiceButton from "@/components/InvoiceButton";

const Profile = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ full_name: "", phone: "", address: "" });
  const [orders, setOrders] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"profile" | "orders">("profile");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchOrders();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
    if (data) setProfile({ full_name: data.full_name || "", phone: data.phone || "", address: data.address || "" });
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setOrders(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name,
      phone: profile.phone,
      address: profile.address,
      updated_at: new Date().toISOString(),
    }).eq("id", user!.id);
    if (!error) setMessage("Profile updated!");
    setTimeout(() => setMessage(""), 3000);
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const statusColor = (status: string) => {
    if (status === "delivered") return "text-green-600 bg-green-50";
    if (status === "confirmed") return "text-blue-600 bg-blue-50";
    if (status === "cancelled") return "text-destructive bg-destructive/10";
    return "text-accent-foreground bg-accent/20";
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center pt-20"><p className="font-body text-muted-foreground">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-background pt-24 pb-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-playfair text-2xl font-bold text-foreground">My Account</h1>
          <button onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border font-body text-xs text-muted-foreground hover:text-destructive hover:border-destructive transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("profile")}
            className={`px-4 py-2 rounded-xl font-body text-sm font-medium transition-colors ${tab === "profile" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
            <User className="w-3.5 h-3.5 inline mr-1.5" /> Profile
          </button>
          <button onClick={() => setTab("orders")}
            className={`px-4 py-2 rounded-xl font-body text-sm font-medium transition-colors ${tab === "orders" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
            <Package className="w-3.5 h-3.5 inline mr-1.5" /> Orders ({orders.length})
          </button>
        </div>

        {tab === "profile" && (
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <p className="font-body text-xs text-muted-foreground mb-4">{user?.email}</p>
            {message && <div className="mb-4 p-3 rounded-xl bg-green-500/10 text-green-700 font-body text-xs">{message}</div>}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-background" />
                </div>
              </div>
              <div>
                <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-background" />
                </div>
              </div>
              <div>
                <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <textarea value={profile.address} onChange={e => setProfile(p => ({ ...p, address: e.target.value }))} rows={3}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-background resize-none" />
                </div>
              </div>
              <button type="submit" disabled={saving}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50">
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>
        )}

        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-8 text-center">
                <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="font-body text-sm text-muted-foreground">No orders yet</p>
                <button onClick={() => navigate("/products")}
                  className="mt-4 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-body text-xs font-semibold">Shop Now</button>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-body text-xs text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                      <p className="font-body text-[10px] text-muted-foreground">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full font-body text-[10px] font-semibold uppercase ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between font-body text-xs text-muted-foreground">
                        <span>{item.product_name} × {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      {order.discount > 0 && <span className="font-body text-[10px] text-green-600">Coupon: {order.coupon_code} (-₹{order.discount})</span>}
                      <InvoiceButton order={order} size="xs" />
                    </div>
                    <span className="font-body font-bold text-sm text-primary">₹{order.total}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
