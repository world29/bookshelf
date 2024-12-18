﻿import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Book } from "../../../models/book";
import { RootState } from "../../app/store";

const initialState: Book[] = [];

export const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    bookUpdated: (state, action: PayloadAction<Book>) =>
      state.map((book) =>
        book.path === action.payload.path
          ? { thumbHash: Date.now().toString(), ...action.payload }
          : book
      ),
    booksFetched: (state, action: PayloadAction<Book[]>) => action.payload,
    bookAdded: (state, action: PayloadAction<Book>) =>
      state.concat(action.payload),
    booksAdded: (state, action: PayloadAction<Book[]>) =>
      state.concat(...action.payload),
    bookRemoved: (state, action: PayloadAction<string>) =>
      state.filter((book) => book.path !== action.payload),
  },
});

export const { bookUpdated, booksFetched, bookAdded, booksAdded, bookRemoved } =
  booksSlice.actions;

export const fetchBooks = createAction("books/fetchBooks");

export const updateBook = createAction<{
  path: string;
  title: string;
  author: string;
}>("books/updateBook");

export const addBook = createAction<{
  path: string;
}>("books/addBook");

export const addBooks = createAction<{
  filePaths: string[];
}>("books/addBooks");

export const removeBook = createAction<{
  path: string;
}>("books/removeBook");

export const createBookThumbnail = createAction<{
  path: string;
}>("books/createBookThumbnail");

export const createBookThumbnailAll = createAction(
  "books/createBookThumbnailAll"
);

export const updateBookRating = createAction<{
  path: string;
  rating: number;
}>("books/updateBookRating");

export default booksSlice.reducer;
