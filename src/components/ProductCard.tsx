import { useState, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import Toast from "./Toast";

interface Product {
  id: number; name: string; weight: string; price: number; mrp: number;
  emoji: string; accent: string; badge: string; category: string;
}

const ProductCard = ({ product, delay }: { product: Product; delay: number }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleAdd = useCallback(() => {
    addToCart(product.name, product.price);
    setAdded(true);
    setShowToast(true);
    setTimeout(() => setAdded(false), 1200);
    setTimeout(() => setShowToast(false), 3000);
  }, [addToCart, product]);

  return (
    <>
      <div
        className="relative rounded-xl overflow-hidden bg-background border border-border group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
        data-aos="fade-up"
        data-aos-delay={delay}
      >
        <div className="p-6 flex flex-col items-center text-center">
          <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-[10px] font-body font-semibold tracking-wider uppercase">
            {product.badge}
          </div>

          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
            <span className="text-4xl">{product.emoji}</span>
          </div>

          <h3 className="font-playfair text-lg font-bold text-foreground">{product.name}</h3>
          <p className="font-body text-xs text-muted-foreground mt-1">{product.weight}</p>

          <div className="flex items-center gap-1 mt-3">
            <span className="text-xs">⭐⭐⭐⭐⭐</span>
            <span className="font-body text-[10px] text-muted-foreground">4.5 (128)</span>
          </div>

          <div className="mt-4">
            <span className="font-body text-[10px] text-muted-foreground line-through">MRP ₹{product.mrp}</span>
            <div className="font-body text-xl font-bold text-foreground">₹{product.price}</div>
          </div>

          <button
            onClick={handleAdd}
            className={`w-full mt-5 py-2.5 rounded-lg font-body font-semibold text-xs tracking-wide transition-all ${
              added
                ? "bg-foreground/10 text-foreground"
                : "bg-foreground text-background hover:bg-foreground/90"
            }`}
          >
            {added ? "✓ Added!" : "Add to Cart"}
          </button>
        </div>
      </div>

      {showToast && <Toast message={`${product.name} added to cart!`} onClose={() => setShowToast(false)} />}
    </>
  );
};

export default ProductCard;
