import React, { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import Modal from "../../common/Modal";
import { selectBook, updateBook } from "../books/booksSlice";
import { closeEditDialog } from "./editorSlice";

export default function BookEditorDialog() {
  const { isOpen, bookPath } = useAppSelector(
    (state: RootState) => state.editor.editDialog
  );

  const book = useAppSelector(selectBook(bookPath));

  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    setTitle(book ? book.title : "");
    setAuthor(book ? book.author : "");
  }, [book]);

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeAuthor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(updateBook({ path: bookPath, title, author }));

    closeModal();
  };

  const closeModal = () => {
    dispatch(closeEditDialog());
  };

  if (!book) {
    return null;
  }

  return (
    <Modal open={isOpen}>
      <>
        <p>dialog test</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            defaultValue={book.title}
            onChange={handleChangeTitle}
          />
          <input
            type="text"
            defaultValue={book.author}
            onChange={handleChangeAuthor}
          />
          <div>
            <button type="submit">apply</button>
            <button type="button" onClick={closeModal}>
              cancel
            </button>
          </div>
        </form>
      </>
    </Modal>
  );
}
