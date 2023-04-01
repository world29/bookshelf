import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditorState {
  editDialog: {
    isOpen: boolean;
    bookPath: string;
  };
  addDialog: {
    isOpen: boolean;
  };
}

const initialState: EditorState = {
  editDialog: {
    isOpen: false,
    bookPath: "",
  },
  addDialog: {
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
    openAddDialog: (state) => {
      state.addDialog.isOpen = true;
    },
    closeAddDialog: (state) => {
      state.addDialog.isOpen = false;
    },
  },
});

export const {
  openEditDialog,
  closeEditDialog,
  openAddDialog,
  closeAddDialog,
} = editorSlice.actions;

export default editorSlice.reducer;
