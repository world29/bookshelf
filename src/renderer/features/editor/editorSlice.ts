import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditorState {
  bookEdit: {
    bookPath: string;
  };
  settingsDialog: {
    isOpen: boolean;
  };
}

const initialState: EditorState = {
  bookEdit: {
    bookPath: "",
  },
  settingsDialog: {
    isOpen: false,
  },
};

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setBookPathToEdit: (state, action: PayloadAction<string>) => {
      state.bookEdit = {
        bookPath: action.payload,
      };
    },
    openSettingsDialog: (state) => {
      state.settingsDialog.isOpen = true;
    },
    closeSettingsDialog: (state) => {
      state.settingsDialog.isOpen = false;
    },
  },
});

export const { setBookPathToEdit, openSettingsDialog, closeSettingsDialog } =
  editorSlice.actions;

export default editorSlice.reducer;
