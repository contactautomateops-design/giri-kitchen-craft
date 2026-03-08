import { useState } from "react";
import { products } from "@/data/products";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14" data-aos="fade-up">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-foreground">
            Get in Touch
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-2">Place a bulk order or send us an enquiry</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div data-aos="fade-up" data-aos-delay="100">
            {submitted ? (
              <div className="bg-secondary rounded-xl p-10 text-center">
                <span className="text-3xl mb-4 inline-block">✅</span>
                <h3 className="font-playfair text-xl font-bold text-foreground">Thank you!</h3>
                <p className="font-body text-sm text-muted-foreground mt-2">We'll contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Full Name" required className="w-full px-4 py-3 rounded-lg border border-border font-body text-sm focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-all bg-transparent" />
                <input type="tel" placeholder="Phone Number" required className="w-full px-4 py-3 rounded-lg border border-border font-body text-sm focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-all bg-transparent" />
                <select required className="w-full px-4 py-3 rounded-lg border border-border font-body text-sm focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-all bg-transparent text-muted-foreground">
                  <option value="">Product Interest</option>
                  {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  <option value="general">General Enquiry</option>
                </select>
                <textarea placeholder="Message" rows={4} className="w-full px-4 py-3 rounded-lg border border-border font-body text-sm focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-all bg-transparent resize-none" />
                <button type="submit" className="w-full py-3 rounded-lg bg-foreground text-background font-body font-semibold text-sm hover:bg-foreground/90 transition-all">
                  Send Enquiry →
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6" data-aos="fade-up" data-aos-delay="200">
            {[
              { icon: "📍", label: "Address", value: "Giri Food Productions, Maharashtra, India" },
              { icon: "📞", label: "Phone", value: "+91 98000 00000" },
              { icon: "📧", label: "Email", value: "contact@girifoodproductions.com" },
              { icon: "🕐", label: "Hours", value: "Mon–Sat: 9:00 AM – 6:00 PM" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-lg flex-shrink-0">{item.icon}</div>
                <div>
                  <div className="font-body font-semibold text-foreground text-xs tracking-wide">{item.label}</div>
                  <div className="font-body text-sm text-muted-foreground">{item.value}</div>
                </div>
              </div>
            ))}
            <a
              href="https://wa.me/919800000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-body font-semibold text-sm hover:scale-105 transition-all mt-2"
            >
              💬 Order on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
