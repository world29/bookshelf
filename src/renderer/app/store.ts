import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "../features/books/booksSlice";

export const store = configureStore({
  reducer: {
    books: booksReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
