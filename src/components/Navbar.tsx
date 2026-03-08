import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Why Us", href: "/#why-us" },
  { label: "Contact", href: "/#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleNavClick = (href: string) => {
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar fixed top-0 left-0 w-full z-[9999] ${scrolled ? "scrolled" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className={`font-playfair font-bold text-lg md:text-xl ${scrolled ? "text-giri-primary" : "text-white"}`}>
              Giri Food Productions
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`nav-link-underline font-nunito font-semibold text-sm tracking-wide transition-colors ${
                  scrolled ? "text-giri-text-dark hover:text-giri-primary" : "text-white/90 hover:text-white"
                } ${location.pathname === link.href ? "!text-giri-primary" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="relative p-2">
              <ShoppingCart className={`w-5 h-5 ${scrolled ? "text-giri-text-dark" : "text-white"}`} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-giri-primary text-white text-xs flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </button>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center px-5 py-2 rounded-full bg-giri-primary text-white font-nunito font-bold text-sm shadow-lg hover:bg-orange-600 transition-all hover:scale-105"
            >
              Order Now
            </Link>

            {/* Hamburger */}
            <button
              className={`hamburger md:hidden ${menuOpen ? "active" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={scrolled ? "" : "!bg-white"}></span>
              <span className={scrolled ? "" : "!bg-white"}></span>
              <span className={scrolled ? "" : "!bg-white"}></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu md:hidden ${menuOpen ? "open" : ""} ${scrolled ? "bg-giri-bg" : "bg-giri-dark/95 backdrop-blur-lg"}`}>
        <div className="px-4 py-4 space-y-3">
          {navLinks.map(link => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`block font-nunito font-semibold text-base py-2 ${
                scrolled ? "text-giri-text-dark" : "text-white"
              } ${location.pathname === link.href ? "!text-giri-primary" : ""}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/products"
            className="block text-center px-5 py-3 rounded-full bg-giri-primary text-white font-nunito font-bold text-sm"
          >
            Order Now
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
