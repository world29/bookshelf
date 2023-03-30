import { useAppSelector, useAppDispatch } from "../../app/hooks";

import {
  decrement,
  incrementRequested,
  selectError,
  selectIsLoading,
} from "./counterSlice";

export function Counter() {
  // The `state` arg is correctly typed as `RootState` already
  const count = useAppSelector((state) => state.counter.value);
  const loading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  const dispatch = useAppDispatch();

  // omit rendering logic
  return (
    <div>
      {loading ? (
        <div>Now loading...</div>
      ) : (
        <div>
          <p>{count}</p>
          <button onClick={() => dispatch(incrementRequested())}>
            increment
          </button>
          <button onClick={() => dispatch(decrement())}>decrement</button>
        </div>
      )}
      <div>{error ? error.message : "success"}</div>
    </div>
  );
}
