import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { fetchBooks } from "./features/books/booksSlice";
import BookAddDialog from "./features/editor/BookAddDialog";
import BookEditorDialog from "./features/editor/BookEditorDialog";
import { openAddDialog } from "./features/editor/editorSlice";
import Pagination from "./Pagination";
import "./styles/App.css";

export default function App() {
  const books = useAppSelector((state) => state.books);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBooks());
  }, []);

  const handleClickAdd = () => {
    dispatch(openAddDialog());
  };

  return (
    <div className="App">
      <button onClick={handleClickAdd}>Add book</button>
      <Pagination books={books} />
      <BookEditorDialog />
      <BookAddDialog />
    </div>
  );
}
