import {
    Paper,
    Stack,
    TextField,
    Avatar,
    Box,
    Typography,
    Button
  } from "@mui/material";
  import React, { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { dispatchType, stateType } from "@/lib/store";
  import userImg from "../../../assets/comment_creator.jpg";
  import MoodIcon from "@mui/icons-material/Mood";
  import { addCommentApi } from "@/lib/postSlice";
  import toast from "react-hot-toast";
  import SendIcon from "@mui/icons-material/Send";
  import styles from "./CreateComment.module.css";
  import Picker from "@emoji-mart/react"; // Import emoji picker

  export default function CreateComment({ postId }: { postId: string }) {
    const dispatch = useDispatch<dispatchType>();
    const { user } = useSelector((state: stateType) => state.auth);
    const [commentBody, setCommentBody] = useState("");
    const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false); // State for emoji picker visibility

    const handleEmojiSelect = (emoji: any) => {
        setCommentBody((prev) => prev + emoji.native); // Append emoji to post body
        setEmojiPickerOpen(false); // Close emoji picker
      };
    const handleCreateCommentFunc = (postId: string) => {
        if (!commentBody.trim()) {
          toast.error("Please write something to comment.");
          return;
        }
        dispatch(addCommentApi({ content: commentBody, postId })) // Change 'commentBody' to 'content'
          .unwrap()
          .then(() => {
            toast.success("Comment created successfully");
            setCommentBody("");
          })
          .catch((error) => {
            console.error("Error creating comment:", error);
            toast.error("Failed to create comment.");
          });
      };
      
    return (
      <>
        <Box
          sx={{
            width: "100%",
            px: 1,
            my: 1, position:"relative",
          }}
        >
          <Stack
            sx={{
              display: "flex",
             
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Box sx={{ position: "relative", flexGrow: 1 }}>
              <TextField
                placeholder="Add a comment..."
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                sx={{
                  borderRadius: "5px",
                  width: "100%",
                }}
              />
              <MoodIcon
                sx={{
                  color: "black",
                  fontSize: "24px",
                  position: "absolute",
                  cursor:"pointer",
                  top: "31%",
                  right: "8px",
                  '&:hover':{
                    color:"blue"
                  }
                }}
                onClick={() => setEmojiPickerOpen(!isEmojiPickerOpen)}
              />
            </Box>
            <Button
              sx={{
                backgroundColor: "transparent",
                // border:"1px solid #ccc",
                py:2,
                '&:hover':{
                  color:"blue"
                }
           }}
            //   variant="outlined"
              onClick={() => handleCreateCommentFunc(postId)}
            >
              {/* <SendIcon sx={{ color: "black" }} /> */}
              <svg
                style={{ color: 'black' }}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-send h-4 w-4"
                >
                <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                <path d="m21.854 2.147-10.94 10.939"></path>
              </svg>
            </Button>
            {isEmojiPickerOpen && (
            <Box
              sx={{ position: "absolute", bottom: 40, left: 60, zIndex: 1400 }}
            >
              <Picker onEmojiSelect={handleEmojiSelect} />
            </Box>
            )}
          </Stack>
        </Box>
      </>
    );
  }
  