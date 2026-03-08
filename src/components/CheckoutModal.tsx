import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { X, CheckCircle, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

const CheckoutModal = ({ open, onClose }: CheckoutModalProps) => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"details" | "upi" | "success">("details");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cash">("upi");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<"delivery" | "pickup">("delivery");
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  if (!open) return null;

  const finalTotal = Math.max(0, total - discount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError("");
    const { data } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", couponCode.toUpperCase())
      .eq("is_active", true)
      .single();

    if (!data) {
      setCouponError("Invalid or expired coupon");
      return;
    }
    if (data.min_order_amount > 0 && total < data.min_order_amount) {
      setCouponError(`Min order ₹${data.min_order_amount} required`);
      return;
    }
    if (data.max_uses && data.used_count >= data.max_uses) {
      setCouponError("Coupon usage limit reached");
      return;
    }

    let disc = 0;
    if (data.discount_percent > 0) disc += Math.round(total * data.discount_percent / 100);
    if (data.discount_amount > 0) disc += data.discount_amount;
    setDiscount(disc);
    setCouponApplied(true);
  };

  const removeCoupon = () => {
    setDiscount(0);
    setCouponCode("");
    setCouponApplied(false);
    setCouponError("");
  };

  const saveOrder = async (upi: string | null) => {
    if (!user) return;
    const { data: order } = await supabase.from("orders").insert({
      user_id: user.id,
      subtotal: total,
      discount,
      total: finalTotal,
      coupon_code: couponApplied ? couponCode.toUpperCase() : null,
      customer_name: name,
      customer_phone: phone,
      delivery_address: deliveryMode === "pickup" ? "STORE PICKUP" : address,
      upi_id: upi,
      status: paymentMethod === "cash" ? "confirmed" : "pending",
    }).select().single();

    if (order) {
      const orderItemsData = items.map(item => ({
        order_id: order.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));
      await supabase.from("order_items").insert(orderItemsData);

      if (couponApplied) {
        await supabase.rpc("increment_coupon_usage" as any, { coupon_code: couponCode.toUpperCase() });
      }

      const { sendOrderConfirmationEmail, sendOrderNotificationToSeller } = await import("@/lib/n8n");
      const emailItems = items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price }));
      sendOrderConfirmationEmail({
        customerEmail: user.email || "",
        customerName: name,
        orderId: order.id,
        items: emailItems,
        total: finalTotal,
        discount,
        deliveryAddress: deliveryMode === "pickup" ? "STORE PICKUP" : address,
      });
      sendOrderNotificationToSeller({
        customerName: name,
        customerPhone: phone,
        orderId: order.id,
        items: emailItems,
        total: finalTotal,
        deliveryAddress: deliveryMode === "pickup" ? "STORE PICKUP" : address,
      });
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onClose();
      navigate("/auth");
      return;
    }
    if (paymentMethod === "cash") {
      handleCashPayment();
    } else {
      setStep("upi");
    }
  };

  const handleCashPayment = async () => {
    setProcessing(true);
    await saveOrder(null);
    setProcessing(false);
    setStep("success");
    clearCart();
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    const upiPaymentUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("Giri Food Productions")}&am=${finalTotal}&cu=INR&tn=${encodeURIComponent(`Order from Giri Food Productions`)}`;
    window.open(upiPaymentUrl, "_blank");

    await saveOrder(upiId);

    setTimeout(() => {
      setProcessing(false);
      setStep("success");
      clearCart();
    }, 3000);
  };

  const handleClose = () => {
    setStep("details");
    setName("");
    setPhone("");
    setAddress("");
    setUpiId("");
    setDiscount(0);
    setCouponCode("");
    setCouponApplied(false);
    setCouponError("");
    setDeliveryMode("delivery");
    setPaymentMethod("upi");
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[10002]" onClick={handleClose} />
      <div className="fixed inset-0 z-[10003] flex items-center justify-center p-4">
        <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-playfair text-lg font-bold text-foreground">
              {step === "details" && "Delivery Details"}
              {step === "upi" && "UPI Payment"}
              {step === "success" && "Order Confirmed!"}
            </h2>
            <button onClick={handleClose} className="p-1 hover:bg-secondary rounded-lg">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="p-5">
            {!user && step === "details" && (
              <div className="mb-4 p-3 rounded-xl bg-accent/10 border border-accent/20">
                <p className="font-body text-xs text-foreground">
                  🔒 <button onClick={() => { onClose(); navigate("/auth"); }} className="text-primary font-semibold hover:underline">Sign in</button> to save your order history and track deliveries.
                </p>
              </div>
            )}

            {step === "details" && (
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-card" placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Phone Number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required pattern="[0-9]{10}"
                    className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-card" placeholder="10-digit phone number" />
                </div>

                {/* Delivery Mode */}
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Delivery Option</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setDeliveryMode("delivery")}
                      className={`flex-1 py-2.5 rounded-xl border font-body text-xs font-medium transition-colors ${deliveryMode === "delivery" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                      🚚 Home Delivery
                    </button>
                    <button type="button" onClick={() => setDeliveryMode("pickup")}
                      className={`flex-1 py-2.5 rounded-xl border font-body text-xs font-medium transition-colors ${deliveryMode === "pickup" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                      🏪 Store Pickup
                    </button>
                  </div>
                </div>

                {deliveryMode === "delivery" ? (
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Delivery Address</label>
                    <textarea value={address} onChange={e => setAddress(e.target.value)} required rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-card resize-none" placeholder="Full delivery address with pincode" />
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                    <p className="font-body text-xs text-foreground font-semibold mb-1">📍 Store Address</p>
                    <p className="font-body text-xs text-muted-foreground">Giri Food Productions, Main Road, Your City</p>
                    <p className="font-body text-[10px] text-muted-foreground mt-1">You'll be notified when your order is ready for pickup.</p>
                  </div>
                )}

                {/* Payment Method - show cash option for store pickup */}
                {deliveryMode === "pickup" && (
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Payment Method</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setPaymentMethod("upi")}
                        className={`flex-1 py-2.5 rounded-xl border font-body text-xs font-medium transition-colors ${paymentMethod === "upi" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                        📱 UPI Payment
                      </button>
                      <button type="button" onClick={() => setPaymentMethod("cash")}
                        className={`flex-1 py-2.5 rounded-xl border font-body text-xs font-medium transition-colors ${paymentMethod === "cash" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                        💵 Cash at Store
                      </button>
                    </div>
                  </div>
                )}

                {/* Coupon */}
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">
                    <Tag className="w-3 h-3 inline mr-1" /> Coupon Code
                  </label>
                  {couponApplied ? (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200">
                      <span className="font-body text-xs text-green-700 flex-1">✅ {couponCode.toUpperCase()} applied — ₹{discount} off!</span>
                      <button type="button" onClick={removeCoupon} className="font-body text-[10px] text-destructive hover:underline">Remove</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-border font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-card" placeholder="Enter code" />
                      <button type="button" onClick={handleApplyCoupon}
                        className="px-4 py-2.5 rounded-xl bg-secondary text-foreground font-body text-xs font-semibold hover:bg-secondary/80">Apply</button>
                    </div>
                  )}
                  {couponError && <p className="font-body text-[10px] text-destructive mt-1">{couponError}</p>}
                </div>

                <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                  <h4 className="font-body font-semibold text-xs text-foreground mb-2">Order Summary</h4>
                  {items.map(item => (
                    <div key={item.name} className="flex justify-between font-body text-xs text-muted-foreground py-1">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  {discount > 0 && (
                    <div className="flex justify-between font-body text-xs text-green-600 py-1">
                      <span>Coupon Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-body font-bold text-sm text-foreground mt-2 pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">₹{finalTotal}</span>
                  </div>
                </div>

                <button type="submit" disabled={processing}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/25 disabled:opacity-50">
                  {!user ? "Sign In to Continue →" : processing ? "Placing Order..." : paymentMethod === "cash" ? "Place Order (Pay at Store) →" : "Continue to Payment →"}
                </button>
              </form>
            )}

            {step === "upi" && (
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="text-center mb-4">
                  <p className="font-body text-sm text-muted-foreground">
                    Pay <span className="font-bold text-primary text-lg">₹{finalTotal}</span> via UPI
                  </p>
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Your UPI ID</label>
                  <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-card" placeholder="yourname@upi" />
                  <p className="font-body text-[10px] text-muted-foreground mt-1">e.g., name@paytm, name@gpay, 9876543210@ybl</p>
                </div>
                <button type="submit" disabled={processing}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/25 disabled:opacity-50">
                  {processing ? "Processing Payment..." : `Pay ₹${finalTotal} via UPI`}
                </button>
                <button type="button" onClick={() => setStep("details")}
                  className="w-full py-2 font-body text-xs text-muted-foreground hover:text-foreground transition-colors">← Back to details</button>
              </form>
            )}

            {step === "success" && (
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="font-playfair text-xl font-bold text-foreground mb-2">Thank You!</h3>
                <p className="font-body text-sm text-muted-foreground mb-1">Your order has been placed successfully.</p>
                <p className="font-body text-sm text-muted-foreground mb-6">
                  {deliveryMode === "pickup"
                    ? <>We'll notify you when your order is <span className="font-bold text-foreground">ready for pickup</span>.</>
                    : <>Delivery in <span className="font-bold text-foreground">4-5 working days</span>.</>}
                </p>
                {user && (
                  <button onClick={() => { handleClose(); navigate("/profile"); }}
                    className="px-6 py-2.5 rounded-xl border border-border font-body text-xs font-semibold mb-3 block mx-auto hover:bg-secondary transition-colors">
                    View Order History
                  </button>
                )}
                <button onClick={handleClose}
                  className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all">
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutModal;
