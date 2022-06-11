import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { FileInfo } from "../../../lib/file";
import { RootState } from "../../app/store";

export interface FilesState {
  fileInfos: FileInfo[];
}

const initialState: FilesState = {
  fileInfos: [],
};

export const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<FileInfo>) => {
      state.fileInfos.push(action.payload);
    },
  },
});

export const { addFile } = filesSlice.actions;

export const selectFiles = (state: RootState) => state.files.fileInfos;

export default filesSlice.reducer;
