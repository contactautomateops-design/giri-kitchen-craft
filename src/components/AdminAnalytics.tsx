import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, ShoppingCart, IndianRupee, Package } from "lucide-react";

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  order_items?: { product_name: string; quantity: number; price: number }[];
}

const COLORS = ["#E87000", "#F5C518", "#C4874A", "#C0392B", "#F39C12", "#2D5A27", "#8B5CF6", "#EC4899"];

const AdminAnalytics = ({ orders }: { orders: Order[] }) => {
  const stats = useMemo(() => {
    const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(o => o.status === "delivered").length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Revenue by day (last 7 days)
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });

    const revenueByDay = last7.map(date => {
      const dayOrders = orders.filter(o => o.status !== "cancelled" && o.created_at.slice(0, 10) === date);
      return {
        date: new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        revenue: dayOrders.reduce((s, o) => s + o.total, 0),
        orders: dayOrders.length,
      };
    });

    // Top products
    const productMap: Record<string, { name: string; qty: number; revenue: number }> = {};
    orders.filter(o => o.status !== "cancelled").forEach(o => {
      o.order_items?.forEach(item => {
        if (!productMap[item.product_name]) {
          productMap[item.product_name] = { name: item.product_name, qty: 0, revenue: 0 };
        }
        productMap[item.product_name].qty += item.quantity;
        productMap[item.product_name].revenue += item.price * item.quantity;
      });
    });
    const topProducts = Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 6);

    // Status breakdown
    const statusMap: Record<string, number> = {};
    orders.forEach(o => { statusMap[o.status] = (statusMap[o.status] || 0) + 1; });
    const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

    return { totalRevenue, totalOrders, deliveredOrders, avgOrderValue, revenueByDay, topProducts, statusData };
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-green-600" },
          { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-blue-600" },
          { label: "Delivered", value: stats.deliveredOrders, icon: Package, color: "text-primary" },
          { label: "Avg Order", value: `₹${stats.avgOrderValue}`, icon: TrendingUp, color: "text-accent" },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="font-body text-[10px] text-muted-foreground">{s.label}</span>
            </div>
            <p className="font-body font-bold text-lg text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-body font-semibold text-sm text-foreground mb-4">Revenue (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={stats.revenueByDay}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 12, border: "1px solid hsl(var(--border))" }}
              formatter={(value: number) => [`₹${value}`, "Revenue"]}
            />
            <Bar dataKey="revenue" fill="hsl(28, 90%, 50%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Top products */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="font-body font-semibold text-sm text-foreground mb-3">Top Products</h3>
          <div className="space-y-2">
            {stats.topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-body text-[10px] font-bold text-muted-foreground w-4">{i + 1}</span>
                  <span className="font-body text-xs text-foreground">{p.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-body text-xs font-semibold text-primary">₹{p.revenue}</span>
                  <span className="font-body text-[10px] text-muted-foreground ml-1">({p.qty} sold)</span>
                </div>
              </div>
            ))}
            {stats.topProducts.length === 0 && (
              <p className="font-body text-xs text-muted-foreground">No order data yet</p>
            )}
          </div>
        </div>

        {/* Order status pie */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="font-body font-semibold text-sm text-foreground mb-3">Order Status</h3>
          {stats.statusData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie data={stats.statusData} dataKey="value" cx="50%" cy="50%" outerRadius={50} innerRadius={25}>
                    {stats.statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1">
                {stats.statusData.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="font-body text-[10px] text-foreground capitalize">{s.name}: {s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="font-body text-xs text-muted-foreground">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
