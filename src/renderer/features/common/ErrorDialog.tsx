import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { closeErrorDialog } from "./errorSlice";

export default function ErrorDialog() {
  const { errorMessage, isDialogOpen } = useAppSelector((state) => state.error);

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (dialogRef.current) {
      if (isDialogOpen) {
        dialogRef.current.showModal();
      } else {
        dialogRef.current.close();
      }
    }
  }, [isDialogOpen]);

  const dispatch = useAppDispatch();

  const closeModal = () => {
    dispatch(closeErrorDialog());
  };

  return (
    <dialog ref={dialogRef} onClick={closeModal}>
      <div onClick={(e) => e.stopPropagation()}>
        <div>
          <p>{errorMessage}</p>
        </div>
        <div>
          <button type="button" onClick={closeModal}>
            close
          </button>
        </div>
      </div>
    </dialog>
  );
}
