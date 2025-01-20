import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { postReducer } from "./postSlice";

export let store = configureStore({
    //slices
    reducer:{
        auth: authReducer,
        posts:postReducer,
    }
})
export type AppDispatch = typeof store.dispatch;

export type stateType  = ReturnType<typeof store.getState>
export type dispatchType  = typeof store.dispatch