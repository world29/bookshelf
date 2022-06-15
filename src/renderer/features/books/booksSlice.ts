import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { BookInfo } from "../../../lib/book";
import { RootState } from "../../app/store";

export interface BookEditContext {
  targetPath: string; // 編集対象のファイルパス
}

export interface BooksState {
  bookInfos: BookInfo[];
  editContext: BookEditContext | null;
}

const initialState: BooksState = {
  bookInfos: [],
  editContext: null,
};

export const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    loadBooks: (state, action: PayloadAction<BookInfo[]>) => {
      state.bookInfos = action.payload;
    },
    loadBook: (state, action: PayloadAction<BookInfo>) => {
      state.bookInfos = state.bookInfos.map((bookInfo) =>
        bookInfo.filePath === action.payload.filePath
          ? action.payload
          : bookInfo
      );
    },
    setEditTarget: (state, action: PayloadAction<string>) => {
      state.editContext = {
        targetPath: action.payload,
      };
    },
    clearEditTarget: (state) => {
      state.editContext = null;
    },
  },
});

export const { loadBooks, loadBook, setEditTarget, clearEditTarget } =
  booksSlice.actions;

export const selectBooks = (state: RootState) => state.books.bookInfos;

export const selectEditTarget = (state: RootState) =>
  state.books.bookInfos.find(
    (bookInfo) => bookInfo.filePath === state.books.editContext?.targetPath
  );

export default booksSlice.reducer;
