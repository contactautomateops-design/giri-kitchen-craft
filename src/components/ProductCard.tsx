interface Product {
  id: number; name: string; weight: string; price: number; mrp: number;
  emoji: string; accent: string; badge: string; category: string; image: string;
}

const ProductCard = ({ product, delay }: { product: Product; delay: number }) => {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-card border border-border group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10`}
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      {/* Product Image */}
      <div className="relative h-52 overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105`}
          loading="lazy"
        />
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-primary-foreground text-[10px] font-body font-bold tracking-wider uppercase" style={{ backgroundColor: product.accent }}>
          {product.badge}
        </div>
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

        <div className="mt-4 p-3 bg-secondary rounded-lg">
          <p className="font-body text-xs text-muted-foreground text-center">
            Premium quality • Organic • Pure
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
