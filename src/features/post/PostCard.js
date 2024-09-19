import React, { useState } from 'react'
import { Box, Link, Card, Stack, Avatar, Typography, CardHeader, IconButton, Menu, MenuItem, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"
import { fDate } from "../../utils/formatTime"
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PostReaction from "./PostReaction"
import CommentList from "../comment/CommentList"
import CommentForm from "../comment/CommentForm"
import { deletePost, editPost } from './postSlice'
import { useDispatch } from 'react-redux'

function PostCard({ post }) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedImage, setEditedImage] = useState(post.image);

  const [open, setOpen] = useState(false);


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteConfirmation = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deletePost(post._id));
    setOpen(false);
    handleMenuClose();
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleEditPost = () => {
    toggleEditMode();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      dispatch(editPost({
        postId: post._id,
        content: editedContent,
        image: editedImage
      }));

      setIsEditing(false)
    } catch (error) {
      console.log(error);
    }
  };

  const renderMenu = (
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={handleDelete}
        to="/"
        component={RouterLink}
        sx={{ mx: 1 }}
      >
        Delete
      </MenuItem>
      <MenuItem
        onClick={handleEditPost}
        to="/"
        component={RouterLink}
        sx={{ mx: 1 }}
      >
        Edit
      </MenuItem>
    </Menu>
  )

  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={
          <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
        }
        title={
          <Link
            variant="subtitle2"
            color="text.primary"
            component={RouterLink}
            sx={{ fontWeight: 600 }}
            to={`/user/${post.author._id}`}
          >
            {post?.author?.name}
          </Link>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {fDate(post.createdAt)}
          </Typography>
        }
        action={
          <IconButton>
            <MoreVertIcon sx={{ fontSize: 30 }} onClick={handleMenuOpen} />
            {renderMenu}
          </IconButton>
        }
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <TextField
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              fullWidth
              multiline
              rows={4}
            />
            <Button type="submit">Save</Button>
          </form>
        ) : (
          <Typography>{post.content}</Typography>
        )}

        {post.image && (
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              height: 300,
              "& img": { objectFit: "cover", width: 1, height: 1 },
            }}
          >
            <img src={post.image} alt="post" />
          </Box>
        )}
        <PostReaction post={post} />
        <CommentList postId={post._id} />
        <CommentForm postId={post._id} />
      </Stack>

      <Dialog
        open={open}
        onClose={handleDialogClose}
        aria-labelledby="delete-confirmation-dialog"
      >
        <DialogTitle id="delete-confirmation-dialog">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Card>
  )
}

export default PostCard