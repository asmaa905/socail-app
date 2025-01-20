"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dispatchType, stateType } from "@/lib/store";
import { getSinglePost } from "@/lib/postSlice";
import Post from "@/app/_components/Post/Post";
import Loading from "@/app/Loading";
import Grid from "@mui/material/Grid2";

export default function SinglePost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const dispatch = useDispatch<dispatchType>();
  const { currentPost, isLoading } = useSelector(
    (state: stateType) => state.posts
  );
  const [id, setId] = useState<string | null>(null);

  
  useEffect(() => {
    params
      .then((resolvedParams) => setId(resolvedParams.id))
      .catch((error) => console.error("Failed to resolve params:", error));
  }, [params]);

  useEffect(() => {
    if (id) {
      dispatch(getSinglePost(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return <Loading />;
  }

  if (!currentPost) {
    return (
      <div>
        <p>Post not found or an error occurred.</p>
      </div>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={3}>{/* hhh */}</Grid>
        <Grid size={6}>
          <Post post={currentPost} showAllComments={true} showSharedpostInPostDisplay={false}/>;
        </Grid>
        <Grid size={3}>{/* hhh */}</Grid>
      </Grid>
    </>
  );
}
