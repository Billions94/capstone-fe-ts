import { AnyAction } from 'redux';
import { Actions } from '../actions';
import { initialState } from '../store';
import { dynamicFilter } from './funcs/reducerHelpers';

const dataReducer = (state = initialState.data, action: AnyAction) => {
  const { type, payload } = action;
  switch (type) {
    case Actions.SET_TOKENS:
      return {
        ...state,
        tokens: payload,
      };
    case Actions.SET_POST:
      return {
        ...state,
        post: payload,
      };
    case Actions.TOGGLE_ACTIVITY_BAR:
      return {
        ...state,
        hideActivityBar: payload,
      };
    case Actions.GET_POSTS:
      return {
        ...state,
        posts: payload,
      };
    case Actions.GET_USERS:
      return {
        ...state,
        user: payload,
      };
    case Actions.SET_POST_ID:
      return {
        ...state,
        postId: payload,
      };
    case Actions.SET_COMMENTS:
      return {
        ...state,
        comments: payload,
      };
    case Actions.SET_Reply:
      return {
        ...state,
        Reply: payload,
      };
    case Actions.SAVE_USER:
      return {
        ...state,
        user: payload,
      };
    case Actions.SET_COVER:
      return {
        ...state,
        cover: payload,
      };
    case Actions.GET_COVER:
      return state.cover;
    case Actions.TOGGLE_FOLLOW:
      return {
        ...state,
        following: payload,
      };
    case Actions.GET_FOLLOWERS:
      return {
        ...state,
        followers: payload,
      };
    case Actions.GET_FOLLOWERS_STATE:
      return state.followers;
    case Actions.UPDATE_FOLLOWERS_STATE:
      return {
        ...state,
        followers: dynamicFilter({ array: state.followers, payload }),
      };
    case Actions.TOGGLE_HIDE_ME:
      return {
        ...state,
        hideMe: payload,
      };
    case Actions.SAVE_NOTES:
      return {
        ...state,
        notes: [...state.notes, payload],
      };
    case Actions.DELETE_NOTE: {
      const note = true;
      return {
        ...state,
        notes: dynamicFilter({ array: state.notes, payload, note }),
      };
    }
    case Actions.TOGGLE_HIDE_TASK:
      return {
        ...state,
        hideTask: payload,
      };
    case Actions.TOGGLE_LIKE: {
      const isLiked = state.likes.some((elem) => elem.id === state.user.id);
      return !isLiked
        ? {
            ...state,
            likes: [...state.likes, payload],
          }
        : {
            ...state,
            likes: [...dynamicFilter({ array: state.likes, state })],
          };
    }
    case Actions.SET_DYNAMIC_ID:
      return {
        ...state,
        dynamicId: payload,
      };
    case Actions.TOGGLE_REROUTE:
      return {
        ...state,
        reroute: payload,
      };
    case Actions.TOGGLE_LOADER:
      return {
        ...state,
        isLoading: payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
