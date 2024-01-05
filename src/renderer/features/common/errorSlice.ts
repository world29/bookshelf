import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ErrorState {
  errorMessage: string;
  isDialogOpen: boolean;
}

const initialState: ErrorState = {
  errorMessage: "",
  isDialogOpen: false,
};

export const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    openErrorDialog: (state, action: PayloadAction<string>) => {
      // MEMO: state オブジェクトそのものを書き換えると更新されないので注意 (以下は NG)
      // state = { errorMessage:"hoge", isDialogOpen:true }
      state.errorMessage = action.payload;
      state.isDialogOpen = true;
    },
    closeErrorDialog: (state) => {
      state.isDialogOpen = false;
    },
  },
});

export const { openErrorDialog, closeErrorDialog } = errorSlice.actions;

export default errorSlice.reducer;
