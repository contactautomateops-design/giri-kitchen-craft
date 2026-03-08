import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".hero-badge", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }, 0.2)
        .fromTo(".hero-line-1", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }, 0.5)
        .fromTo(".hero-line-2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }, 0.7)
        .fromTo(".hero-line-3", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }, 0.9)
        .fromTo(".hero-sub", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }, 1.1)
        .fromTo(".hero-ctas", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }, 1.3)
        .fromTo(".hero-trust", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }, 1.5)
        .fromTo(".hero-right", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.8 }, 0.8);
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Create spice particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 4,
    left: Math.random() * 100,
    top: Math.random() * 100,
    color: ["#E87000", "#F5C518", "#C4874A", "#5C2A0A"][Math.floor(Math.random() * 4)],
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 5,
  }));

  const orbitIcons = ["🌱", "🥜", "🌻", "🥥"];

  return (
    <section ref={heroRef} className="hero-gradient relative min-h-screen flex items-center overflow-hidden">
      {/* Grain overlay */}
      <div className="hero-grain absolute inset-0 z-[1]" />

      {/* Decorative blurred circles */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-giri-primary/20 blur-[80px] animate-[floatBob_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-giri-secondary/15 blur-[80px] animate-[floatBob_8s_ease-in-out_infinite_2s]" />
      <div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] rounded-full bg-giri-light-brown/10 blur-[80px]" />

      {/* Spice Particles */}
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
            opacity: 0.5,
          } as React.CSSProperties}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-[55%_45%] items-center gap-8 py-20 pt-28">
        {/* Left */}
        <div>
          <div className="hero-badge opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-giri-primary/20 border border-giri-primary/30 mb-6">
            <span className="text-sm">🌿</span>
            <span className="text-sm font-nunito font-semibold text-giri-secondary">100% Natural & Pure</span>
          </div>

          <h1 className="hero-line-1 opacity-0 font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-white italic leading-tight">
            Pure Oils.
          </h1>
          <h1 className="hero-line-2 opacity-0 font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-giri-secondary leading-tight mt-2">
            Honest Spices.
          </h1>
          <h1 className="hero-line-3 opacity-0 font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-white italic leading-tight mt-2">
            Real Flavour.
          </h1>

          <p className="hero-sub opacity-0 font-nunito text-lg text-white/75 mt-6 max-w-lg leading-relaxed">
            Farm-fresh cooking essentials cold-pressed and stone-ground — straight from Giri Food Productions to your kitchen.
          </p>

          <div className="hero-ctas opacity-0 flex flex-wrap gap-4 mt-8">
            <Link
              to="/products"
              className="magnetic-btn inline-flex items-center px-7 py-3.5 rounded-full bg-giri-primary text-white font-nunito font-bold text-base shadow-lg hover:bg-orange-600 hover:scale-105 transition-all"
            >
              Shop Now →
            </Link>
            <Link
              to="/about"
              className="magnetic-btn inline-flex items-center px-7 py-3.5 rounded-full border-2 border-white text-white font-nunito font-bold text-base hover:bg-white hover:text-giri-dark transition-all"
            >
              Our Story
            </Link>
          </div>

          <div className="hero-trust opacity-0 flex flex-wrap items-center gap-4 mt-8 text-sm text-white/60 font-nunito">
            <span>✅ No Preservatives</span>
            <span className="hidden sm:inline">|</span>
            <span>🧪 Lab Tested</span>
            <span className="hidden sm:inline">|</span>
            <span>🚚 Pan India Delivery</span>
          </div>
        </div>

        {/* Right */}
        <div className="hero-right opacity-0 hidden lg:flex items-center justify-center relative">
          <div className="w-72 h-72 xl:w-80 xl:h-80 rounded-full bg-gradient-to-br from-giri-primary to-giri-dark flex items-center justify-center relative">
            <div className="animate-float-bob text-[100px] leading-none select-none">
              🫙
            </div>
            <span className="absolute top-[-10px] text-4xl animate-float-bob" style={{ animationDelay: "0.5s" }}>🌶️</span>
            <span className="absolute bottom-[-10px] text-3xl animate-float-bob" style={{ animationDelay: "1s" }}>🌿</span>

            {/* Orbiting icons */}
            {orbitIcons.map((icon, i) => (
              <span
                key={i}
                className="absolute text-2xl"
                style={{
                  animation: `orbit 8s linear infinite`,
                  animationDelay: `${i * -2}s`,
                  top: "50%",
                  left: "50%",
                  marginTop: "-14px",
                  marginLeft: "-14px",
                }}
              >
                {icon}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/50 animate-bounce-arrow">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
    </section>
  );
};

export default Hero;
