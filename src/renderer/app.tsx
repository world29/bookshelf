import { useEffect } from "react";
import { useSelector } from "react-redux";

import { useAppDispatch } from "./app/hooks";
import { RootState } from "./app/store";
import { fetchBooks } from "./features/books/booksSlice";
import { Counter } from "./features/counter/Counter";
import Pagination from "./Pagination";
import "./styles/App.css";

export default function App() {
  const books = useSelector((state: RootState) => state.books);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBooks());
  }, []);

  return (
    <div className="App">
      <Counter />
      <Pagination books={books} />
    </div>
  );
}
