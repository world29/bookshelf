import { store } from "../app/store";
import { addFilePath } from "../features/files/filesSlice";

window.electronAPI.onFileAdded((event, files) => {
  files.forEach((filePath) => store.dispatch(addFilePath(filePath)));
});
