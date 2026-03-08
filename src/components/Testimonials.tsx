import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  { text: "The groundnut oil from Giri is absolutely pure — you can smell the difference from the very first use. My family won't use anything else now!", name: "Meena Sharma", location: "Mumbai" },
  { text: "I've switched my entire kitchen to Giri products. The turmeric powder is so vibrant and fresh — nothing like the packaged stuff from supermarkets.", name: "Rajesh Patel", location: "Ahmedabad" },
  { text: "Finally a brand that delivers exactly what it promises. The mustard oil taste is exactly like what we used back in our village. Truly authentic!", name: "Priya Nair", location: "Bengaluru" },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  const next = useCallback(() => setCurrent(c => (c + 1) % testimonials.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + testimonials.length) % testimonials.length), []);

  useEffect(() => {
    intervalRef.current = setInterval(next, 4000);
    return () => clearInterval(intervalRef.current);
  }, [next]);

  const handleManual = (fn: () => void) => {
    clearInterval(intervalRef.current);
    fn();
    intervalRef.current = setInterval(next, 4000);
  };

  return (
    <section className="py-24 bg-secondary/40">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14" data-aos="fade-up">
          <span className="inline-block px-3 py-1.5 rounded-full bg-primary/10 text-primary font-body font-semibold text-xs tracking-widest uppercase mb-4">
            Testimonials
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-foreground">
            What Our Customers Say
          </h2>
        </div>

        <div className="relative" data-aos="fade-up" data-aos-delay="100">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
              {testimonials.map((t, i) => (
                <div key={i} className="w-full flex-shrink-0 px-2">
                  <div className="bg-background rounded-2xl p-8 border border-border shadow-sm relative">
                    <span className="absolute top-4 left-6 text-5xl text-primary/20 font-playfair leading-none">"</span>
                    <p className="font-body text-foreground leading-relaxed mt-6 text-sm italic">
                      {t.text}
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-playfair font-bold text-sm text-primary">
                        {t.name[0]}
                      </div>
                      <div>
                        <div className="font-body font-semibold text-foreground text-xs">{t.name}</div>
                        <div className="font-body text-[10px] text-muted-foreground">{t.location}</div>
                      </div>
                      <span className="ml-auto text-xs">⭐⭐⭐⭐⭐</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => handleManual(prev)} className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary/10 transition-all shadow-sm">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => handleManual(next)} className="absolute right-[-16px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary/10 transition-all shadow-sm">
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => handleManual(() => setCurrent(i))} className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-primary w-5" : "bg-border"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
