import { useEffect, useState } from "react";

import { Book } from "../models/book";
import Pagination from "./Pagination";
import "./styles/App.css";

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const getBooks = async () => {
      window.electronAPI.findBooks("").then((res) => setBooks(res));
    };
    getBooks().then(() => console.dir(books));
  }, []);

  return (
    <div className="App">
      <Pagination books={books} />
    </div>
  );
}
