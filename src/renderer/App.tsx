import { ChangeEvent, useEffect, useState } from "react";
import { Book } from "../models/book";
import { FilterByTag, FILTER_BY_TAG } from "../models/filter";
import { SortBy, SORT_BY } from "../models/sort";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { SearchBox } from "./common/SearchBox";
import { addBooks, fetchBooks } from "./features/books/booksSlice";
import SelectFilterByTag from "./features/books/SelectFilterByTag";
import SelectSortBy from "./features/books/SelectSortBy";
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
  const [filterByTag, setFilterByTag] = useState<FilterByTag>(
    FILTER_BY_TAG.ALL
  );
  const [sortBy, setSortBy] = useState<SortBy>(SORT_BY.MODIFIED_DESC);
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
  }, [books, queryString, filterByTag, sortBy]);

  const filterBooks = () => {
    // 文字列でフィルタリング
    const matchQueryString = (book: Book) =>
      (book.title + book.author).toLowerCase().includes(queryString);

    // タグの有無でフィルタリング
    const matchFilterByTag = (book: Book) => {
      switch (filterByTag) {
        case FILTER_BY_TAG.ALL:
          return true;
        case FILTER_BY_TAG.TAGGED:
          return book.author !== "";
        case FILTER_BY_TAG.UNTAGGED:
          return book.author === "";
      }
    };

    // 並べ替え
    const sortBooks = (a: Book, b: Book) => {
      switch (sortBy) {
        case SORT_BY.MODIFIED_DESC:
          return (
            new Date(b.modifiedTime).getTime() -
            new Date(a.modifiedTime).getTime()
          );
        case SORT_BY.MODIFIED_ASC:
          return (
            new Date(a.modifiedTime).getTime() -
            new Date(b.modifiedTime).getTime()
          );
      }
    };

    const filteredBooks = books
      .filter((book) => matchQueryString(book) && matchFilterByTag(book))
      .sort(sortBooks);

    setCurrentBooks(filteredBooks);
  };

  const handleClickAddZip = () => {
    window.electronAPI.openFileDialog("openFile").then((result) => {
      if (result.canceled) return;
      dispatch(addBooks({ filePaths: result.filePaths }));
    });
  };

  const handleClickAddFolder = () => {
    window.electronAPI.openFileDialog("openDirectory").then((result) => {
      if (result.canceled) return;
      dispatch(addBooks({ filePaths: result.filePaths }));
    });
  };

  const handleSearch = (query: string) => {
    setQueryString(query);
  };

  const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value));
  };

  const handleChangeFilter = (filter: FilterByTag) => {
    setFilterByTag(filter);
  };

  const handleChangeSortBy = (newSortBy: SortBy) => {
    setSortBy(newSortBy);
  };

  return (
    <div>
      <button onClick={handleClickAddZip}>Add zip</button>
      <button onClick={handleClickAddFolder}>Add folder</button>
      <div className="searchForm">
        <SearchBox onSearch={handleSearch} />
        <SelectFilterByTag
          defaultValue={filterByTag}
          onChange={handleChangeFilter}
        />
      </div>
      <div className="viewOptions">
        <select onChange={handleChangeSelect}>
          <option value="3">3</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
        <SelectSortBy defaultValue={sortBy} onChange={handleChangeSortBy} />
      </div>
      <Pagination books={currentBooks} itemsPerPage={itemsPerPage} />
      <BookEditorDialog />
      <SettingsDialog />
    </div>
  );
}
