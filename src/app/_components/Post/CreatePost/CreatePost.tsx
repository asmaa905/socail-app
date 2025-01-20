import {
  Paper,
  Stack,
  TextField,
  Avatar,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import React, { useState } from "react";
import PostPopup from "./../postPopup/postPopup";
import { useDispatch, useSelector } from "react-redux";
import { dispatchType, stateType } from "@/lib/store";
import userImg from "../../../../assets/comment_creator.jpg";
import MoodIcon from "@mui/icons-material/Mood";
import CollectionsIcon from "@mui/icons-material/Collections";

export default function CreatePost() {
  const dispatch = useDispatch<dispatchType>();
  const { user } = useSelector((state: stateType) => state.auth);
  const [openPostPopup, setOpenPostPopup] = useState(false);

  const handlePostPopup = () => {
    setOpenPostPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPostPopup(false);
  };

  return (
    <>
      <Paper
        sx={{
          width: "100%",
          py: 2,
          px: 3,
          my: 3,
        }}
        onClick={handlePostPopup}
      >
        <Stack
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <Avatar
            src={user ? user.photo :userImg.src as unknown as string}
            alt="user"
            sx={{ width: "50px", height: "50px" }}
          />
          <TextField
            placeholder={`What's on your mind, ${user ? user.name : "user"}?`}
            sx={{
              flexGrow: 1,
              background: "rgb(240, 242, 245)",
              borderRadius: "5px",
              "& .MuiOutlinedInput-root": {
                border: "none",
                borderRadius: "5px",
                "& fieldset": {
                  border: "none",
                },
              },
              "& .MuiInputBase-input": {
                padding: "10px 16px",
              },
              cursor: "pointer",
            }}
            InputProps={{
              readOnly: true,
            }}
          />
        </Stack>
        <Divider variant="middle" sx={{ my: 2 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              // cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.05)",
                borderRadius: "8px",
                padding: "4px",
              },
            }}
          >
            <MoodIcon sx={{ color: "orange", fontSize: "24px" }} />
            <Typography
              sx={{ fontSize: "14px", fontWeight: "bold", color: "#000" }}
            >
              Feeling/Activity
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              // cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.05)",
                borderRadius: "8px",
                padding: "4px",
              },
            }}
          >
            <CollectionsIcon sx={{ color: "green", fontSize: "24px" }} />
            <Typography
              sx={{ fontSize: "14px", fontWeight: "bold", color: "#000" }}
            >
              Photo
            </Typography>
          </Box>
        </Box>
      </Paper>
      {openPostPopup && <PostPopup onClose={handleClosePopup} />}
    </>
  );
}
