import { useState, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import Toast from "./Toast";

interface Product {
  id: number; name: string; weight: string; price: number; mrp: number;
  emoji: string; accent: string; badge: string; category: string; image: string;
}

const ProductCard = ({ product, delay, stock }: { product: Product; delay: number; stock?: number }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const outOfStock = stock !== undefined && stock <= 0;

  const handleAdd = useCallback(() => {
    if (outOfStock) return;
    addToCart(product.name, product.price);
    setAdded(true);
    setShowToast(true);
    setTimeout(() => setAdded(false), 1200);
    setTimeout(() => setShowToast(false), 3000);
  }, [addToCart, product, outOfStock]);

  return (
    <>
      <div
        className={`relative rounded-2xl overflow-hidden bg-card border border-border group transition-all duration-300 ${outOfStock ? "opacity-70" : "hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10"}`}
        data-aos="fade-up"
        data-aos-delay={delay}
      >
        {/* Product Image */}
        <div className="relative h-52 overflow-hidden bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${outOfStock ? "grayscale" : "group-hover:scale-105"}`}
            loading="lazy"
          />
          {outOfStock ? (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-body font-bold tracking-wider uppercase">
              OUT OF STOCK
            </div>
          ) : (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-primary-foreground text-[10px] font-body font-bold tracking-wider uppercase" style={{ backgroundColor: product.accent }}>
              {product.badge}
            </div>
          )}
          {!outOfStock && stock !== undefined && stock <= 10 && stock > 0 && (
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-[10px] font-body font-bold">
              Only {stock} left!
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-playfair text-lg font-bold text-foreground">{product.name}</h3>
          <p className="font-body text-xs text-muted-foreground mt-1">{product.weight}</p>

          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs">⭐⭐⭐⭐⭐</span>
            <span className="font-body text-[10px] text-muted-foreground">4.5 (128)</span>
          </div>

          <div className="mt-3 flex items-end gap-2">
            <span className="font-body text-2xl font-bold text-primary">₹{product.price}</span>
            <span className="font-body text-xs text-muted-foreground line-through mb-1">MRP ₹{product.mrp}</span>
          </div>

          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className={`w-full mt-4 py-2.5 rounded-xl font-body font-semibold text-xs tracking-wide transition-all ${
              outOfStock
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : added
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-primary text-primary-foreground hover:brightness-110 shadow-md shadow-primary/20"
            }`}
          >
            {outOfStock ? "Out of Stock" : added ? "✓ Added!" : "Add to Cart"}
          </button>
        </div>
      </div>

      {showToast && <Toast message={`${product.name} added to cart!`} onClose={() => setShowToast(false)} />}
    </>
  );
};

export default ProductCard;
