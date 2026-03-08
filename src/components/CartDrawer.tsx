import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { X, Plus, Minus, ShoppingBag, LogIn } from "lucide-react";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartDrawer = ({ open, onClose, onCheckout }: CartDrawerProps) => {
  const { items, count, addToCart, removeFromCart, updateQuantity, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[10000]" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-[10001] flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-playfair text-lg font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> Your Cart ({count})
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="font-body text-sm text-muted-foreground">Your cart is empty</p>
              <button onClick={onClose} className="mt-4 px-6 py-2 rounded-full bg-primary text-primary-foreground font-body text-xs font-semibold">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.name} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex-1">
                    <h4 className="font-body font-semibold text-sm text-foreground">{item.name}</h4>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">₹{item.price} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.name, item.quantity - 1)}
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-body font-bold text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item.name, item.price)}
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-right min-w-[60px]">
                    <span className="font-body font-bold text-sm text-foreground">₹{item.price * item.quantity}</span>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.name)}
                    className="p-1 hover:bg-destructive/10 rounded transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-border space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-body font-semibold text-sm text-foreground">Total</span>
              <span className="font-playfair font-bold text-xl text-primary">₹{total}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/25"
            >
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
