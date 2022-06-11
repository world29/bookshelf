import { store } from "./app/store";
import { addFile } from "./features/files/filesSlice";

window.electronAPI.onFileAdded((_event, fileInfo) => {
  store.dispatch(addFile(fileInfo));
});

require("./app");
