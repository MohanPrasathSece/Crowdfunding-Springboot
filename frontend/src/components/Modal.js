import React from 'react';

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="bg-white text-black rounded shadow-lg w-11/12 max-w-xs p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
