import { useState, useEffect } from "react";
import "./../styles/Toast.css";

interface ToastProps {
  id: string;
  message: string;
  type: "error" | "warning" | "default";
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({
  id,
  message,
  type,
  duration = 3000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const getBackgroundColor = () => {
    switch (type) {
      case "error":
        return "#ff4d4f"; // 赤
      case "warning":
        return "#faad14"; // 黄色
      default:
        return "#333"; // デフォルトは黒
    }
  };

  return (
    <div
      className={`toast ${visible ? "show" : ""}`}
      style={{ backgroundColor: getBackgroundColor() }}
    >
      {message}
    </div>
  );
}
