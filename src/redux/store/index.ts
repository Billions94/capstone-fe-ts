import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
} from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import storage from 'redux-persist/lib/storage/session';
import thunk from 'redux-thunk';
import { defaultCover } from '../../assets/icons';
import { Post, ReduxState, User } from '../interfaces';
import dataReducer from '../reducers/dataReducer';

const allCompose =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const initialState: ReduxState = {
  data: {
    user: <User>{},
    followers: [],
    dynamicId: '',
    cover: defaultCover,
    following: false,
    hideMe: false,
    hideActivityBar: false,
    likes: [],
    reroute: false,
    isLoading: true,
    notes: [],
    hideTask: false,
    post: <Post>{},
    posts: [],
    postId: '',
    comments: [],
    Reply: [],
    tokens: null,
    scrollPosition: 0,
  },
};

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  transforms: [
    encryptTransform({
      secretKey: <string>process.env.REACT_APP_SECRET_KEY,
    }),
  ],
};

// All reducers of the application
const allReducers = combineReducers({
  data: dataReducer,
  //posts: postsReducer,
});

const persistedReducer = persistReducer(persistConfig, allReducers);

// Redux Store
const store = createStore<ReduxState, AnyAction, unknown, unknown>(
  persistedReducer,
  initialState,
  allCompose(applyMiddleware(thunk))
);

export default store;
export const persistor = persistStore(store);
export const getDynamicIdFromRedux = () => store.getState().data.dynamicId;
export const retrieveAccessToken = () => store.getState().data.tokens;
export const localDispatcher = (payload: any, type: string): (() => void) => {
  return function () {
    store.dispatch({
      type,
      payload,
    });
  };
};

export const GET_STORE = (state: ReduxState) => state;
