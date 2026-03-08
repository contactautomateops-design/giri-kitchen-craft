import { useEffect, useState } from "react";

const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 300);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast-notification ${exiting ? "toast-exit" : ""}`}>
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-giri-dark text-white shadow-2xl font-nunito text-sm">
        <span className="text-lg">✅</span>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
