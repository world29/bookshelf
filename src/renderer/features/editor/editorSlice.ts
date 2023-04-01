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
    beginEdit: (state, action: PayloadAction<string>) => {
      state.editDialog = {
        isOpen: true,
        bookPath: action.payload,
      };
    },
    endEdit: (state) => {
      state.editDialog = {
        isOpen: false,
        bookPath: "",
      };
    },
    beginAdd: (state) => {
      state.addDialog.isOpen = true;
    },
    endAdd: (state) => {
      state.addDialog.isOpen = false;
    },
  },
});

export const { beginEdit, endEdit, beginAdd, endAdd } = editorSlice.actions;

export default editorSlice.reducer;
