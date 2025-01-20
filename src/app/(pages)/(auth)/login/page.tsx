"use client";

import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import React from "react";
import { useFormik } from "formik";
import { handleLogin } from "@/lib/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { dispatchType, stateType } from "@/lib/store";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
export default function login() {
  let router = useRouter();
  let dispatch = useDispatch<dispatchType>();
  let { token, isLoginLoading } = useSelector((state: stateType) => state.auth);
  let loginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values: { email: string; password: string }) => {
      dispatch(handleLogin(values))
        .then((res) => {
          console.log(res);
          if (res.payload.data) {
            toast.success("welcome back!");
            router.push("/");
          } else {
            toast.error("Incorrect Email or Password");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });
  return (
    <>
      <Container maxWidth="sm" sx={{ my: 3, height: "600px" }}>
        <Paper elevation={10} sx={{ p: 4 }}>
          <Typography sx={{ mb: 2 }} variant="h6" color="#1976d2">
            Login Now
          </Typography>
          <form action="" onSubmit={loginFormik.handleSubmit}>
            <TextField
              value={loginFormik.values.email}
              onChange={loginFormik.handleChange}
              name="email"
              type="email"
              sx={{ mb: 2 }}
              fullWidth
              id="email"
              label="email"
              variant="outlined"
            />
            <TextField
              value={loginFormik.values.password}
              onChange={loginFormik.handleChange}
              name="password"
              type="password"
              sx={{ mb: 2 }}
              fullWidth
              id="password"
              label="password"
              variant="outlined"
            />
            <Button
              type="submit"
              fullWidth
              sx={{
                bgcolor: "#1976d2",
                color: "white",
                ":hover": {
                  bgcolor: "white",
                  color: "#1976d2",
                  border: "1px solid #1976d2",
                },
              }}
            >
              {isLoginLoading ? <CircularProgress size="30px" /> : "Login"}
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
}
