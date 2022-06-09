import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface FilesState {
  paths: string[];
}

const initialState: FilesState = {
  paths: ["hoge", "fuga", "foo", "bar"],
};

export const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    addFilePath: (state, action: PayloadAction<string>) => {
      state.paths.push(action.payload);
    },
  },
});

export const { addFilePath } = filesSlice.actions;

export const selectFiles = (state: RootState) => state.files.paths;

export default filesSlice.reducer;
