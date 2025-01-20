import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

let token = localStorage.getItem("token");
// Delete Comment
export const deleteCommentApi = createAsyncThunk(
    "post/deleteComment",
    async (commentId: string, { rejectWithValue }) => {
      try {
        const response = await axios.delete(
          `https://linked-posts.routemisr.com/comments/${commentId}`,
          {
            headers: { token },
          }
        );
        return { commentId, message: response.data.message };
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete comment.");
      }
    }
  );
  
  // Edit Comment
  export const editCommentApi = createAsyncThunk(
    "post/editComment",
    async (
      { commentId, content }: { commentId: string; content: string },
      { rejectWithValue }
    ) => {
      try {
        const response = await axios.put(
          `https://linked-posts.routemisr.com/comments/${commentId}`,
          { content },
          {
            headers: { token },
          }
        );
        return { commentId, content: response.data.updatedComment.content };
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to edit comment.");
      }
    }
  );
  
//   interface PostState {
//   allPosts: PostData[] | null;
//   currentPost: PostData | null;
//   isLoading: boolean;
//   isError: boolean;
//   error: string | null;
// }

// const initialState: PostState = {
//   allComments: null,
//   currentComment: null,
//   isLoading: false,
//   isError: false,
//   error: null,
// };

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: { },
  extraReducers: (builder) => {
    builder
    .addCase(deleteCommentApi.fulfilled, (state, action) => {
      const { commentId } = action.payload;
      state.allPosts?.forEach((post) => {
        post.comments = post.comments.filter(
          (comment) => comment._id !== commentId
        );
      });
    })
    .addCase(editCommentApi.fulfilled, (state, action) => {
      const { commentId, content } = action.payload;
      state.allPosts?.forEach((post) => {
        post.comments.forEach((comment) => {
          if (comment._id === commentId) {
            comment.content = content;
          }
        });
      });
    });
},
});

export const postReducer = postSlice.reducer;
