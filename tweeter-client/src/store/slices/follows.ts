import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "..";
import { FollowedUser } from "../../core/follows";
import { Handled, User } from "../../core/users";
import { fetchFollows, follow } from "./follows.api";

export type FollowsState = {
  suggestedUsers: User[];
  followedUsers: FollowedUser[];
  loading: Record<string, boolean>;
  error: Record<string, string | undefined>;
};

const initialState: FollowsState = {
  suggestedUsers: [],
  followedUsers: [],
  loading: {},
  error: {},
};

export const fetchFollowsAsync = createAsyncThunk(
  "follows/fetchFollows",
  async () => {
    const response = await fetchFollows();
    return response;
  }
);

export const followAsync = createAsyncThunk(
  "follows/follow",
  async (destination: Handled) => {
    const response = await follow(destination);
    return response;
  }
);

export const followsSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowsAsync.rejected, (state) => {
        state.loading.fetchFollows = false;
      })
      .addCase(fetchFollowsAsync.pending, (state) => {
        state.loading.fetchFollows = true;
      })
      .addCase(fetchFollowsAsync.fulfilled, (state, action) => {
        state.loading.fetchFollows = false;
        state.suggestedUsers = action.payload.suggestedUsers;
        state.followedUsers = action.payload.followedUsers;
      })
      .addCase(followAsync.rejected, (state) => {
        state.loading.follow = false;
      })
      .addCase(followAsync.pending, (state) => {
        state.loading.follow = true;
      })
      .addCase(followAsync.fulfilled, (state, action) => {
        state.loading.follow = false;
        state.suggestedUsers = state.suggestedUsers.filter(
          (u) => u.handle !== action.payload.handle
        );
        state.followedUsers.push(action.payload);
      });
  },
});

export const selectFollows = (state: RootState) => ({
  suggestedUsers: state.follows.suggestedUsers,
  followedUsers: state.follows.followedUsers,
  loading: state.follows.loading.fetchFollows,
});

export const selectFollow = (state: RootState) => ({
  loading: state.follows.loading.follow,
});

export default followsSlice.reducer;
