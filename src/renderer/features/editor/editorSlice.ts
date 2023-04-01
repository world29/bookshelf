import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditorState {
  isEditing: boolean;
  bookPath: string;
  isAdding: boolean;
}

const initialState: EditorState = {
  isEditing: false,
  bookPath: "",
  isAdding: false,
};

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    beginEdit: (state, action: PayloadAction<string>) => {
      state.isEditing = true;
      state.bookPath = action.payload;
    },
    endEdit: (state) => {
      state.isEditing = false;
    },
    beginAdd: (state) => {
      state.isAdding = true;
    },
    endAdd: (state) => {
      state.isAdding = false;
    },
  },
});

export const { beginEdit, endEdit, beginAdd, endAdd } = editorSlice.actions;

export default editorSlice.reducer;
