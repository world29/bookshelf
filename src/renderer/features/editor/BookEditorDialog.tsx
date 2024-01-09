import React, { useEffect, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectBook, updateBook } from "../books/booksSlice";
import { closeEditDialog } from "./editorSlice";

export default function BookEditorDialog() {
  const { isOpen, bookPath } = useAppSelector(
    (state) => state.editor.editDialog
  );

  const book = useAppSelector(selectBook(bookPath));

  const dispatch = useAppDispatch();

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (dialogRef.current) {
      if (isOpen) {
        dialogRef.current.showModal();
      } else {
        dialogRef.current.close();
      }
    }
  }, [isOpen]);

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
    <dialog ref={dialogRef} onClick={closeModal}>
      <div onClick={(e) => e.stopPropagation()}>
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
      </div>
    </dialog>
  );
}
