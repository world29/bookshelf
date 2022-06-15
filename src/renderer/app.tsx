import * as React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { store } from "./app/store";
import { BooksPage } from "./features/books/BooksPage";

const container = document.getElementById("app");
if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BooksPage />
      </Provider>
    </React.StrictMode>
  );
}
