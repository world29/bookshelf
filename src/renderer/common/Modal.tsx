import { ReactNode } from "react";
import "../styles/Modal.css";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

function Modal(props: ModalProps) {
  const { open, onClose, children } = props;

  const handleClickBackground = () => {
    onClose();
  };

  const handleClickModalContent = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  if (open) {
    return (
      <div id="overlay" onClick={handleClickBackground}>
        <div id="content" onClick={handleClickModalContent}>
          {children}
          <button onClick={() => onClose()}>close</button>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default Modal;
