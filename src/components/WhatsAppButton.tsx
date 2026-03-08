import { useEffect, useState } from "react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/919800000000"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-[9998] w-12 h-12 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center text-xl animate-pulse-wa hover:scale-110 transition-transform"
      aria-label="Chat on WhatsApp"
    >
      💬
    </a>
  );
};

export default WhatsAppButton;
