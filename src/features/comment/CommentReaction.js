import React from 'react'
import { IconButton, Stack, Typography } from '@mui/material'
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded'
import ThumbDownAltRoundedIcon from '@mui/icons-material/ThumbDownAltRounded'
import { useDispatch } from 'react-redux';
import { sendCommentReaction } from "./commentSlice"

function CommentReaction({ comment }) {
  const dispatch = useDispatch();

  const handleClick = (emoji) => {
    dispatch(sendCommentReaction({ commentId: comment._id, emoji }));
  };

  return (
    <Stack direction="row" alignItems="center">
      <IconButton onClick={() => handleClick("like")}>
        <ThumbUpRoundedIcon sx={{ fontSize: 20, color: "primary.icon" }} />
      </IconButton>
      <Typography variant="body2" mr={1}>
        {comment?.reactions?.like}
      </Typography>

      <IconButton onClick={() => handleClick("dislike")}>
        <ThumbDownAltRoundedIcon sx={{ fontSize: 20, color: "error.icon" }} />
      </IconButton>
      <Typography variant="body2" mr={1}>
        {comment?.reactions?.dislike}
      </Typography>
    </Stack>
  )
}

export default CommentReaction