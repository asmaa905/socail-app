"use client";

import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";
import { useFormik } from "formik";
import { handleRegister } from "@/lib/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { dispatchType, stateType } from "@/lib/store";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

export default function register() {
  let validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "name minlength is 3")
      .max(10, "name maxlength is 10")
      .required("name is required"),
    email: Yup.string().email("email is invalid").required("email is required"),
    password: Yup.string()
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{5,}$/,
        "Password must be at least 5 charcters include at least 1 number and at  least 1 charcters  and  mixed of letters, numbers, and special characters"
      )
      .required("Password is required"),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password")], "repassword is not matched")
      .required("repassword is required"),
    gender: Yup.string().required("Gender is required"),
    dateOfBirth: Yup.date()
      .required("Date of birth is required")
      .max(new Date(), "Date of birth cannot be in the future"),
  });
  let router = useRouter();
  let dispatch = useDispatch<dispatchType>();
  let { isRegisterLoading, registerError, isRegisterError } = useSelector(
    (state: stateType) => state.auth
  );
  let registerFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
      name: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values: {
      email: string;
      password: string;
      name: string;
      rePassword: string;
      dateOfBirth: string;
      gender: string;
    }) => {
      dispatch(handleRegister(values))
        .then((res) => {
          console.log(res);
          if (res.payload.data) {
            toast.success("crrate acconut successfully !");
            router.push("/login");
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
      <Container maxWidth="sm" sx={{ my: 3 }}>
        <Paper elevation={10} sx={{ p: 4 }}>
          <Typography sx={{ mb: 2 }} variant="h6" color="#1976d2">
            Register Now
          </Typography>
          <form action="" onSubmit={registerFormik.handleSubmit}>
            {isRegisterError && registerError ? (
              <Box
                sx={{
                  padding: 4,
                  mb: 4,
                  borderRadius: "5px",
                  fontSize: "16px",
                  color: "black",
                  background: "tomato",
                }}
              >
                {registerError}
              </Box>
            ) : null}
            <TextField
              value={registerFormik.values.name}
              onChange={registerFormik.handleChange}
              name="name"
              type="text"
              sx={{ mb: 2 }}
              fullWidth
              id="name"
              label="name"
              variant="outlined"
            />
            {registerFormik.errors.name && registerFormik.touched.name ? (
              <div
                className="my-2 p-4 mb-4 text-sm text-[#58151c] border border-[#f1aeb5] rounded-lg bg-[#f8d7da] "
                role="alert"
              >
                {registerFormik.errors.name}
              </div>
            ) : null}
            <TextField
              value={registerFormik.values.email}
              onChange={registerFormik.handleChange}
              name="email"
              type="email"
              sx={{ mb: 2 }}
              fullWidth
              id="email"
              label="email"
              variant="outlined"
            />
            {registerFormik.errors.email && registerFormik.touched.email ? (
              <div
                className="my-2 p-4 mb-4 text-sm text-[#58151c] border border-[#f1aeb5] rounded-lg bg-[#f8d7da] "
                role="alert"
              >
                {registerFormik.errors.email}
              </div>
            ) : null}
            <TextField
              value={registerFormik.values.password}
              onChange={registerFormik.handleChange}
              name="password"
              type="password"
              sx={{ mb: 2 }}
              fullWidth
              id="password"
              label="password"
              variant="outlined"
            />
            {registerFormik.errors.password &&
            registerFormik.touched.password ? (
              <div className="my-2 p-4 mb-4 text-sm text-[#58151c] border border-[#f1aeb5] rounded-lg bg-[#f8d7da] ">
                {registerFormik.errors.password}
              </div>
            ) : null}
            <TextField
              value={registerFormik.values.rePassword}
              onChange={registerFormik.handleChange}
              name="rePassword"
              type="password"
              sx={{ mb: 2 }}
              fullWidth
              id="rePassword"
              label="rePassword"
              variant="outlined"
            />
            {registerFormik.errors.rePassword &&
            registerFormik.touched.rePassword ? (
              <div className="my-2 p-4 mb-4 text-sm text-[#58151c] border border-[#f1aeb5] rounded-lg bg-[#f8d7da] ">
                {registerFormik.errors.rePassword}
              </div>
            ) : null}
            <TextField
              value={registerFormik.values.dateOfBirth}
              onChange={registerFormik.handleChange}
              name="dateOfBirth"
              type="date"
              sx={{ mb: 2 }}
              fullWidth
              id="dateOfBirth"
              // label="dateOfBirth"
              variant="outlined"
            />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Gender
              </Typography>
              <RadioGroup
                row
                name="gender"
                value={registerFormik.values.gender}
                onChange={registerFormik.handleChange}
              >
                <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
              {registerFormik.errors.gender && registerFormik.touched.gender ? (
                <div className="my-2 p-4 mb-4 text-sm text-[#58151c] border border-[#f1aeb5] rounded-lg bg-[#f8d7da] ">
                  {registerFormik.errors.gender}
                </div>
              ) : null}
            </Box>

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
              {isRegisterLoading ? <CircularProgress size="30px" /> : "Sign Up"}
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
}
