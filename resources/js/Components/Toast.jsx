import React, { useEffect } from "react";

const Toast = ({ type, message, onClose }) => {
  const typeStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // 5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`flex items-center p-3 gap-4 rounded-md mb-4 text-white ${typeStyles[type]}`}
    >
      {type === "info" && (
        <div>
          <div className="rounded-full bg-white p-2 w-10 h-10 flex items-center justify-center">
            <i className="pi pi-info-circle text-gray-700 text-lg px-0"></i>
          </div>
        </div>
      )}
      {type === "error" && (
        <div>
          <div className="rounded-full bg-white p-2 w-10 h-10 flex items-center justify-center">
            <i className="pi pi-times text-gray-700 text-lg px-0"></i>
          </div>
        </div>
      )}
      {type === "success" && (
        <div>
          <div className="rounded-full bg-white p-2 w-10 h-10 flex items-center justify-center">
            <i className="pi pi-check text-gray-700 text-lg px-0"></i>
          </div>
        </div>
      )}

      <div className="flex-1">{message}</div>
      <button onClick={onClose} className="ml-4">
        <i className="pi pi-times"></i>
      </button>
    </div>
  );
};

export default Toast;
