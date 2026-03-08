import { useEffect, useState } from "react";

const ScrollProgress = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setWidth(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div className="scroll-progress" style={{ width: `${width}%` }} />;
};

export default ScrollProgress;
