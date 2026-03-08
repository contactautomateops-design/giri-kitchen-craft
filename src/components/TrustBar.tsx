const trustItems = [
  { icon: "🌱", title: "100% Natural", desc: "No artificial additives ever" },
  { icon: "🧴", title: "Cold-Press Extracted", desc: "Nutrients fully preserved" },
  { icon: "🔬", title: "Lab Quality Tested", desc: "Safe for every family" },
  { icon: "🚛", title: "Pan India Delivery", desc: "Fast and reliable shipping" },
];

const TrustBar = () => (
  <section className="bg-giri-dark py-7">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
      {trustItems.map((item, i) => (
        <div
          key={i}
          className={`flex flex-col items-center text-center py-3 ${
            i < trustItems.length - 1 ? "md:border-r md:border-white/10" : ""
          }`}
          data-aos="fade-up"
          data-aos-delay={i * 100}
        >
          <span className="text-3xl mb-2">{item.icon}</span>
          <span className="text-white font-nunito font-bold text-sm">{item.title}</span>
          <span className="text-white/50 font-nunito text-xs mt-1">{item.desc}</span>
        </div>
      ))}
    </div>
  </section>
);

export default TrustBar;
