import React, { useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Modal from "../../common/Modal";
import { addBook } from "../books/booksSlice";
import { closeAddDialog } from "./editorSlice";

export default function BookAddDialog() {
  const { isOpen } = useAppSelector((state) => state.editor.addDialog);

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

  const handleClickFileSelect = () => {
    window.electronAPI.openFileDialog().then((result) => {
      if (result.canceled) return;
      setFilePath(result.filePaths[0]);
    });
  };

  const closeModal = () => {
    dispatch(closeAddDialog());
  };

  return (
    <Modal open={isOpen}>
      <>
        <form onSubmit={handleSubmit}>
          <input type="text" onChange={handleChangeFilePath} value={filePath} />
          <button type="button" onClick={handleClickFileSelect}>
            select file
          </button>
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
