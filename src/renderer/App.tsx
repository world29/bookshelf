import { ChangeEvent, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { SearchBox } from "./common/SearchBox";
import { addBook, fetchBooks } from "./features/books/booksSlice";
import BookEditorDialog from "./features/editor/BookEditorDialog";
import { openSettingsDialog } from "./features/editor/editorSlice";
import SettingsDialog from "./features/editor/SettingsDialog";
import Pagination from "./Pagination";
import "./styles/App.css";

export default function App() {
  const books = useAppSelector((state) => state.books);

  const dispatch = useAppDispatch();

  const [currentBooks, setCurrentBooks] = useState(books);
  const [queryString, setQueryString] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    // メニューから設定ダイアログを開く
    // memo: dispatch を使いたいため App コンポーネントの中でコールバックを登録している。
    window.electronAPI.handleOpenSettings(() => {
      dispatch(openSettingsDialog());
    });

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

  const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value));
  };

  return (
    <div>
      <div className="header">
        <SearchBox onSearch={handleSearch} />
        <button onClick={handleClickAdd}>Add book</button>
        <select onChange={handleChangeSelect}>
          <option value="3">3</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </div>
      <Pagination books={currentBooks} itemsPerPage={itemsPerPage} />
      <BookEditorDialog />
      <SettingsDialog />
    </div>
  );
}
