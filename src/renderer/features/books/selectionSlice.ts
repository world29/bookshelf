import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Book } from "../../../models/book";

const initialState: Book[] = [];

export const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    clearSelection: (state) => state.slice(0, 0),
    selectBook: (state, action: PayloadAction<Book>) =>
      state.concat(action.payload),
    deselectBook: (state, action: PayloadAction<Book>) =>
      state.filter((book) => book.path !== action.payload.path),
  },
});

export const removeSelectedBooks = createAction(
  "selection/removeSelectedBooks"
);

export const selectAll = createAction("selection/selectAll");

export const { clearSelection, selectBook, deselectBook } =
  selectionSlice.actions;

export default selectionSlice.reducer;
