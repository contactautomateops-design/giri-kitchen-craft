import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".hero-badge", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, 0.2)
        .fromTo(".hero-line-1", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, 0.4)
        .fromTo(".hero-line-2", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, 0.6)
        .fromTo(".hero-line-3", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, 0.8)
        .fromTo(".hero-sub", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, 1.0)
        .fromTo(".hero-ctas", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, 1.2)
        .fromTo(".hero-trust", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 1.4)
        .fromTo(".hero-right", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8 }, 0.6);
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    color: ["#e5e5e5", "#d4d4d4", "#a3a3a3"][Math.floor(Math.random() * 3)],
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 5,
  }));

  return (
    <section ref={heroRef} className="hero-gradient relative min-h-screen flex items-center overflow-hidden border-b border-border">
      {/* Subtle particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="spice-particle hidden md:block"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            backgroundColor: p.color,
            "--duration": `${p.duration}s`,
            "--delay": `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-[55%_45%] items-center gap-12 py-20 pt-28">
        <div>
          <div className="hero-badge opacity-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border mb-8">
            <span className="text-xs">🌿</span>
            <span className="text-xs font-body font-medium text-muted-foreground tracking-wide">100% Natural & Pure</span>
          </div>

          <h1 className="hero-line-1 opacity-0 font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1]">
            Pure Oils.
          </h1>
          <h1 className="hero-line-2 opacity-0 font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-muted-foreground leading-[1.1] mt-1">
            Honest Spices.
          </h1>
          <h1 className="hero-line-3 opacity-0 font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground italic leading-[1.1] mt-1">
            Real Flavour.
          </h1>

          <p className="hero-sub opacity-0 font-body text-base text-muted-foreground mt-8 max-w-md leading-relaxed">
            Farm-fresh cooking essentials cold-pressed and stone-ground — straight from Giri Food Productions to your kitchen.
          </p>

          <div className="hero-ctas opacity-0 flex flex-wrap gap-3 mt-8">
            <Link
              to="/products"
              className="inline-flex items-center px-7 py-3 rounded-full bg-foreground text-background font-body font-semibold text-sm hover:bg-foreground/90 transition-all"
            >
              Shop Now →
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center px-7 py-3 rounded-full border border-border text-foreground font-body font-semibold text-sm hover:bg-secondary transition-all"
            >
              Our Story
            </Link>
          </div>

          <div className="hero-trust opacity-0 flex flex-wrap items-center gap-4 mt-10 text-xs text-muted-foreground font-body tracking-wide">
            <span>✅ No Preservatives</span>
            <span className="text-border">·</span>
            <span>🧪 Lab Tested</span>
            <span className="text-border">·</span>
            <span>🚚 Pan India Delivery</span>
          </div>
        </div>

        {/* Right side */}
        <div className="hero-right opacity-0 hidden lg:flex items-center justify-center relative">
          <div className="w-72 h-72 xl:w-80 xl:h-80 rounded-full bg-secondary flex items-center justify-center relative border border-border">
            <div className="animate-float-bob text-[80px] leading-none select-none">🫙</div>
            <span className="absolute top-[-10px] text-3xl animate-float-bob" style={{ animationDelay: "0.5s" }}>🌶️</span>
            <span className="absolute bottom-[-10px] text-2xl animate-float-bob" style={{ animationDelay: "1s" }}>🌿</span>

            {["🌱", "🥜", "🌻", "🥥"].map((icon, i) => (
              <span
                key={i}
                className="absolute text-xl"
                style={{
                  animation: `orbit 10s linear infinite`,
                  animationDelay: `${i * -2.5}s`,
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              >
                {icon}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-muted-foreground/40 animate-bounce-arrow">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
      </div>
    </section>
  );
};

export default Hero;
