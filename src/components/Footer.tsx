import { Link } from "react-router-dom";
import { products } from "@/data/products";

const Footer = () => (
  <footer className="bg-foreground pt-16 pb-8">
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🌿</span>
          <span className="font-playfair font-bold text-sm text-background">Giri Food Productions</span>
        </div>
        <p className="font-body text-background/40 text-xs leading-relaxed mb-4">
          Pure from the Earth, Straight to Your Table. Bringing authentic, chemical-free food products to every Indian kitchen.
        </p>
        <div className="flex gap-3">
          {["📘", "📷", "💬"].map((icon, i) => (
            <span key={i} className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center text-sm cursor-pointer hover:bg-background/20 transition-all">{icon}</span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-body font-semibold text-background text-xs tracking-widest uppercase mb-4">Quick Links</h4>
        <ul className="space-y-2">
          {["Home", "Products", "About", "Why Us", "Contact"].map(link => (
            <li key={link}>
              <Link
                to={link === "Home" ? "/" : link === "Products" ? "/products" : link === "About" ? "/about" : `/#${link.toLowerCase().replace(" ", "-")}`}
                className="font-body text-background/40 text-xs hover:text-background transition-colors"
              >
                {link}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-body font-semibold text-background text-xs tracking-widest uppercase mb-4">Our Products</h4>
        <ul className="space-y-2">
          {products.map(p => (
            <li key={p.id}>
              <Link to="/products" className="font-body text-background/40 text-xs hover:text-background transition-colors">
                {p.emoji} {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="border-t border-background/10 pt-6 text-center">
      <p className="font-body text-background/30 text-[11px] tracking-wide">
        © 2025 Giri Food Productions. All Rights Reserved. | Made with ❤️ in India
      </p>
    </div>
  </footer>
);

export default Footer;
