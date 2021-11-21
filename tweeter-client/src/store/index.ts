import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import feedReducer from "./slices/feed";
import followReducer from "./slices/follows";
import userReducer from "./slices/user";

export const store = configureStore({
  reducer: {
    feed: feedReducer,
    follows: followReducer,
    user: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
