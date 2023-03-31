import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Book } from "../../../models/book";

const initialState: Book[] = [];

export const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    bookPropertiesUpdated: (state, action: PayloadAction<Book>) =>
      state.map((book) =>
        book.path === action.payload.path ? action.payload : book
      ),
    booksFetched: (state, action: PayloadAction<Book[]>) => action.payload,
  },
});

export const { bookPropertiesUpdated, booksFetched } = booksSlice.actions;

export const fetchBooks = createAction("books/fetchBooks");

export const setTitle = createAction<{ path: string; title: string }>(
  "books/setTitle"
);

export default booksSlice.reducer;
