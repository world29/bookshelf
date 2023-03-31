import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Book } from "../../../models/book";
import { RootState } from "../../app/store";

const initialState: Book[] = [];

export const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    bookUpdated: (state, action: PayloadAction<Book>) =>
      state.map((book) =>
        book.path === action.payload.path ? action.payload : book
      ),
    booksFetched: (state, action: PayloadAction<Book[]>) => action.payload,
  },
});

export const { bookUpdated, booksFetched } = booksSlice.actions;

export const fetchBooks = createAction("books/fetchBooks");

export const updateBook = createAction<{
  path: string;
  title: string;
  author: string;
}>("books/updateBook");

export const selectBook = (path: string) => (state: RootState) =>
  state.books.find((book) => book.path === path);

export default booksSlice.reducer;
