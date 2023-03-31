import { ReactNode } from "react";
import "../styles/Modal.css";

type ModalProps = {
  open: boolean;
  children: ReactNode;
};

function Modal(props: ModalProps) {
  const { open, children } = props;

  if (!open) {
    return null;
  }

  return (
    <div id="overlay">
      <div id="content">{children}</div>
    </div>
  );
}

export default Modal;
