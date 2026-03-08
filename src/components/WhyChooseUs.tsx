import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: "🌿", title: "Cold-Press Technology", desc: "Oils extracted without heat preserving natural nutrients and authentic aroma" },
  { icon: "🔬", title: "Lab Quality Tested", desc: "Every single batch independently tested for purity and safety before dispatch" },
  { icon: "🌾", title: "Farm Direct Sourcing", desc: "Partnered directly with Indian farmers for the freshest raw ingredients" },
  { icon: "💰", title: "Honest Pricing Always", desc: "Premium quality at prices every Indian household can genuinely afford" },
];

const WhyChooseUs = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".why-left", { x: -60, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
      gsap.fromTo(".why-right", { x: 60, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="why-us" className="py-24 bg-secondary/50">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="why-left">
          <span className="inline-block px-3 py-1.5 rounded-full bg-primary/10 text-primary font-body font-semibold text-xs tracking-widest uppercase mb-4">
            Why Choose Us
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-foreground mb-10">
            Why Families Trust Giri Food Productions
          </h2>

          <div className="space-y-8">
            {features.map((f, i) => (
              <div key={i} className="flex gap-4 items-start border-l-2 border-primary/30 pl-6">
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-body font-semibold text-foreground text-sm">{f.title}</h4>
                  <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="why-right space-y-6">
          {/* Large image card */}
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="/images/hero-spices.jpg"
              alt="Fresh Indian spices and ingredients"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent flex items-end p-8">
              <div className="text-center w-full">
                <p className="font-playfair text-xl italic text-primary-foreground leading-relaxed">
                  "Pure from the Earth, Straight to Your Table."
                </p>
                <p className="font-body text-xs text-primary-foreground/50 mt-3 tracking-wide">— Giri Food Productions</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { num: "5000+", label: "Happy Customers" },
              { num: "6", label: "Pure Products" },
              { num: "100%", label: "Natural" },
            ].map((s, i) => (
              <div key={i} className="bg-background rounded-xl p-4 text-center border border-border shadow-sm">
                <div className="font-playfair text-xl font-bold text-primary">{s.num}</div>
                <div className="font-body text-[10px] text-muted-foreground mt-1 tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
