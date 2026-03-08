import { products } from "@/data/products";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { useInventory } from "@/hooks/useInventory";

const ProductsSection = () => {
  const { getStock } = useInventory();

  return (
    <section id="products" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="inline-block px-3 py-1.5 rounded-full bg-primary/10 text-primary font-body font-semibold text-xs tracking-widest uppercase mb-4">
            Our Products
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-foreground">
            Pure. Natural. Delicious.
          </h2>
          <p className="font-body text-muted-foreground mt-3 text-sm max-w-md mx-auto">
            Every product crafted without shortcuts or compromise.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} delay={i * 80} stock={getStock(product.name)} />
          ))}
        </div>

        <div className="text-center mt-14" data-aos="fade-up">
          <Link
            to="/products"
            className="inline-flex items-center px-7 py-3 rounded-full bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/25"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
