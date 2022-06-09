import * as React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { Files } from "./features/files/Files";

require("./renderer");

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Files />
    </Provider>
  </React.StrictMode>,
  document.getElementById("app")
);
