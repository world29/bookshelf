import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Modal from "../../common/Modal";
import { closeErrorDialog } from "./errorSlice";

export default function ErrorDialog() {
  const { errorMessage, isDialogOpen } = useAppSelector((state) => state.error);

  const dispatch = useAppDispatch();

  const closeModal = () => {
    dispatch(closeErrorDialog());
  };

  return (
    <Modal open={isDialogOpen}>
      <div>
        <p>{errorMessage}</p>
      </div>
      <div>
        <button type="button" onClick={closeModal}>
          close
        </button>
      </div>
    </Modal>
  );
}
