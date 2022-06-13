import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { BookInfo } from "../../../lib/book";
import { RootState } from "../../app/store";

export interface BooksState {
  bookInfos: BookInfo[];
}

const initialState: BooksState = {
  bookInfos: [],
};

export const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    loadBooks: (state, action: PayloadAction<BookInfo[]>) => {
      state.bookInfos = action.payload;
    },
  },
});

export const { loadBooks } = booksSlice.actions;

export const selectBooks = (state: RootState) => state.books.bookInfos;

export default booksSlice.reducer;
