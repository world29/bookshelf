import { createSlice } from "@reduxjs/toolkit";

interface EditorState {
  settingsDialog: {
    isOpen: boolean;
  };
}

const initialState: EditorState = {
  settingsDialog: {
    isOpen: false,
  },
};

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    openSettingsDialog: (state) => {
      state.settingsDialog.isOpen = true;
    },
    closeSettingsDialog: (state) => {
      state.settingsDialog.isOpen = false;
    },
  },
});

export const { openSettingsDialog, closeSettingsDialog } = editorSlice.actions;

export default editorSlice.reducer;
