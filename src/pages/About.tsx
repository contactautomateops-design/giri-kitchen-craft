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
    <div className="pt-24 pb-0 bg-giri-bg min-h-screen">
      {/* Hero */}
      <div className="max-w-3xl mx-auto px-4 text-center py-16" data-aos="fade-up">
        <span className="inline-block px-4 py-1.5 rounded-full bg-giri-primary/10 text-giri-primary font-nunito font-bold text-sm mb-4">
          About Us
        </span>
        <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-giri-text-dark mb-6">
          Our Journey of Purity
        </h1>
        <p className="font-nunito text-giri-text-light leading-relaxed text-lg">
          At Giri Food Productions, we believe that great cooking begins with pure ingredients. Born from a simple idea — that families deserve food products free from chemicals and shortcuts — we've built our brand on trust, tradition, and transparency.
        </p>
      </div>

      {/* Values */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="font-playfair text-3xl font-bold text-giri-text-dark text-center mb-10" data-aos="fade-up">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 text-center shadow-sm" data-aos="fade-up" data-aos-delay={i * 100}>
              <span className="text-4xl mb-4 inline-block">{v.icon}</span>
              <h3 className="font-playfair text-xl font-bold text-giri-text-dark mb-2">{v.title}</h3>
              <p className="font-nunito text-sm text-giri-text-light">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="font-playfair text-3xl font-bold text-giri-text-dark text-center mb-12" data-aos="fade-up">
          Our Journey
        </h2>
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-giri-primary/20 -translate-x-1/2" />
          {timeline.map((item, i) => (
            <div
              key={i}
              className={`relative flex items-center mb-12 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              data-aos={i % 2 === 0 ? "fade-right" : "fade-left"}
              data-aos-delay={i * 100}
            >
              <div className="w-1/2 px-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <span className="font-playfair text-2xl font-bold text-giri-primary">{item.year}</span>
                  <h3 className="font-playfair text-lg font-bold text-giri-text-dark mt-2">{item.title}</h3>
                  <p className="font-nunito text-sm text-giri-text-light mt-2">{item.desc}</p>
                </div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-giri-primary border-4 border-giri-bg" />
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
