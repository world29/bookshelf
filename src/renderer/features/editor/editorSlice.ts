import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditorState {
  isEditing: boolean;
  bookPath: string;
}

const initialState: EditorState = {
  isEditing: false,
  bookPath: "",
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
  },
});

export const { beginEdit, endEdit } = editorSlice.actions;

export default editorSlice.reducer;
