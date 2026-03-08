import { useState, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import Toast from "./Toast";

interface Product {
  id: number;
  name: string;
  weight: string;
  price: number;
  mrp: number;
  emoji: string;
  accent: string;
  badge: string;
  category: string;
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
        className="relative rounded-2xl overflow-hidden bg-giri-card-bg group transition-all duration-400 hover:-translate-y-2.5 hover:shadow-[0_20px_60px_rgba(59,31,10,0.15)]"
        style={{ borderTop: `6px solid ${product.accent}` }}
        data-aos="fade-up"
        data-aos-delay={delay}
      >
        {/* Badge */}
        <div
          className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-white text-xs font-nunito font-bold"
          style={{ backgroundColor: product.accent }}
        >
          {product.badge}
        </div>

        <div className="p-6 pt-8 flex flex-col items-center text-center">
          {/* Emoji circle */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: `${product.accent}15` }}
          >
            <span className="text-5xl">{product.emoji}</span>
          </div>

          <h3 className="font-playfair text-xl font-bold text-giri-text-dark">{product.name}</h3>
          <p className="font-nunito text-sm text-giri-text-light mt-1">{product.weight}</p>

          {/* Stars */}
          <div className="flex items-center gap-1 mt-3">
            <span className="text-sm">⭐⭐⭐⭐⭐</span>
            <span className="font-nunito text-xs text-giri-text-light">4.5 (128 reviews)</span>
          </div>

          {/* Price */}
          <div className="mt-4">
            <span className="font-nunito text-xs text-giri-text-light line-through">MRP ₹{product.mrp}</span>
            <div className="font-nunito text-2xl font-bold text-giri-primary">₹{product.price}</div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAdd}
            className="w-full mt-5 py-3 rounded-xl font-nunito font-bold text-sm text-white transition-all hover:scale-[1.02]"
            style={{ backgroundColor: added ? "#2D5A27" : product.accent }}
          >
            {added ? "✓ Added!" : "🛒 Add to Cart"}
          </button>
        </div>
      </div>

      {showToast && <Toast message={`${product.name} added to cart!`} onClose={() => setShowToast(false)} />}
    </>
  );
};

export default ProductCard;
