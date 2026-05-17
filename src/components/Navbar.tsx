import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

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
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

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
    <>
      <nav className={`navbar fixed top-0 left-0 w-full z-[9999] ${scrolled ? "scrolled" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-lg">🌿</span>
              <span className="font-playfair font-bold text-sm tracking-wide text-foreground">
                Giri Food Productions
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`nav-link-underline font-body font-medium text-xs tracking-widest uppercase transition-colors text-muted-foreground hover:text-foreground ${
                    location.pathname === link.href ? "!text-primary" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/products"
                className="hidden sm:inline-flex items-center px-5 py-2 rounded-full bg-primary text-primary-foreground font-body font-medium text-xs tracking-wide hover:brightness-110 transition-all shadow-md shadow-primary/20"
              >
                View Products
              </Link>

              <button
                className={`hamburger md:hidden text-foreground ${menuOpen ? "active" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>

        <div className={`mobile-menu md:hidden bg-background ${menuOpen ? "open" : ""}`}>
          <div className="px-6 py-4 space-y-1 border-t border-border">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => handleNavClick(link.href)}
                className="block font-body font-medium text-sm py-2 text-muted-foreground hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
