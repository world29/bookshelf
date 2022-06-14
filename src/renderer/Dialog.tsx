import React, { useCallback, useEffect, useRef } from "react";

export interface DialogProps {
  onClose: () => void;
  open?: boolean;
  children?: React.ReactNode;
}

export function Dialog(props: DialogProps) {
  const dialogEl: React.MutableRefObject<HTMLDialogElement | null> =
    useRef(null);

  const showModal = useCallback(() => {
    if (dialogEl.current && !dialogEl.current.open) {
      dialogEl.current.showModal();
    }
  }, []);

  const closeModal = useCallback(() => {
    if (dialogEl.current) {
      dialogEl.current.close();
      props.onClose();
    }
  }, []);

  useEffect(() => {
    if (props.open) {
      showModal();
    }
  }, [dialogEl]);

  return (
    <div>
      <dialog ref={dialogEl}>
        {props.children}
        <button type="button" onClick={closeModal}>
          close
        </button>
      </dialog>
    </div>
  );
}
