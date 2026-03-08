import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const filters = [
  { label: "All", value: "all" },
  { label: "Oils", value: "oils" },
  { label: "Spices", value: "spices" },
];

const Products = () => {
  const [active, setActive] = useState("all");

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 80, easing: "ease-out-cubic" });
    window.scrollTo(0, 0);
  }, []);

  const filtered = active === "all" ? products : products.filter(p => p.category === active);

  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12" data-aos="fade-up">
          <span className="inline-block px-3 py-1 rounded-full border border-border text-muted-foreground font-body font-medium text-xs tracking-widest uppercase mb-4">
            Our Products
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-foreground">
            Pure. Natural. Delicious.
          </h1>
          <p className="font-body text-sm text-muted-foreground mt-3">
            Every product crafted without shortcuts or compromise.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-12" data-aos="fade-up" data-aos-delay="100">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={`px-5 py-2 rounded-full font-body font-medium text-xs tracking-wide transition-all ${
                active === f.value
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} delay={i * 80} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
