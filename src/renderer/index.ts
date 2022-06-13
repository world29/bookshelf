import { store } from "./app/store";
import { loadBooks } from "./features/files/filesSlice";

window.electronAPI.onBookAdded(() => {
  window.electronAPI
    .getBooks()
    .then((bookInfos) => store.dispatch(loadBooks(bookInfos)));
});

require("./app");
