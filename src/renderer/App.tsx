import { ChangeEvent, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

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
import { Nav } from "./Nav";
import { Toast } from "./features/common/Toast";
import Progress from "./features/common/Progress";

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
  const [toasts, setToasts] = useState<
    { id: string; message: string; type: "error" | "warning" | "default" }[]
  >([]);
  const [progressActive, setProgressActive] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

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

    window.electronAPI.handleProgressBookAddFailed((_event, fileInfo) => {
      // 登録失敗したファイルをエラーとして表示する
      const message = `Add failed: ${fileInfo.path}`;
      showToast(message, "error");
    });

    window.electronAPI.handleProgressBookUpdated((_event, _book) => {
      fetchBooks();
    });

    window.electronAPI.handleProgressThumbnailGenerationStarted(
      (_event, fileCount) => {
        showProgress(0);
      }
    );
    window.electronAPI.handleProgressThumbnailGenerationProgress(
      (_event, generatedCount, fileCount) => {
        showProgress(generatedCount / fileCount);
      }
    );
    window.electronAPI.handleProgressThumbnailGenerationCompleted((_event) => {
      hideProgress();
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
    scrollToTop();
  };

  const showToast = (
    message: string,
    type: "error" | "warning" | "default"
  ) => {
    const newToast = {
      id: uuidv4(),
      message,
      type,
    };

    setToasts((prevToasts) => [newToast, ...prevToasts]);
  };

  const closeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const showProgress = (value: number) => {
    if (!progressActive) {
      setProgressActive(true);
    }
    setProgressValue(value);
  };

  const hideProgress = () => {
    setProgressActive(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
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
      <div>
        {`${currentPage * itemsPerPage + 1}-${Math.min(
          (currentPage + 1) * itemsPerPage,
          filterResults
        )} of ${filterResults} results`}
      </div>
      <div>
        <div className="pagination-wrapper">
          <Pagination
            currentPage={currentPage}
            totalPages={pageCount}
            onPageChange={handlePageChange}
          />
        </div>
        <div className="booksWrapper">
          <BookList books={currentBooks} />
        </div>
        <div className="pagination-wrapper">
          <Pagination
            currentPage={currentPage}
            totalPages={pageCount}
            onPageChange={handlePageChange}
          />
        </div>
        <div className="toasts-container">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={closeToast}
            />
          ))}
        </div>
        <BookEditorDialog />
        <SettingsDialog />
        <ErrorDialog />
        <Progress active={progressActive} value={progressValue} />
      </div>{" "}
    </>
  );
}
