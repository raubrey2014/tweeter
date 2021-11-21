import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "..";
import { CreateUserDto, User } from "../../core/users";
import { fetchUser, requestSignin, signup } from "./user.api";

export type UserState = {
  currentUser?: User;
  signinRequested: boolean;
  loading: Record<string, boolean>;
  error: Record<string, string | undefined>;
};

const initialState: UserState = {
  currentUser: undefined,
  signinRequested: false,
  loading: {
    fetch: true,
  },
  error: {},
};

export const fetchUserAsync = createAsyncThunk("user/fetchUser", async () => {
  const response = await fetchUser();
  return response;
});

export const signUpUserAsync = createAsyncThunk(
  "user/signup",
  async (values: CreateUserDto) => {
    const response = await signup(values);
    return response;
  }
);

export const requestSigninAsync = createAsyncThunk(
  "user/signin",
  async (handle: string) => {
    const response = await requestSignin(handle);
    return response;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = undefined;
      window.localStorage.removeItem("auth:me");
      window.location.reload();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAsync.rejected, (state) => {
        state.loading.fetch = false;
      })
      .addCase(fetchUserAsync.pending, (state) => {
        state.loading.fetch = true;
      })
      .addCase(fetchUserAsync.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.currentUser = action.payload;
      })
      .addCase(signUpUserAsync.rejected, (state, action) => {
        state.loading.signup = false;
        state.error.signup = action.error.message;
      })
      .addCase(signUpUserAsync.fulfilled, (state, action) => {
        state.loading.signup = false;
        state.currentUser = action.payload;
        window.localStorage.setItem("auth:me", action.payload.handle);
      })
      .addCase(signUpUserAsync.pending, (state) => {
        state.loading.signup = true;
        state.error.signup = undefined;
      })
      .addCase(requestSigninAsync.rejected, (state, action) => {
        state.signinRequested = false;
        state.loading.signin = false;
        state.error.signin = action.error.message;
      })
      .addCase(requestSigninAsync.fulfilled, (state) => {
        state.loading.signin = false;
        state.signinRequested = true;
      })
      .addCase(requestSigninAsync.pending, (state) => {
        state.signinRequested = false;
        state.loading.signin = true;
        state.error.signin = undefined;
      });
  },
});

export const { logout } = userSlice.actions;

export const selectCurrentUser = (state: RootState) => ({
  user: state.user.currentUser,
  loading: state.user.loading.fetch,
});

export const selectSignup = (state: RootState) => ({
  loading: state.user.loading.signup,
  error: state.user.error.signup,
});

export const selectSignin = (state: RootState) => ({
  loading: state.user.loading.signup,
  error: state.user.error.signup,
});

export default userSlice.reducer;
