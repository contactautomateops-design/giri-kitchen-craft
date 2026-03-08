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
    <section id="about" className="py-20 about-stripes bg-giri-bg">
      <div className="max-w-3xl mx-auto px-4 text-center" data-aos="fade-up">
        <span className="inline-block px-4 py-1.5 rounded-full bg-giri-primary/10 text-giri-primary font-nunito font-bold text-sm mb-4">
          Our Story
        </span>
        <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-giri-text-dark mb-6">
          We Cook With Honesty
        </h2>
        <p className="font-nunito text-giri-text-light leading-relaxed mb-4">
          At Giri Food Productions, we believe that great cooking begins with pure ingredients. Born from a simple idea — that families deserve food products free from chemicals and shortcuts — we've built our brand on trust, tradition, and transparency.
        </p>
        <p className="font-nunito text-giri-text-light leading-relaxed">
          Our oils are cold-pressed to retain every drop of natural goodness, and our spices are stone-ground for that authentic aroma your grandmother always knew. From our farm partners to your kitchen shelf, every product carries our promise: pure, honest, and always fresh.
        </p>
      </div>

      <div ref={ref} className="max-w-4xl mx-auto px-4 mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-5 text-center border-b-4 border-giri-primary/40 shadow-sm"
            data-aos="fade-up"
            data-aos-delay={i * 100}
          >
            <div className="font-playfair text-3xl font-bold text-giri-primary">
              {counts[i]}{stat.suffix}
            </div>
            <div className="font-nunito text-xs text-giri-text-light mt-2">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
