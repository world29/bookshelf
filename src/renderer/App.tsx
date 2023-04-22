import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Book } from "../models/book";
import {
  FilterByRating,
  FilterByTag,
  FILTER_BY_RATING,
  FILTER_BY_TAG,
} from "../models/filter";
import { SortBy, SORT_BY } from "../models/sort";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { BookList } from "./BookList";
import { SearchBox } from "./common/SearchBox";
import {
  addBooks,
  booksAdded,
  booksFetched,
  bookUpdated,
  fetchBooks,
} from "./features/books/booksSlice";
import SelectFilterByRating from "./features/books/SelectFilterByRating";
import SelectFilterByTag from "./features/books/SelectFilterByTag";
import SelectSortBy from "./features/books/SelectSortBy";
import BookEditorDialog from "./features/editor/BookEditorDialog";
import { openSettingsDialog } from "./features/editor/editorSlice";
import SettingsDialog from "./features/editor/SettingsDialog";
import Pagination from "./Pagination";
import "./styles/App.css";

export default function App() {
  const currentBooks = useAppSelector((state) => state.books);

  const dispatch = useAppDispatch();

  const calledRef = useRef(false);

  const [keyword, setKeyword] = useState("");
  const [filterByTag, setFilterByTag] = useState<FilterByTag>(
    FILTER_BY_TAG.ALL
  );
  const [filterByRating, setFilterByRating] = useState<FilterByRating>(
    FILTER_BY_RATING.ALL
  );
  const [sortBy, setSortBy] = useState<SortBy>(SORT_BY.MODIFIED_DESC);

  // 登録済みのファイル数
  const [bookTotal, setBookTotal] = useState(0);
  // 現在のフィルタ条件にマッチしたファイル数
  const [bookCount, setBookCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const pageCount = Math.ceil(bookCount / itemsPerPage);

  useEffect(() => {
    // devServer が有効なときは useEffect が２回呼ばれるので、１度だけ実行したい処理はフラグでチェックする
    if (calledRef.current) return;
    calledRef.current = true;

    console.log("App:useEffect()");

    // メニューから設定ダイアログを開く
    // memo: dispatch を使いたいため App コンポーネントの中でコールバックを登録している。
    window.electronAPI.handleOpenSettings(() => {
      dispatch(openSettingsDialog());
    });

    window.electronAPI.handleProgressBooksAdded((_event, books) => {
      if (books) {
        dispatch(booksAdded(books));
      }
    });

    window.electronAPI.handleProgressBookUpdated((_event, book) => {
      dispatch(bookUpdated(book));
    });

    window.electronAPI.getBookCount().then((count) => {
      setBookTotal(count);
    });
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [keyword, filterByTag, filterByRating, currentPage]);

  useEffect(() => {
    // 1ページあたりのファイル数が増加したとき、現在のページ番号が正しい範囲に収まるよう修正する。
    // ページ番号を更新するとエフェクトにより結果も更新されるため、そうでない場合だけ明示的に結果取得を行う。
    if (currentPage >= pageCount) {
      setCurrentPage(pageCount - 1);
    } else {
      fetchBooks();
    }
  }, [itemsPerPage]);

  const fetchBooks = () => {
    window.electronAPI
      .fetchBooks(
        keyword,
        filterByTag,
        filterByRating,
        itemsPerPage,
        currentPage * itemsPerPage
      )
      .then(({ books, total }) => {
        setBookCount(total);
        dispatch(booksFetched(books));
      });
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
    setKeyword(query);
  };

  const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value));
  };

  const handleChangeFilter = (filter: FilterByTag) => {
    setFilterByTag(filter);
  };

  const handleChangeFilterByRating = (filter: FilterByRating) => {
    setFilterByRating(filter);
  };

  const handleChangeSortBy = (newSortBy: SortBy) => {
    setSortBy(newSortBy);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div>{bookTotal}</div>
      <button onClick={handleClickAddZip}>Add zip</button>
      <button onClick={handleClickAddFolder}>Add folder</button>
      <div className="searchForm">
        <SearchBox onSearch={handleSearch} />
        <SelectFilterByTag
          defaultValue={filterByTag}
          onChange={handleChangeFilter}
        />
        <SelectFilterByRating
          defaultValue={filterByRating}
          onChange={handleChangeFilterByRating}
        />
      </div>
      <div className="viewOptions">
        <div className="label">Items per page:</div>
        <div>
          <select onChange={handleChangeSelect}>
            <option value="10">10</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <SelectSortBy defaultValue={sortBy} onChange={handleChangeSortBy} />
      </div>
      <div className="booksWrapper">
        <div>
          {currentPage * itemsPerPage + 1}-
          {Math.min((currentPage + 1) * itemsPerPage, bookCount)} of {bookCount}{" "}
          results
        </div>
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          onPageChange={handlePageChange}
        />
        <BookList books={currentBooks} />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          onPageChange={handlePageChange}
        />
      </div>
      <BookEditorDialog />
      <SettingsDialog />
    </div>
  );
}
