import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditorState {
  editDialog: {
    isOpen: boolean;
    bookPath: string;
  };
}

const initialState: EditorState = {
  editDialog: {
    isOpen: false,
    bookPath: "",
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
  },
});

export const { openEditDialog, closeEditDialog } = editorSlice.actions;

export default editorSlice.reducer;
