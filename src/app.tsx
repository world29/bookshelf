import * as React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { Files } from "./features/files/Files";

require("./renderer");

const container = document.getElementById("app");
if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <Files />
      </Provider>
    </React.StrictMode>
  );
}
