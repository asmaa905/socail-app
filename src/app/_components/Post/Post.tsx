"use client";

import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { TextField, Button, Box } from "@mui/material";
import { red } from "@mui/material/colors";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";

import { Comment, ThumbUp } from "@mui/icons-material";
import { PostData } from "@/app/interfaces/postDate";
import Image from "next/image";
import { useRouter } from "next/navigation";
import creatorImg from "../../../assets/comment_creator.jpg";
import PostPopup from "./postPopup/postPopup";
import toast from "react-hot-toast";
import { dispatchType, stateType } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { addPostApi,getSinglePost,deleteCommentApi, editCommentApi } from "@/lib/postSlice";
import {  isValid, parseISO, format } from "date-fns";

import CreateComment from "../Comment/CreateComment"
// forma
export default function Post({
  post,
  showAllComments,
  showSharedpostInPostDisplay,
  inPostCreation,
}: {
  post: PostData;
  showAllComments?: boolean;
  showSharedpostInPostDisplay: boolean;
  inPostCreation: boolean;
}) {
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [commentAnchorEl, setCommentAnchorEl] = useState<null | HTMLElement>(null);

  const [quote, setQuote] = useState<string>("");
  const [openPostPopup, setOpenPostPopup] = useState(false);
  const [imgPost, setImgPost] = useState<File | null>(null);
  let dispatch = useDispatch<dispatchType>();
  const [sharedPost, setSharedPost] = useState<PostData | null>(null);
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(true); 
  const [commentIsVisible, setCommentIsVisible] = useState(true);
  const handleClosePost = () => {
    setIsVisible(false); 
  };
  const hideComment = () => {
    setCommentIsVisible(false); 
  };

  const deleteComment = (commentId: string) => {
    dispatch(deleteCommentApi(commentId))
      .unwrap()
      .then(() => {
        toast.success("Comment deleted successfully.");
      })
      .catch((error) => {
        toast.error(error || "Failed to delete comment.");
      });
  };

    const editComment = (commentId: string, newContent: string) => {
      dispatch(editCommentApi({ commentId, content: newContent }))
        .unwrap()
        .then(() => {
          toast.success("Comment updated successfully.");
        })
        .catch((error) => {
          toast.error(error || "Failed to edit comment.");
        });
    };
  
  const handlePostPopup = () => {
    setOpenPostPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPostPopup(false);
  };
  const extractSharedPostId = (body: string): string | null => {
    const match = body?.match(/shared_post_id:"([^"]+)"/);
    console.log('match',match)
    return match ? match[1] : null;
  };
  const extractBodyWithoutSharedPostId = (body: string): string | null => {
    const match = body?.split('shared_post_id:');
    console.log(match)
    return match ? match[0] : null;
  };
  useEffect(() => {
    const sharedPostId = extractSharedPostId(post.body);
    if (sharedPostId) {
      dispatch(getSinglePost(sharedPostId))
        .unwrap()
        .then((response) => {
          setSharedPost(response.post);
        })
        .catch((error) => {
          console.error("Failed to fetch shared post:", error);
        });
    }
  }, [post.body, dispatch]);
  useEffect(() => {
    const storedLikes = localStorage.getItem("favPosts");
    if (storedLikes) {
      setLikedPosts(JSON.parse(storedLikes));
      console.log("likedPosts", likedPosts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favPosts", JSON.stringify(likedPosts));
  }, [likedPosts]);

  const handleProfile = (id: string) => {
    router.push(`/profile/${id}`);
  };

  const showSinglePost = (id: string) => {
    router.push(`/post/${id}`);
  };
  let showMoreComment = (id: string) => {
    console.log("more");
  };
  const likeDislikePost = (id: string) => {
    setLikedPosts((prev) => {
      let updatedLikedPosts;
      if (prev.includes(id)) {
        updatedLikedPosts = prev.filter((postId) => postId !== id);
      } else {
        updatedLikedPosts = [...prev, id];
      }
      console.log("JSON.stringify(updatedLikedPosts)", updatedLikedPosts);
      console.log("likedPosts", likedPosts);
      localStorage.setItem("favPosts", JSON.stringify(updatedLikedPosts));
      return updatedLikedPosts;
    });
  };

  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  // const showCommentOptions =  (event: React.MouseEvent<HTMLElement>) => {
  //   console.log("show more")
  //   setShowCommentMenu(event.currentTarget);
  // };

  // const handleCommentOptionsClose = () => {
  //   setShowCommentMenu(null);
  // };

const showCommentOptions = (event: React.MouseEvent<HTMLElement>) => {
  setCommentAnchorEl(event.currentTarget);
};

const handleCommentOptionsClose = () => {
  setCommentAnchorEl(null);
}
  const createPostFunc = () => {
    if (!post?.body.trim() && !post?.image) {
      toast.error("Please write something or add an image.");
      return;
    }
    dispatch(
      addPostApi({
        postBody: `shared_post_id:${JSON.stringify(post._id)}`,
        imgPost: imgPost,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Post created successfully");
      })
      .catch((error) => {
        console.error("Error creating post:", error);
        toast.error("Failed to create post.");
      });
  };

  const handleSharePost = () => {
    // Create a new post referencing the shared post
    // const newPost = {
    //   body: `Shared from ${post?.user?.name}: ${post.body}`,
    //   image: post.image,
    //   user: { name: "Current User", photo: creatorImg }, // Replace with the current user info
    // };
    // console.log("New Shared Post:", newPost);
    createPostFunc();
    handleMenuClose();
  };

  const handleShareWithQuote = () => {
    // Create a new post with user quotes and shared post
    const newPost = {
      body: `${quote}\n\nShared from ${post?.user?.name}: ${post.body}`,
      image: post.image,
      user: { name: "Current User", photo: creatorImg }, // Replace with the current user info
    };
    console.log("New Shared Post with Quote:", newPost);
    handleMenuClose();
  };

  return (
    <>
      {isVisible && (  <Card
        sx={{
          my: 5,
          overflowY: `${inPostCreation ? "scroll" : "hidden"}`,
          height: `${inPostCreation ? "200px" : "unset"}`,
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              onClick={() => {
                handleProfile(post?.user?._id);
              }}
              sx={{  cursor: "pointer" }}
              aria-label="post-creattor"
            >
              <Image
                src={
                  post?.user?.photo && !post?.user?.photo.includes("undefined")
                    ? post?.user?.photo
                    : creatorImg
                }
                alt={post?.user?.name}
                width={50}
                height={50}
              />
            </Avatar>
          }
          action={
            !inPostCreation && !showSharedpostInPostDisplay?(<>
            <IconButton aria-label="close" onClick={handleClosePost}>
              <CloseIcon />
            </IconButton>
            </>):null
          }
          title={post?.user?.name}
          subheader={format(new Date(post?.createdAt), "dd-MM-yyyy")}
          subheaderTypographyProps={{
            sx: { cursor: "pointer", width: "fit-content" },
            onClick: () => {
              showSinglePost(post._id);
            },
          }}
          titleTypographyProps={{
            sx: { cursor: "pointer", width: "fit-content" },
            onClick: () => {
              handleProfile(post?.user?._id);
            },
          }}
        />
        {post.image && (
          <CardMedia
            component="img"
            height="194"
            image={post?.image}
            alt="Post Image"
          />
        )}
        <CardContent>
        {sharedPost ? (<>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {extractBodyWithoutSharedPostId(post?.body)}
          </Typography>
          <Post
            post={sharedPost}
            showAllComments={false}
            showSharedpostInPostDisplay={true}
            />

        </>
        ) : (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {post.body}
          </Typography>
        )}
        </CardContent>
        {!inPostCreation && !showSharedpostInPostDisplay ? (
          <CardActions
            disableSpacing
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <IconButton
              aria-label="like"
              onClick={() => likeDislikePost(post?._id)}
              style={{
                color: likedPosts.includes(post._id) ? "blue" : "",
              }}
            >
              <ThumbUp />
            </IconButton>
            <IconButton aria-label="share" onClick={handleShareClick}>
              <ShareIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleSharePost}>Share Post</MenuItem>
              <MenuItem onClick={handlePostPopup}>
                Share with Your Quotes
              </MenuItem>
            </Menu>
            <IconButton
              aria-label="comment"
              onClick={() => showSinglePost(post._id)}
            >
              <Comment />
            </IconButton>
          </CardActions>
        ) : null}
        {!inPostCreation  && !showSharedpostInPostDisplay ? (
          <>
            <CreateComment postId={post._id}/>
            {post?.comments?.length > 0 && !showAllComments ? (
              <Box>
                <CardHeader
                  avatar={
                    <Avatar
                      onClick={() => {
                        handleProfile(post?.comments[post?.comments?.length - 1]?.commentCreator?._id);
                      }}
                      sx={{cursor: "pointer" }}
                      aria-label="comment-creator"
                    >
                      <Image
                        src={
                          post?.comments[post?.comments?.length - 1]?.commentCreator?.photo &&
                          !post?.comments[post?.comments?.length - 1]?.commentCreator?.photo.includes(
                            "undefined"
                          )
                            ? post?.comments[post?.comments?.length - 1]?.commentCreator?.photo
                            : creatorImg
                        }
                        alt={post?.comments[post?.comments?.length - 1]?.commentCreator?.name || "user"}
                        width={50}
                        height={50}
                      />
                    </Avatar>
                  }
                  action={
                    !inPostCreation  && !showSharedpostInPostDisplay ? (
                     <Box sx={{position:"relative"}}>
                        <IconButton aria-label="settings" onClick={showCommentOptions}>
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={commentAnchorEl}
                          open={Boolean(commentAnchorEl)}
                          onClose={handleCommentOptionsClose}
                          sx={{zIndex:"9999999",}}
                        >
                          <MenuItem onClick={() => { hideComment(); handleCommentOptionsClose(); }}>
                            Hide
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                                
                                editComment(post?.comments[post?.comments?.length - 1]?._id, newContent);
                              
                              handleCommentOptionsClose();
                            }}
                          >
                            Edit
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this comment?")) {
                                deleteComment(post?.comments[post?.comments?.length - 1]?._id);
                              }
                              handleCommentOptionsClose();
                            }}
                          >
                            Delete
                          </MenuItem>
                        </Menu>
                      </Box>) : (
                      <></>
                    )
                  }
                  title={post?.comments?.[post?.comments?.length - 1]?.commentCreator?.name}
                  subheader={
                    (() => {
                      const lastComment = post?.comments?.[post?.comments?.length - 1];
                      const createdAt = lastComment?.createdAt;
                  
                      if (createdAt) {
                        const parsedDate = parseISO(createdAt); // Parse the ISO date string
                        if (isValid(parsedDate)) {
                          return format(parsedDate, "dd-MM-yyyy"); // Format the valid date
                        }
                      }
                      return "Invalid date"; // Fallback if date is invalid or missing
                    })()
                  }
                  subheaderTypographyProps={{}}
                  titleTypographyProps={{
                    sx: { cursor: "pointer", width: "fit-content" },
                    onClick: () => {
                      handleProfile(post?.comments[post?.comments?.length - 1]?.commentCreator?._id);
                    },
                  }}

                >

 
                </CardHeader>
                <CardContent>

                  <Typography
                    sx={{
                      cursor: "pointer",
                      width: "fit-content",
                      color: "text.secondary",
                    }}
                    onClick={() => {
                      showMoreComment(post?.comments[post?.comments?.length - 1]?._id);
                    }}
                    variant="body2"
                  >
                    {post?.comments[post?.comments?.length - 1]?.content}
                  </Typography>
                </CardContent>
              </Box>
            ) : null}
            {post?.comments?.length > 0 && showAllComments
              ? post?.comments?.map((comment) => (
                  <Box key={comment._id}>
                    <CardHeader
                      avatar={
                        <Avatar
                          onClick={() => {
                            handleProfile(comment.commentCreator?._id);
                          }}
                          sx={{ bgcolor: red[500], cursor: "pointer" }}
                          aria-label="recipe"
                        >
                          <Image
                            src={
                              comment?.commentCreator?.photo &&
                              !comment?.commentCreator?.photo.includes(
                                "undefined"
                              )
                                ? comment?.commentCreator?.photo
                                : creatorImg
                            }
                            alt={comment?.commentCreator?.name || "user"}
                            width={50}
                            height={50}
                          />
                        </Avatar>
                      }
                      action={
                        <IconButton aria-label="settings" onClick={showCommentOptions}>
                        <MoreVertIcon />
                      </IconButton>
                      }
                      title={comment?.commentCreator?.name}
                      subheader={format(
                        new Date(comment?.createdAt),
                        "dd-MM-yyyy"
                      )}
                      titleTypographyProps={{
                        sx: { cursor: "pointer", width: "fit-content" },
                        onClick: () => {
                          handleProfile(comment?.commentCreator?._id);
                        },
                      }}
                    />
                    <CardContent
                      sx={{ cursor: "pointer", width: "fit-content" }}
                      onClick={() => {
                        showMoreComment(comment?._id);
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {comment?.content}
                      </Typography>
                    </CardContent>
                  </Box>
                ))
              : null}
          </>
        ) : null}
      </Card>)}
      {openPostPopup && (
        <PostPopup
          onClose={handleClosePopup}
          postShared={post}
          isPostShared={true}
        />
      )}
    </>
  )
}
