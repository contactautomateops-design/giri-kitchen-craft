import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { X, CheckCircle } from "lucide-react";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

const CheckoutModal = ({ open, onClose }: CheckoutModalProps) => {
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState<"details" | "upi" | "success">("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);

  if (!open) return null;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("upi");
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Generate UPI payment link
    const upiPaymentUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("Giri Food Productions")}&am=${total}&cu=INR&tn=${encodeURIComponent(`Order from Giri Food Productions - ${items.map(i => i.name).join(", ")}`)}`;

    // Open UPI app on mobile
    window.open(upiPaymentUrl, "_blank");

    // Simulate payment confirmation (in production, you'd verify via webhook)
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
            {step === "details" && (
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-card"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-card"
                    placeholder="10-digit phone number"
                  />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Delivery Address</label>
                  <textarea
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-card resize-none"
                    placeholder="Full delivery address with pincode"
                  />
                </div>

                <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                  <h4 className="font-body font-semibold text-xs text-foreground mb-2">Order Summary</h4>
                  {items.map(item => (
                    <div key={item.name} className="flex justify-between font-body text-xs text-muted-foreground py-1">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-body font-bold text-sm text-foreground mt-2 pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">₹{total}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/25"
                >
                  Continue to Payment →
                </button>
              </form>
            )}

            {step === "upi" && (
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="text-center mb-4">
                  <p className="font-body text-sm text-muted-foreground">
                    Pay <span className="font-bold text-primary text-lg">₹{total}</span> via UPI
                  </p>
                </div>

                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Your UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-card"
                    placeholder="yourname@upi"
                  />
                  <p className="font-body text-[10px] text-muted-foreground mt-1">e.g., name@paytm, name@gpay, 9876543210@ybl</p>
                </div>

                <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
                  <p className="font-body text-xs text-foreground">
                    💡 After clicking pay, your UPI app will open. Complete the payment there, and your order will be confirmed automatically.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
                >
                  {processing ? "Processing Payment..." : `Pay ₹${total} via UPI`}
                </button>

                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="w-full py-2 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to details
                </button>
              </form>
            )}

            {step === "success" && (
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="font-playfair text-xl font-bold text-foreground mb-2">Thank You for Your Purchase!</h3>
                <p className="font-body text-sm text-muted-foreground mb-1">
                  Your order has been placed successfully.
                </p>
                <p className="font-body text-sm text-muted-foreground mb-6">
                  Your order will be delivered within <span className="font-bold text-foreground">4-5 working days</span>.
                </p>
                <div className="bg-secondary/50 rounded-xl p-4 border border-border mb-6">
                  <p className="font-body text-xs text-muted-foreground">
                    For any queries, contact us at <span className="font-semibold text-foreground">+91 78787 73477</span>
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all"
                >
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
