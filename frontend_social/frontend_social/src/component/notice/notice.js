// src/components/notice/notice.js
let alertCallback = null;

export const showAlert = (message, type = "success", duration = 3000) => {
  // Nếu có component cha đang lắng nghe (React Toastify, custom toast, v.v.)
  if (alertCallback) {
    alertCallback({ message, type, duration });
    return;
  }

  // Fallback: dùng alert() nếu không có toast system
  // Hoặc tạo toast đơn giản bằng DOM (không cần thẻ HTML cố định)
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === "success" ? "#42b72a" : "#e02828"};
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 15px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s ease;
    max-width: 400px;
    word-wrap: break-word;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Hiệu ứng hiện
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 100);

  // Tự mất sau duration
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-20px)";
    setTimeout(() => document.body.removeChild(toast), 300);
  }, duration);
};

// Cho phép component cha (ví dụ App.jsx) inject toast system đẹp hơn sau này
export const setAlertHandler = (callback) => {
  alertCallback = callback;
};