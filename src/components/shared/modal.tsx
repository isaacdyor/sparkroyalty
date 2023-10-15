import React, { useEffect } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isOpen) {
        const modalContent = document.querySelector(".modal-content");

        if (modalContent && !modalContent.contains(event.target as Node)) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.body.style.overflow = "auto"; // Reset overflow when component unmounts
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  return ReactDOM.createPortal(
    <>{children}</>,
    document.getElementById("modal-root")!
  );
};

export default Modal;
