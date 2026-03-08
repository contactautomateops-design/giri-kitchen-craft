import { useState } from "react";
import { products } from "@/data/products";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-giri-bg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14" data-aos="fade-up">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-giri-text-dark">
            Get in Touch or Place a Bulk Order
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div data-aos="fade-up" data-aos-delay="100">
            {submitted ? (
              <div className="bg-white rounded-2xl p-10 text-center shadow-lg">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="font-playfair text-2xl font-bold text-giri-text-dark">Thank you!</h3>
                <p className="font-nunito text-giri-text-light mt-2">We'll contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg space-y-5">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-giri-primary/20 font-nunito text-sm focus:border-giri-primary focus:ring-2 focus:ring-giri-primary/20 outline-none transition-all bg-transparent"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-giri-primary/20 font-nunito text-sm focus:border-giri-primary focus:ring-2 focus:ring-giri-primary/20 outline-none transition-all bg-transparent"
                />
                <select
                  required
                  className="w-full px-4 py-3 rounded-xl border border-giri-primary/20 font-nunito text-sm focus:border-giri-primary focus:ring-2 focus:ring-giri-primary/20 outline-none transition-all bg-transparent text-giri-text-light"
                >
                  <option value="">Product Interest</option>
                  {products.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                  <option value="general">General Enquiry</option>
                </select>
                <textarea
                  placeholder="Message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-giri-primary/20 font-nunito text-sm focus:border-giri-primary focus:ring-2 focus:ring-giri-primary/20 outline-none transition-all bg-transparent resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-giri-primary text-white font-nunito font-bold hover:bg-orange-600 transition-all"
                >
                  Send Enquiry →
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6" data-aos="fade-up" data-aos-delay="200">
            {[
              { icon: "📍", label: "Address", value: "Giri Food Productions, Maharashtra, India" },
              { icon: "📞", label: "Phone", value: "+91 98000 00000" },
              { icon: "📧", label: "Email", value: "contact@girifoodproductions.com" },
              { icon: "🕐", label: "Hours", value: "Mon–Sat: 9:00 AM – 6:00 PM" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-giri-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="font-nunito font-bold text-giri-text-dark text-sm">{item.label}</div>
                  <div className="font-nunito text-giri-text-light text-sm">{item.value}</div>
                </div>
              </div>
            ))}

            <a
              href="https://wa.me/919800000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-nunito font-bold text-base hover:scale-105 transition-all shadow-lg mt-4"
            >
              💬 Order Directly on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
