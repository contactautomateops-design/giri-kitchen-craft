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
    <div className="pt-24 pb-20 bg-giri-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10" data-aos="fade-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-giri-primary/10 text-giri-primary font-nunito font-bold text-sm mb-4">
            Our Products
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-giri-text-dark">
            Pure. Natural. Delicious.
          </h1>
          <p className="font-nunito text-giri-text-light mt-3 text-lg">
            Every product crafted without shortcuts or compromise.
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-3 mb-10" data-aos="fade-up" data-aos-delay="100">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={`px-6 py-2.5 rounded-full font-nunito font-bold text-sm transition-all ${
                active === f.value
                  ? "bg-giri-primary text-white shadow-lg"
                  : "bg-white text-giri-text-dark hover:bg-giri-primary/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, i) => (
            <div key={product.id} className="transition-all duration-400" style={{ opacity: 1 }}>
              <ProductCard product={product} delay={i * 100} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
