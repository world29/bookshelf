import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

// Define a type for the slice state
interface CounterState {
  value: number;
  loading: boolean;
  error: null | { message: string };
}

// Define the initial state using that type
const initialState: CounterState = {
  value: 0,
  loading: false,
  error: null,
};

export const counterSlice = createSlice({
  name: "counter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    incrementRequested: (state) => {
      state.loading = true;
    },
    incrementSuccess: (state) => {
      state.loading = false;
      state.value += 1;
      state.error = null;
    },
    incrementFailed: (state, action: PayloadAction<{ message: string }>) => {
      state.loading = false;
      state.error = { message: action.payload.message };
    },
  },
});

export const {
  increment,
  decrement,
  incrementByAmount,
  incrementRequested,
  incrementSuccess,
  incrementFailed,
} = counterSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.counter.value;
export const selectIsLoading = (state: RootState) => state.counter.loading;
export const selectError = (state: RootState) => state.counter.error;

export default counterSlice.reducer;
