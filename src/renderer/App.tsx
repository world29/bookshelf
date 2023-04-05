import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { addBook, fetchBooks } from "./features/books/booksSlice";
import BookEditorDialog from "./features/editor/BookEditorDialog";
import Pagination from "./Pagination";
import "./styles/App.css";

export default function App() {
  const books = useAppSelector((state) => state.books);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBooks());
  }, []);

  const handleClickAdd = () => {
    window.electronAPI.openFileDialog().then((result) => {
      if (result.canceled) return;
      dispatch(addBook({ path: result.filePaths[0] }));
    });
  };

  return (
    <div className="App">
      <button onClick={handleClickAdd}>Add book</button>
      <Pagination books={books} />
      <BookEditorDialog />
    </div>
  );
}
