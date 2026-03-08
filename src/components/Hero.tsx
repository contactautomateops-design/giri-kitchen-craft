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
        .fromTo(".hero-right", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1 }, 0.4);
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 5 + 3,
    left: Math.random() * 100,
    top: Math.random() * 100,
    color: ["hsl(28, 90%, 50%)", "hsl(42, 85%, 55%)", "hsl(20, 40%, 60%)"][Math.floor(Math.random() * 3)],
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 5,
  }));

  return (
    <section ref={heroRef} className="hero-gradient relative min-h-screen flex items-center overflow-hidden">
      {/* Warm decorative blurs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-accent/10 blur-[80px] pointer-events-none" />

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
          <div className="hero-badge opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="text-xs">🌿</span>
            <span className="text-xs font-body font-semibold text-primary tracking-wide">100% Natural & Pure</span>
          </div>

          <h1 className="hero-line-1 opacity-0 font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1]">
            Pure Oils.
          </h1>
          <h1 className="hero-line-2 opacity-0 font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-accent leading-[1.1] mt-1">
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
              className="inline-flex items-center px-7 py-3 rounded-full bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/25"
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
            <span className="text-primary/30">·</span>
            <span>🧪 Lab Tested</span>
            <span className="text-primary/30">·</span>
            <span>🚚 Pan India Delivery</span>
          </div>
        </div>

        {/* Right side - Hero Image */}
        <div className="hero-right opacity-0 hidden lg:flex items-center justify-center relative">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-2xl transform rotate-3" />
            <img
              src="/images/hero-banner.jpg"
              alt="Premium cold-pressed oils and stone-ground spices"
              className="relative rounded-3xl shadow-2xl shadow-primary/15 w-full h-auto object-cover"
            />
            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-background rounded-2xl shadow-lg p-3 border border-border animate-float-bob">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌿</span>
                <div>
                  <div className="font-body font-bold text-xs text-foreground">100%</div>
                  <div className="font-body text-[10px] text-muted-foreground">Natural</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-background rounded-2xl shadow-lg p-3 border border-border animate-float-bob" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <div>
                  <div className="font-body font-bold text-xs text-foreground">5000+</div>
                  <div className="font-body text-[10px] text-muted-foreground">Happy Families</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-primary/40 animate-bounce-arrow">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
      </div>
    </section>
  );
};

export default Hero;
