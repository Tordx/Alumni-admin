import React from 'react';
import '../styles/components.css';

type Props = {
    isOpen: boolean,
    onClose: (e: any) => void,
    imageSrc: string,
}

const Modal = ({ isOpen, onClose, imageSrc }: Props) => {
  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
             <span className="modal-close" onClick={onClose}>
              &times;
            </span>
          <div className="modal-content">
           
            <img src={imageSrc} alt="Expanded Image" className="modal-image" />
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;