import { Dispatch } from 'redux';
import API from '../../lib/API';
import { Note, Post, Reply, Token, User } from '../interfaces';

export enum Actions {
  SAVE_USER = 'SAVE_USER',
  GET_USERS = 'GET_USERS',
  SET_USER = 'SET_USER',
  SET_POST = 'SET_POST',
  GET_POSTS = 'GET_POSTS',
  SET_POST_ID = 'SET_POST_ID',
  SET_COMMENTS = 'SET_COMMENTS',
  SET_Reply = 'SET_Reply',
  GET_POST_BY_ID = 'GET_POST_BY_ID',
  GET_FOLLOWERS = 'GET_FOLLOWERS',
  SET_COVER = 'SET_COVER',
  GET_COVER = 'GET_COVER',
  TOGGLE_FOLLOW = 'TOGGLE_FOLLOW',
  TOGGLE_ACTIVITY_BAR = 'TOGGLE_ACTIVITY_BAR',
  TOGGLE_HIDE_ME = 'TOGGLE_HIDE_ME',
  TOGGLE_LIKE = 'TOGGLE_LIKE',
  TOGGLE_REROUTE = 'TOGGLE_REROUTE',
  TOGGLE_LOADER = 'TOGGLE_LOADER',
  SAVE_NOTES = 'SAVE_NOTES',
  DELETE_NOTE = 'DELETE_NOTE',
  TOGGLE_HIDE_TASK = 'TOGGLE_HIDE_TASK',
  UPDATE_FOLLOWERS_STATE = 'UPDATE_FOLLOWERS_STATE',
  GET_FOLLOWERS_STATE = 'GET_FOLLOWERS_STATE',
  SET_DYNAMIC_ID = 'SET_DYNAMIC_ID',
  SET_TOKENS = 'SET_TOKENS',
  GET_TOKENS = 'GET_TOKENS',
}

export type Dispatcher<T> = (dispatch: Dispatch) => T;

export const setTokenAction =
  (payload: Token): Dispatcher<void> =>
  async (dispatch) => {
    try {
      dispatch({
        type: Actions.SET_TOKENS,
        payload,
      });
    } catch (e) {
      console.log(e.message);
    }
  };

export const getTokensAction = (): Dispatcher<void> => (dispatch) =>
  dispatch({ type: Actions.GET_TOKENS });

export const saveUserAction =
  (payload: User): ((dispatch: Dispatch) => void) =>
  async (dispatch) => {
    try {
      dispatch({
        type: Actions.SAVE_USER,
        payload,
      });
    } catch (e) {
      console.error(e);
    }
  };

export const getUsersAction =
  (userName?: string): Dispatcher<void> =>
  async (dispatch) => {
    try {
      const { data } = await API.get<User>(
        userName ? `/users/${userName}` : '/users/current-user',
        {
          params: { filter: 'verified' },
        }
      );
      if (data)
        dispatch({
          type: Actions.GET_USERS,
          payload: data,
        });
    } catch (error) {
      console.log(error);
    }
  };

export const setUserAction =
  (payload: User): Dispatcher<void> =>
  async (dispatch) => {
    try {
      if (payload)
        dispatch({
          type: Actions.GET_USERS,
          payload,
        });
    } catch (error) {
      console.log(error);
    }
  };

export const setPostAction =
  (payload: Post): Dispatcher<void> =>
  async (dispatch) => {
    try {
      if (payload)
        dispatch({
          type: Actions.SET_POST,
          payload,
        });
    } catch (error) {
      console.log(error);
    }
  };

export const getPostsAction = (): Dispatcher<void> => async (dispatch) => {
  dispatch({
    type: Actions.TOGGLE_LOADER,
    payload: true,
  });

  try {
    const { data } = await API.get(`/posts`);
    if (data) {
      const { posts } = data;
      const newPost = posts;
      dispatch({
        type: Actions.GET_POSTS,
        payload: newPost,
      });
      dispatch({
        type: Actions.TOGGLE_LOADER,
        payload: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getPostById =
  (id?: string): Dispatcher<any> =>
  async (dispatch) => {
    try {
      const { data } = await API.get(`/posts/${id}`);
      const { post } = data;

      dispatch({
        type: Actions.GET_POST_BY_ID,
        payload: post,
      });

      return post;
    } catch (e) {
      console.log(e.message);
    }
  };

export const getFollowersAction =
  (userName: string): Dispatcher<void> =>
  async (dispatch) => {
    try {
      const { data } = await API.get(`/users/${userName}/followers`);
      if (data) {
        dispatch({
          type: Actions.GET_FOLLOWERS,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

export const updateFollowersState =
  (payload: User | User[] | undefined): Dispatcher<boolean> =>
  (dispatch) => {
    dispatch({
      type: Actions.UPDATE_FOLLOWERS_STATE,
      payload,
    });
    return true;
  };

export const getFollowersState = (): Dispatcher<void> => (dispatch) =>
  dispatch({
    type: Actions.GET_FOLLOWERS_STATE,
  });

export const setDynamicId =
  (payload: string | undefined): Dispatcher<void> =>
  (dispatch) =>
    dispatch({
      type: Actions.SET_DYNAMIC_ID,
      payload,
    });

export const setCommentsAction =
  (payload: Comment[]): Dispatcher<void> =>
  (dispatch) =>
    dispatch({
      type: Actions.SET_COMMENTS,
      payload,
    });

export const setReplyAction =
  (payload: Reply[]): Dispatcher<void> =>
  (dispatch) =>
    dispatch({
      type: Actions.SET_Reply,
      payload,
    });

export const setCover =
  (payload: string): Dispatcher<void> =>
  (dispatch) =>
    dispatch({
      type: Actions.SET_COVER,
      payload,
    });

export const setPostIdAction =
  (postId: string): Dispatcher<void> =>
  (dispatch) =>
    dispatch({ type: Actions.SET_POST_ID, payload: postId });

export const getCover = (): Dispatcher<void> => (dispatch) =>
  dispatch({
    type: Actions.GET_COVER,
  });

export const followAction = (payload: boolean) => ({
  type: Actions.TOGGLE_FOLLOW,
  payload,
});

export const hideMeAction = (payload: boolean) => ({
  type: Actions.TOGGLE_HIDE_ME,
  payload,
});

export const likeAction = (payload: User) => ({
  type: Actions.TOGGLE_LIKE,
  payload,
});

export const reRouteAction = (payload: boolean) => ({
  type: Actions.TOGGLE_REROUTE,
  payload,
});

export const loaderAction = (payload: boolean) => ({
  type: Actions.TOGGLE_LOADER,
  payload,
});

export const hideNotesAction = (payload: boolean) => ({
  type: Actions.TOGGLE_HIDE_TASK,
  payload,
});

export const hideActivityBarAction = (payload: boolean) => {
  console.log({ payload });
  return {
    type: Actions.TOGGLE_ACTIVITY_BAR,
    payload,
  };
};

export const saveNoteAction = (payload: Note) => ({
  type: Actions.SAVE_NOTES,
  payload,
});

export const deleteNoteAction = (payload: Note) => ({
  type: Actions.DELETE_NOTE,
  payload,
});
