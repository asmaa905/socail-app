"use client";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import MoodIcon from "@mui/icons-material/Mood";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Picker from "@emoji-mart/react"; // Import emoji picker
import userImg from "../../../../assets/comment_creator.jpg";
import CollectionsIcon from "@mui/icons-material/Collections";
import styles from "./postPopUp.module.css";

import { dispatchType, stateType } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { addPost, addPostApi, index } from "@/lib/postSlice";
import { PostData } from "@/app/interfaces/postDate";
import Post from "../Post";

export default function PostPopup({
  onClose,
  isPostShared,
  postShared,
}: {
  onClose: () => void;
  postShared?: PostData;
  isPostShared?: boolean;
}) {
  const { user } = useSelector((state: stateType) => state.auth);
  const [postBody, setPostBody] = useState("");
  const [imgPost, setImgPost] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState("");
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false); // State for emoji picker visibility

  //   let { allPosts, isLoading } = useSelector((state: stateType) => state.posts);

  let dispatch = useDispatch<dispatchType>();
  const handlePostBody = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostBody(e.target.value);
  };

  const handlePostImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImgPost(file);
      setImgSrc(URL.createObjectURL(file));
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setPostBody((prev) => prev + emoji.native); // Append emoji to post body
    setEmojiPickerOpen(false); // Close emoji picker
  };
  const createPostFunc = () => {
    if ((!postBody.trim() && !imgPost) || (!postShared && isPostShared)) {
      toast.error("Please write something or add an image.");
      return;
    }

    const finalPostBody =
      isPostShared && postShared
        ? `${postBody}shared_post_id:${JSON.stringify(postShared._id)}`
        : postBody;

    dispatch(addPostApi({ postBody: finalPostBody, imgPost }))
      .unwrap()
      .then(() => {
        toast.success("Post created successfully");
        setPostBody("");
        setImgPost(null);
        setImgSrc("");
        onClose();
      })
      .catch((error) => {
        console.error("Error creating post:", error);
        toast.error("Failed to create post.");
      });
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1300,
      }}
    >
      <Paper
        sx={{
          width: 500,
          p: 3,
          borderRadius: "15px",
          position: "relative",
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar
            src={user ? user.photo :userImg.src as unknown as string}
            alt="user"
            sx={{ width: "50px", height: "50px" }}
          />
          <Typography variant="h6" fontWeight="bold">
            {user ? user.name : "Unknown User"}
          </Typography>
        </Stack>
        <TextField
          value={postBody}
          className={styles.muiTextField}
          placeholder="What's on your mind?"
          multiline
          rows={4}
          sx={{
            "&:focus": {
              outline: "none",
              border: "none",
            },
          }}
          onChange={handlePostBody}
          fullWidth
        />
        {isPostShared && postShared ? (
          // <Box >
          <Post
            inPostCreation={true}
            post={postShared}
            showAllComments={false}
            showSharedpostInPostDisplay={false}
          />
        ) : // </Box>
        null}
        {imgSrc && (
          <Box sx={{ mb: 2 }}>
            <img
              src={imgSrc}
              alt="Preview"
              style={{ width: "100%", borderRadius: "10px" }}
            />
            <Button
              onClick={() => {
                setImgSrc("");
                setImgPost(null);
              }}
              color="secondary"
            >
              Remove Image
            </Button>
          </Box>
        )}
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          sx={{
            mb: 2,
            position: "relative",
            border: "1px solid #ccc",
            borderRadius: "10px",
            mt: "5px",
          }}
        >
          <Button
            startIcon={<MoodIcon sx={{ color: "orange", fontSize: "24px" }} />}
            sx={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#000",
              textTransform: "capitalize",
            }}
            onClick={() => setEmojiPickerOpen(!isEmojiPickerOpen)}
          >
            Feeling/Activity
          </Button>
          {!isPostShared ? (
            <Button
              component="label"
              startIcon={
                <CollectionsIcon sx={{ color: "green", fontSize: "24px" }} />
              }
              variant="text"
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "#000",
                textTransform: "capitalize",
              }}
            >
              Photo
              <VisuallyHiddenInput type="file" onChange={handlePostImage} />
            </Button>
          ) : null}
          {isEmojiPickerOpen && (
            <Box
              sx={{ position: "absolute", bottom: 50, left: 10, zIndex: 1400 }}
            >
              <Picker onEmojiSelect={handleEmojiSelect} />
            </Box>
          )}
        </Stack>
        <Button
          onClick={createPostFunc}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ borderRadius: "30px", fontSize: "16px" }}
        >
          Post
        </Button>
      </Paper>
    </Box>
  );
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});
