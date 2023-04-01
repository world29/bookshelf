import React, { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import Modal from "../../common/Modal";
import { addBook } from "../books/booksSlice";
import { endAdd } from "./editorSlice";

export default function BookAddDialog() {
  const { isOpen } = useAppSelector(
    (state: RootState) => state.editor.addDialog
  );

  const dispatch = useAppDispatch();

  const [filePath, setFilePath] = useState("");

  const handleChangeFilePath = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilePath(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(addBook({ path: filePath }));

    closeModal();
  };

  const closeModal = () => {
    dispatch(endAdd());
  };

  return (
    <Modal open={isOpen}>
      <>
        <form onSubmit={handleSubmit}>
          <input type="text" onChange={handleChangeFilePath} />
          <div>
            <button type="submit">add</button>
            <button type="button" onClick={closeModal}>
              cancel
            </button>
          </div>
        </form>
      </>
    </Modal>
  );
}
