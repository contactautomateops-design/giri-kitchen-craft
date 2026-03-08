import { useState } from "react";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

const ProductsSection = () => {
  return (
    <section id="products" className="py-20 bg-giri-bg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14" data-aos="fade-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-giri-primary/10 text-giri-primary font-nunito font-bold text-sm mb-4">
            Our Products
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-giri-text-dark">
            Pure. Natural. Delicious.
          </h2>
          <p className="font-nunito text-giri-text-light mt-3 text-lg max-w-md mx-auto">
            Every product crafted without shortcuts or compromise.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} delay={i * 100} />
          ))}
        </div>

        <div className="text-center mt-12" data-aos="fade-up">
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-3.5 rounded-full bg-giri-primary text-white font-nunito font-bold shadow-lg hover:bg-orange-600 hover:scale-105 transition-all"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
