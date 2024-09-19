import { createSlice } from '@reduxjs/toolkit'
import apiService from '../../app/apiService'
import { POST_PER_PAGE } from '../../app/config';
import { toast } from 'react-toastify';
import { cloudinaryUpload } from '../../utils/cloudinary';

const initialState = {
  isLoading: false,
  error: null,
  postsById: {},
  currentPagePosts: [],
};

const slice = createSlice({
  name: "post",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const newPost = action.payload;
      if (state.currentPagePosts.length % POST_PER_PAGE === 0) {
        state.currentPagePosts.pop();
      }
      state.postsById[newPost._id] = newPost;
      state.currentPagePosts.unshift(newPost._id);
    },
    getPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { count, posts } = action.payload;
      posts.forEach(post => {
        state.postsById[post._id] = post;
        if (!state.currentPagePosts.includes(post._id)) {
          state.currentPagePosts.push(post._id);
        }
      })
      state.totalPosts = count;
    },
    sendPostReactionSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { postId, reactions } = action.payload;
      state.postsById[postId].reactions = reactions;
    },
    resetPosts(state, action) {
      state.postsById = {};
      state.currentPagePosts = [];
    }, 
    deletePostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const postId = action.payload;
      delete state.postsById[postId];
      state.currentPagePosts = state.currentPagePosts.filter(id => id !== postId);
    },
    editPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const updatedPost = action.payload;
      state.postsById[updatedPost._id] = {
        ...state.postsById[updatedPost._id],
        ...updatedPost,
      };
    }
  },
});

export const createPost = ({ content, image }) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    // upload image to cloudinary
    const imageUrl = await cloudinaryUpload(image);
    const response = await apiService.post("/posts", {
      content,
      image: imageUrl,
    });
    dispatch(slice.actions.createPostSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
}

export const getPosts = ({ userId, page, limit = POST_PER_PAGE }) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const params = { page, limit };
    const response = await apiService.get(`/posts/user/${userId}`, {
      params
    });
    if (page === 1) dispatch(slice.actions.resetPosts());
    dispatch(slice.actions.getPostSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const sendPostReaction = ({ postId, emoji }) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.post(`/reactions`, {
      targetType: "Post",
      targetId: postId,
      emoji,
    });
    dispatch(slice.actions.sendPostReactionSuccess({
      postId,
      reactions: response.data
    }));
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const deletePost = (postId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    await apiService.delete(`/posts/${postId}`);
    dispatch(slice.actions.deletePostSuccess(postId));
    toast.success("Post deleted successfully!");
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
}

export const editPost = ({postId, content, image}) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    let imageUrl = image;

    if (typeof image !== 'string') {
      imageUrl = await cloudinaryUpload(image);
    }

    const response = await apiService.put(`/posts/${postId}`, {
      content,
      image: imageUrl,
    });

    dispatch(slice.actions.editPostSuccess(response.data));
    toast.success("Post updated successfully!");
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
}

export default slice.reducer;