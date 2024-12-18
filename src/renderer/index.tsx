﻿import * as React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import store from "./app/store";
import App from "./components/App";
import "./styles/index.css";

const container = document.getElementById("app");
if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}
