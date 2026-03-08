import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    text: "The groundnut oil from Giri is absolutely pure — you can smell the difference from the very first use. My family won't use anything else now!",
    name: "Meena Sharma",
    location: "Mumbai",
  },
  {
    text: "I've switched my entire kitchen to Giri products. The turmeric powder is so vibrant and fresh — nothing like the packaged stuff from supermarkets.",
    name: "Rajesh Patel",
    location: "Ahmedabad",
  },
  {
    text: "Finally a brand that delivers exactly what it promises. The mustard oil taste is exactly like what we used back in our village. Truly authentic!",
    name: "Priya Nair",
    location: "Bengaluru",
  },
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
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-giri-primary/10 text-giri-primary font-nunito font-bold text-sm mb-4">
            Testimonials
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-giri-text-dark">
            What Our Customers Say
          </h2>
        </div>

        <div className="relative" data-aos="fade-up" data-aos-delay="100">
          {/* Cards */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((t, i) => (
                <div key={i} className="w-full flex-shrink-0 px-2 md:px-8">
                  <div className="bg-giri-card-bg rounded-2xl p-8 border-l-4 border-giri-primary relative">
                    <span className="absolute top-4 left-6 text-5xl text-giri-secondary/40 font-playfair leading-none">"</span>
                    <p className="font-nunito text-giri-text-dark leading-relaxed mt-6 text-lg italic">
                      {t.text}
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-giri-primary/10 flex items-center justify-center font-playfair font-bold text-giri-primary">
                        {t.name[0]}
                      </div>
                      <div>
                        <div className="font-nunito font-bold text-giri-text-dark text-sm">{t.name}</div>
                        <div className="font-nunito text-xs text-giri-text-light">{t.location}</div>
                      </div>
                      <span className="ml-auto text-sm">⭐⭐⭐⭐⭐</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <button
            onClick={() => handleManual(prev)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-giri-primary hover:text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleManual(next)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-giri-primary hover:text-white transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => handleManual(() => setCurrent(i))}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === current ? "bg-giri-primary w-6" : "bg-giri-primary/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
