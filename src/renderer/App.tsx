import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  FilterByRating,
  FilterByTag,
  FILTER_BY_RATING,
  FILTER_BY_TAG,
} from "../models/filter";
import { SortOrder, SORT_ORDER } from "../models/sortOrder";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { BookList } from "./BookList";
import { booksFetched } from "./features/books/booksSlice";
import BookEditorDialog from "./features/editor/BookEditorDialog";
import { openSettingsDialog } from "./features/editor/editorSlice";
import SettingsDialog from "./features/editor/SettingsDialog";
import ErrorDialog from "./features/common/ErrorDialog";
import Pagination from "./Pagination";
import "./styles/App.css";
import { openErrorDialog } from "./features/common/errorSlice";
import { Nav } from "./Nav";

export default function App() {
  const currentBooks = useAppSelector((state) => state.books);

  const dispatch = useAppDispatch();

  const calledRef = useRef(false);

  const [keyword, setKeyword] = useState("");
  const [filterByTag] = useState<FilterByTag>(FILTER_BY_TAG.ALL);
  const [filterByRating, setFilterByRating] = useState<FilterByRating>(
    FILTER_BY_RATING.ALL
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    SORT_ORDER.REGISTERED_DESC
  );

  // 現在のフィルタ条件にマッチしたファイル数
  const [filterResults, setFilterResults] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(0);

  const pageCount = Math.ceil(filterResults / itemsPerPage);

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
        fetchBooks();
      }
    });

    window.electronAPI.handleProgressBooksAddFailed((_event, fileInfos) => {
      if (fileInfos) {
        // 登録失敗したファイルのパスを連結する
        // TODO: 失敗した複数のファイルをリスト形式で表示する専用ダイアログを用意する
        console.dir(fileInfos);
        const errorMessage = fileInfos.map((info) => info.path).join();
        dispatch(openErrorDialog(errorMessage));
      }
    });

    window.electronAPI.handleProgressBookUpdated((_event, _book) => {
      fetchBooks();
    });
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [keyword, filterByTag, filterByRating, sortOrder, currentPage]);

  useEffect(() => {
    // HACK: ロード直後に呼ばれるがフェッチ前のため無視する。
    if (pageCount === 0) {
      return;
    }

    // 1ページあたりのファイル数が増加したとき、現在のページ番号が正しい範囲に収まるよう修正する。
    // ページ番号を更新すると useEffect でフェッチされるためそちらに任せる。そうでない場合は明示的にフェッチする。
    if (currentPage >= pageCount) {
      setCurrentPage(pageCount - 1);
    } else {
      fetchBooks();
    }
  }, [itemsPerPage]);

  const fetchBooks = () => {
    window.electronAPI
      .filterAndFetchBooks(
        keyword,
        filterByTag,
        filterByRating,
        sortOrder,
        itemsPerPage,
        currentPage * itemsPerPage
      )
      .then(({ filterResult, fetchResult }) => {
        setFilterResults(filterResult.count);
        dispatch(booksFetched(fetchResult.books));
      });
  };

  const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Nav
        onChangeString={(value) => setKeyword(value)}
        onChangeRating={(value) => setFilterByRating(value)}
        onChangeSortOrder={(value) => setSortOrder(value)}
        defaultRating={filterByRating}
        defaultSortOrder={sortOrder}
      />
      <div className="viewOptions">
        <div className="label">Items per page:</div>
        <div>
          <select onChange={handleChangeSelect} defaultValue={50}>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
      <div className="booksWrapper">
        <div>
          {currentPage * itemsPerPage + 1}-
          {Math.min((currentPage + 1) * itemsPerPage, filterResults)} of{" "}
          {filterResults} results
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
      <ErrorDialog />
    </div>
  );
}
