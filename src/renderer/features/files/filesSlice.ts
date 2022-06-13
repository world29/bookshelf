import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { BookInfo } from "../../../lib/file";
import { RootState } from "../../app/store";

export interface BooksState {
  bookInfos: BookInfo[];
}

const initialState: BooksState = {
  bookInfos: [],
};

export const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    loadBooks: (state, action: PayloadAction<BookInfo[]>) => {
      state.bookInfos = action.payload;
    },
  },
});

export const { loadBooks } = filesSlice.actions;

export const selectBooks = (state: RootState) => state.files.bookInfos;

export default filesSlice.reducer;
