import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// import { PostData } from "@/app/interfaces/postData";
import { PostData } from '@/app/interfaces/postDate';

let token = localStorage.getItem("token");

export const index = createAsyncThunk("post/allPost", async (limit?: number) => {
  try {
    const response = await axios.get(
      `https://linked-posts.routemisr.com/posts?limit=${limit || 50}`,
      {
        headers: { token },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch posts.");
  }
});

export const getSinglePost = createAsyncThunk(
  "post/singlePost",
  async (id: string) => {
    try {
      const response = await axios.get(
        `https://linked-posts.routemisr.com/posts/${id}`,
        {
          headers: { token },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch single post.");
    }
  }
);

export const addPostApi = createAsyncThunk(
    "post/addPostApi",
    async (
      { postBody, imgPost }: { postBody: string; imgPost: File | null },
      { dispatch, getState, rejectWithValue }
    ) => {
      const state: any = getState(); 
      const currentUser = state.auth.user; 
  
      if (!currentUser) {
        return rejectWithValue("User not logged in.");
      }
  
      const formData = new FormData();
      formData.append("body", postBody);
      if (imgPost) {
        formData.append("image", imgPost);
      }
      try {
        const response = await axios.post(
          "https://linked-posts.routemisr.com/posts",
          formData,
          {
            headers: { token },
          }
        );
        // Dispatch to add the new post to the state
        dispatch(
          addPost({
            _id: response?.data?.post?._id || "55555555",
            body: postBody,
            image:  response?.data?.post?.image || "",
            user: {
              _id: currentUser._id,
              name: currentUser.name,
              photo: currentUser.photo,
            },
            createdAt:  response?.data?.post?.createdAt || new Date().toISOString(),
            comments: [],
          })
        );
        return response;
      } catch (error: any) {
        return rejectWithValue(error.message || "Failed to add post.");
      }
    }
  );
  // Add Comment
  export const addCommentApi = createAsyncThunk(
    "comment/addComment",
    async ({ postId, content }: { postId: string; content: string }, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          `https://linked-posts.routemisr.com/comments`,
          {
            content:content,
            post:postId
        },
          {
            headers: { token },
          }
        );
        return { postId, comments: response.data.comments };
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to create comment.");
      }
    }
  );
  // Delete Comment
  export const deleteCommentApi = createAsyncThunk(
    "comment/deleteComment",
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
    "comment/editComment",
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

  interface PostState {
  allPosts: PostData[] | null;
  currentPost: PostData | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

const initialState: PostState = {
  allPosts: null,
  currentPost: null,
  isLoading: false,
  isError: false,
  error: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    addPost: (state, action) => {
      if (state.allPosts) {
        state.allPosts.unshift(action.payload); // Adds the new post to the front
      } else {
        state.allPosts = [action.payload];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(index.fulfilled, (state, action) => {
        state.allPosts = action.payload.posts;
        state.isLoading = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(index.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message || "Error fetching posts.";
      })
      .addCase(index.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSinglePost.fulfilled, (state, action) => {
        state.currentPost = action.payload.post;
        state.isLoading = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(getSinglePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message || "Error fetching single post.";
      })
      .addCase(getSinglePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addPostApi.rejected, (state, action) => {
        state.isError = true;
        state.error = action.payload as string;
      })
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
      })
      .addCase(addCommentApi.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        const post = state.allPosts?.find((p) => p._id === postId);
        if (post) {
          /*
         {
            "_id": "678c15a7803f76bf00923956",
            "content": "ننننننننن",
            "commentCreator": {
                "_id": "678c0b41803f76bf009237b4",
                "name": "asma",
                "photo": "https://linked-posts.routemisr.com/uploads/undefined"
            },
            "post": "6665d28f594c3191507a33e3",
            "createdAt": "2025-01-18T20:57:11.986Z",
            "id": "678c15a7803f76bf00923956"
        }
          */
          post.comments.push({
            _id: comments[0]._id,
            commentCreator: comments[0].commentCreator,
            createdAt:comments[0].createdAt,
            post:postId ,
            content: comments[0].content
          });
        }
      });  
  },
});

export const { addPost } = postSlice.actions;
export const postReducer = postSlice.reducer;
