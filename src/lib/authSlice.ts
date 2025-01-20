import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AppDispatch } from "./store"; // Replace with the actual path to your Redux store
export let handleLogin = createAsyncThunk(
  "auth/login",
  async (formData: { email: string; password: string }) => {
    return await axios
      .post("https://linked-posts.routemisr.com/users/signin", formData)
      .then((res) => res)
      .catch((error) => error);
  }
);

export let handleRegister = createAsyncThunk(
  "auth/register",
  async (formData: {
    email: string;
    password: string;
    rePassword: string;
    dateOfBirth: string;
    gender: string;
    name: string;
  }) => {
    return await axios
      .post("https://linked-posts.routemisr.com/users/signup", formData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        return err;
      });
  }
);

export let getUserData = createAsyncThunk(
  "auth/getUserData",
  async (token: string | null) => {
    return await axios
      .get("https://linked-posts.routemisr.com/users/profile-data", {
        headers: token
          ? { token } // Include the token only if it's a valid string
          : undefined, // Omit the headers if token is null/undefined
      })
      .then((res) => res)
      .catch((error) => error);
  }
);

let initialState: {
  token: string | null;
  user: any;
  isLoginError: boolean;
  loginError: string | null;
  isLoginLoading: boolean;
  isRegisterLoading: boolean;
  isRegisterError: boolean;
  registerError: string | null;
  isGetUserLoading: boolean;
  isGetUserError: boolean;
  getUserError: string | null;

} = {
  token: localStorage.getItem("token") || null,
  user: null,
  isLoginLoading: false,
  isLoginError: false,
  loginError: null,
  isRegisterLoading: false,
  isRegisterError: false,
  registerError: null,
  isGetUserLoading :false,
  isGetUserError:false,
  getUserError : null,
};

let authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Logout function
    handleLogout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      console.log("User logged out");
    },
  },
  extraReducers: function (builder) {
    builder.addCase(handleLogin.fulfilled, (state, action: any) => {
      state.token = action?.payload?.data?.token;
      localStorage.setItem("token", action?.payload?.data?.token);
  
      state.isLoginLoading = false;
      state.isLoginError = false;
      state.loginError = null;
  
      const dispatch: AppDispatch = action.meta.arg.dispatch;
      dispatch(getUserData( action?.payload?.data?.token));
    });
  
    builder.addCase(handleLogin.rejected, (state, action: any) => {
      console.log("rejected");
      state.isLoginLoading = false;
      state.isLoginError = true;
      state.loginError = "error";
    });
    builder.addCase(handleLogin.pending, (state, action: any) => {
      console.log("pending");
      state.isLoginLoading = true;
    });

    // Register
    builder.addCase(handleRegister.fulfilled, (state, action: any) => {
      state.isRegisterLoading = false;
      state.isRegisterError = false;
      state.registerError = null;
    });
    builder.addCase(handleRegister.rejected, (state, action: any) => {
      state.isRegisterLoading = false;
      state.isRegisterError = true;
      state.registerError = action?.error?.message || "An error occurred";
    });
    builder.addCase(handleRegister.pending, (state, action: any) => {
      state.isRegisterLoading = true;
    });

     //get user data
     builder.addCase(getUserData.fulfilled, (state, action: any) => {
      state.user = action?.payload?.data?.user;
      console.log("action?.payload?.data",action?.payload?.data?.user)
      state.isGetUserLoading = false;
      state.isGetUserError = false;
      state.getUserError = null;
    });
  
    builder.addCase(getUserData.rejected, (state, action: any) => {
      state.isGetUserLoading = false;
      state.isGetUserError = true;
      state.getUserError = action?.error?.message || "Failed to fetch user data.";
    });
  
    builder.addCase(getUserData.pending, (state) => {
      state.isGetUserLoading = true;
    });

  },
});

export const { handleLogout } = authSlice.actions;
export const authReducer = authSlice.reducer;
