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
      gsap.fromTo(".why-left", { x: -80, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
      gsap.fromTo(".why-right", { x: 80, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="why-us" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* Left */}
        <div className="why-left">
          <span className="inline-block px-4 py-1.5 rounded-full bg-giri-primary/10 text-giri-primary font-nunito font-bold text-sm mb-4">
            Why Choose Us
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-giri-text-dark mb-8">
            Why Families Trust Giri Food Productions
          </h2>

          <div className="space-y-6">
            {features.map((f, i) => (
              <div key={i} className="flex gap-4 items-start border-l-4 border-giri-primary/30 pl-5">
                <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-giri-primary/10 flex items-center justify-center text-2xl">
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-nunito font-bold text-giri-text-dark text-base">{f.title}</h4>
                  <p className="font-nunito text-sm text-giri-text-light mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="why-right space-y-6">
          <div className="bg-giri-dark rounded-2xl p-8 border-2 border-dashed border-giri-primary/50 text-center">
            <p className="font-playfair text-2xl italic text-white leading-relaxed">
              "Pure from the Earth, Straight to Your Table."
            </p>
            <p className="font-nunito text-sm text-white/60 mt-4">— Giri Food Productions</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { num: "5000+", label: "Happy Customers" },
              { num: "6", label: "Pure Products" },
              { num: "100%", label: "Natural" },
            ].map((s, i) => (
              <div key={i} className="bg-giri-card-bg rounded-xl p-4 text-center border border-giri-primary/10">
                <div className="font-playfair text-2xl font-bold text-giri-primary">{s.num}</div>
                <div className="font-nunito text-xs text-giri-text-light mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
