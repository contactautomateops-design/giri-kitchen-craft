const trustItems = [
  { icon: "🌱", title: "100% Natural", desc: "No artificial additives ever" },
  { icon: "🧴", title: "Cold-Press Extracted", desc: "Nutrients fully preserved" },
  { icon: "🔬", title: "Lab Quality Tested", desc: "Safe for every family" },
  { icon: "🚛", title: "Pan India Delivery", desc: "Fast and reliable shipping" },
];

const TrustBar = () => (
  <section className="bg-foreground py-6">
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
      {trustItems.map((item, i) => (
        <div
          key={i}
          className={`flex flex-col items-center text-center py-2 ${
            i < trustItems.length - 1 ? "md:border-r md:border-background/10" : ""
          }`}
          data-aos="fade-up"
          data-aos-delay={i * 100}
        >
          <span className="text-2xl mb-2">{item.icon}</span>
          <span className="text-primary-foreground font-body font-semibold text-xs tracking-wide">{item.title}</span>
          <span className="text-primary-foreground/40 font-body text-[11px] mt-1">{item.desc}</span>
        </div>
      ))}
    </div>
  </section>
);

export default TrustBar;
