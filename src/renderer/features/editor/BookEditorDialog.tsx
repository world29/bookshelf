import { RefObject, useEffect, useState } from "react";

import { useAppDispatch } from "../../app/hooks";
import { updateBook } from "../books/booksSlice";

import "./../../styles/BookEditorDialog.css";
import { Book } from "../../../models/book";

type Props = {
  dialogRef: RefObject<HTMLDialogElement>;
  book: Book | null;
  onClose: () => void;
};

export default function BookEditorDialog(props: Props) {
  const { dialogRef, book, onClose } = props;

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

  const handleSave = () => {
    if (book) {
      dispatch(updateBook({ path: book.path, title, author }));
    }

    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={() => onClose()}
      onCancel={() => onClose()}
    >
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
