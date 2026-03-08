import { Link } from "react-router-dom";
import { products } from "@/data/products";

const Footer = () => (
  <footer className="bg-giri-dark pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
      {/* Col 1 */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🌿</span>
          <span className="font-playfair font-bold text-xl text-white">Giri Food Productions</span>
        </div>
        <p className="font-nunito text-white/50 text-sm leading-relaxed mb-4">
          Pure from the Earth, Straight to Your Table. Bringing authentic, chemical-free food products to every Indian kitchen.
        </p>
        <div className="flex gap-4">
          {["📘", "📷", "💬"].map((icon, i) => (
            <span key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg cursor-pointer hover:bg-giri-secondary/30 transition-all">
              {icon}
            </span>
          ))}
        </div>
      </div>

      {/* Col 2 */}
      <div>
        <h4 className="font-nunito font-bold text-white mb-4">Quick Links</h4>
        <ul className="space-y-2">
          {["Home", "Products", "About", "Why Us", "Contact"].map(link => (
            <li key={link}>
              <Link
                to={link === "Home" ? "/" : link === "Products" ? "/products" : link === "About" ? "/about" : `/#${link.toLowerCase().replace(" ", "-")}`}
                className="font-nunito text-white/50 text-sm hover:text-giri-secondary transition-colors nav-link-underline"
              >
                {link}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Col 3 */}
      <div>
        <h4 className="font-nunito font-bold text-white mb-4">Our Products</h4>
        <ul className="space-y-2">
          {products.map(p => (
            <li key={p.id}>
              <Link to="/products" className="font-nunito text-white/50 text-sm hover:text-giri-secondary transition-colors">
                {p.emoji} {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="border-t border-white/10 pt-6 text-center">
      <p className="font-nunito text-white/40 text-sm">
        © 2025 Giri Food Productions. All Rights Reserved. | Made with ❤️ in India
      </p>
    </div>
  </footer>
);

export default Footer;
