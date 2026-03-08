import { useEffect, useRef, useState } from "react";

const stats = [
  { target: 5000, suffix: "+", label: "Happy Customers" },
  { target: 6, suffix: "", label: "Pure Products" },
  { target: 100, suffix: "%", label: "Natural Ingredients" },
  { target: 3, suffix: "+", label: "Years of Trust" },
];

const AboutSection = () => {
  const [counts, setCounts] = useState(stats.map(() => 0));
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
          stats.forEach((stat, i) => {
            const duration = 2000;
            const start = performance.now();
            const animate = (now: number) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setCounts(prev => {
                const next = [...prev];
                next[i] = Math.round(eased * stat.target);
                return next;
              });
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          });
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [triggered]);

  return (
    <section id="about" className="py-24 about-stripes bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" data-aos="fade-up">
          <div>
            <img
              src="/images/hero-banner.jpg"
              alt="Giri Food Productions - Pure oils and spices"
              className="rounded-2xl shadow-lg w-full h-72 object-cover"
            />
          </div>
          <div>
            <span className="inline-block px-3 py-1.5 rounded-full bg-primary/10 text-primary font-body font-semibold text-xs tracking-widest uppercase mb-4">
              Our Story
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-foreground mb-6">
              We Cook With Honesty
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
              At Giri Food Productions, we believe that great cooking begins with pure ingredients. Born from a simple idea — that families deserve food products free from chemicals and shortcuts — we've built our brand on trust, tradition, and transparency.
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Our oils are cold-pressed to retain every drop of natural goodness, and our spices are stone-ground for that authentic aroma your grandmother always knew.
            </p>
          </div>
        </div>
      </div>

      <div ref={ref} className="max-w-4xl mx-auto px-6 mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-card rounded-xl p-5 text-center border border-border shadow-sm"
            data-aos="fade-up"
            data-aos-delay={i * 100}
          >
            <div className="font-playfair text-2xl font-bold text-primary">
              {counts[i]}{stat.suffix}
            </div>
            <div className="font-body text-[10px] text-muted-foreground mt-2 tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
