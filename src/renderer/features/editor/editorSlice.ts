import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditorState {
  editDialog: {
    isOpen: boolean;
    bookPath: string;
  };
  settingsDialog: {
    isOpen: boolean;
  };
}

const initialState: EditorState = {
  editDialog: {
    isOpen: false,
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
    openEditDialog: (state, action: PayloadAction<string>) => {
      state.editDialog = {
        isOpen: true,
        bookPath: action.payload,
      };
    },
    closeEditDialog: (state) => {
      state.editDialog = {
        isOpen: false,
        bookPath: "",
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

export const {
  openEditDialog,
  closeEditDialog,
  openSettingsDialog,
  closeSettingsDialog,
} = editorSlice.actions;

export default editorSlice.reducer;
