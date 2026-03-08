import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AboutSection from "@/components/AboutSection";

const timeline = [
  { year: "2021", title: "The Seed Was Planted", desc: "Giri Food Productions began with a vision to bring pure, chemical-free cooking essentials to Indian homes." },
  { year: "2022", title: "First Products Launched", desc: "Our cold-pressed groundnut oil and stone-ground spices hit the market and won hearts instantly." },
  { year: "2023", title: "Growing the Family", desc: "Expanded to 6 products and built partnerships with farmers across Maharashtra and Gujarat." },
  { year: "2024", title: "5000+ Happy Customers", desc: "Crossed a milestone of 5000 families trusting us for their daily cooking needs." },
];

const values = [
  { icon: "🌿", title: "Purity First", desc: "No chemicals, no shortcuts. Every product is as nature intended." },
  { icon: "🤝", title: "Fair Trade", desc: "Direct partnerships with farmers ensure fair prices for everyone." },
  { icon: "💛", title: "Family Values", desc: "We make products we'd proudly serve to our own families." },
];

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 80, easing: "ease-out-cubic" });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-0 bg-background min-h-screen">
      <div className="max-w-3xl mx-auto px-6 text-center py-16" data-aos="fade-up">
        <span className="inline-block px-3 py-1 rounded-full border border-border text-muted-foreground font-body font-medium text-xs tracking-widest uppercase mb-4">
          About Us
        </span>
        <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-foreground mb-6">
          Our Journey of Purity
        </h1>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          At Giri Food Productions, we believe that great cooking begins with pure ingredients. Born from a simple idea — that families deserve food products free from chemicals and shortcuts — we've built our brand on trust, tradition, and transparency.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="font-playfair text-2xl font-bold text-foreground text-center mb-10" data-aos="fade-up">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {values.map((v, i) => (
            <div key={i} className="bg-secondary rounded-xl p-8 text-center" data-aos="fade-up" data-aos-delay={i * 100}>
              <span className="text-3xl mb-4 inline-block">{v.icon}</span>
              <h3 className="font-playfair text-lg font-bold text-foreground mb-2">{v.title}</h3>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="font-playfair text-2xl font-bold text-foreground text-center mb-12" data-aos="fade-up">Our Journey</h2>
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
          {timeline.map((item, i) => (
            <div
              key={i}
              className={`relative flex items-center mb-12 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              data-aos={i % 2 === 0 ? "fade-right" : "fade-left"}
              data-aos-delay={i * 100}
            >
              <div className="w-1/2 px-6">
                <div className="bg-secondary rounded-xl p-6">
                  <span className="font-playfair text-xl font-bold text-foreground">{item.year}</span>
                  <h3 className="font-playfair text-base font-bold text-foreground mt-2">{item.title}</h3>
                  <p className="font-body text-xs text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-foreground" />
              <div className="w-1/2" />
            </div>
          ))}
        </div>
      </div>

      <AboutSection />
    </div>
  );
};

export default About;
