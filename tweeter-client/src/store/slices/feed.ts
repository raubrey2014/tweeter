import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "..";
import { Post } from "../../core/feed";
import { createPost, fetchFeed } from "./feed.api";

export type FeedState = {
  posts: Post[];
  loading: Record<string, boolean>;
  error: Record<string, string | undefined>;
};

const initialState: FeedState = {
  posts: [],
  loading: {
    fetch: true,
  },
  error: {},
};

export const fetchFeedAsync = createAsyncThunk("feed/fetch", async () => {
  const response = await fetchFeed();
  return response;
});

export const createPostAsync = createAsyncThunk(
  "feed/createPost",
  async (text: string) => {
    const response = await createPost(text);
    return response;
  }
);

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedAsync.rejected, (state) => {
        state.loading.fetch = false;
      })
      .addCase(fetchFeedAsync.pending, (state) => {
        state.loading.fetch = true;
      })
      .addCase(fetchFeedAsync.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.posts = action.payload.posts;
      })
      .addCase(createPostAsync.rejected, (state) => {
        state.loading.createPost = false;
      })
      .addCase(createPostAsync.pending, (state) => {
        state.loading.createPost = true;
      })
      .addCase(createPostAsync.fulfilled, (state, action) => {
        state.loading.createPost = false;
        state.posts.push(action.payload);
      });
  },
});

export const selectFeed = (state: RootState) => ({
  posts: state.feed.posts,
  loading: state.feed.loading.fetch,
});

export const selectCreatePost = (state: RootState) => ({
  loading: state.feed.loading.createPost,
});

export default feedSlice.reducer;
