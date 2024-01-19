import { useEffect, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectBook, updateBook } from "../books/booksSlice";
import { closeEditDialog } from "./editorSlice";

import "./../../styles/BookEditorDialog.css";

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

  const handleSave = () => {
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
        <div className="book-edit-page">
          <h1>Edit Book Information</h1>
          <form>
            <div className="form-group">
              <label>Title:</label>
              <input type="text" value={title} onChange={handleChangeTitle} />
            </div>
            <div className="form-group">
              <label>Author:</label>
              <input type="text" value={author} onChange={handleChangeAuthor} />
            </div>
            <button type="button" onClick={handleSave}>
              Save
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
