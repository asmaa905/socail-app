import { Box, Typography } from "@mui/material";
import React from "react";

export default function Footer() {
  return (
    <Box
      sx={{
        background: "#1976d2",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{ mb: 2, textAlign: "center", mt: "1rem" }}
        variant="h6"
        color="#fff"
      >
        {" "}
        Copyright © Kalmne 2024
      </Typography>
    </Box>
  );
}
