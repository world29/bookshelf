import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { SearchBox } from "./common/SearchBox";
import { addBook, fetchBooks } from "./features/books/booksSlice";
import BookEditorDialog from "./features/editor/BookEditorDialog";
import Pagination from "./Pagination";
import "./styles/App.css";

export default function App() {
  const books = useAppSelector((state) => state.books);

  const dispatch = useAppDispatch();

  const [currentBooks, setCurrentBooks] = useState(books);
  const [queryString, setQueryString] = useState("");

  useEffect(() => {
    dispatch(fetchBooks());
  }, []);

  // 検索文字列か books が更新されたら再度フィルタリング
  useEffect(() => {
    filterBooks();
  }, [books, queryString]);

  const filterBooks = () => {
    const filteredBooks = books.filter((book) =>
      (book.title + book.author).toLowerCase().includes(queryString)
    );
    setCurrentBooks(filteredBooks);
  };

  const handleClickAdd = () => {
    window.electronAPI.openFileDialog().then((result) => {
      if (result.canceled) return;
      dispatch(addBook({ path: result.filePaths[0] }));
    });
  };

  const handleSearch = (query: string) => {
    setQueryString(query);
  };

  return (
    <div>
      <div className="header">
        <SearchBox onSearch={handleSearch} />
        <button onClick={handleClickAdd}>Add book</button>
      </div>
      <Pagination books={currentBooks} />
      <BookEditorDialog />
    </div>
  );
}
