import React, { useState } from "react";
import { useSelector } from "react-redux";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import Modal from "../../common/Modal";
import { selectBook, updateBook } from "../books/booksSlice";
import { endEdit } from "./editorSlice";

export default function BookEditorDialog() {
  const { isEditing, bookPath } = useSelector(
    (state: RootState) => state.editor
  );

  const book = useAppSelector(selectBook(bookPath ? bookPath : ""));

  const dispatch = useAppDispatch();

  const [title, setTitle] = useState<string>(book ? book.title : "");
  const [author, setAuthor] = useState<string>(book ? book.author : "");

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeAuthor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(updateBook({ path: book ? book.path : "", title, author }));
  };

  const closeModal = () => {
    dispatch(endEdit());
  };

  if (!book) {
    return null;
  }

  return (
    <Modal open={isEditing}>
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
