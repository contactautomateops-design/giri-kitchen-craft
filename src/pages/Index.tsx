import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ProductsSection from "@/components/ProductsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import AboutSection from "@/components/AboutSection";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

const Index = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 80, easing: "ease-out-cubic" });
  }, []);

  return (
    <>
      <Hero />
      <TrustBar />
      <ProductsSection />
      <WhyChooseUs />
      <AboutSection />
      <Testimonials />
      <Contact />
    </>
  );
};

export default Index;
