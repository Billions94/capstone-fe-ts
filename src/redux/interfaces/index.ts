import { OnlineUser } from 'src/interfaces/OnlineUser';

export interface ReduxState {
  data: {
    user: User;
    followers: User[];
    cover: string;
    following: boolean;
    hideMe: boolean;
    hideActivityBar: boolean;
    likes: User[];
    reroute: boolean;
    isLoading: boolean;
    notes: Note[];
    hideTask: boolean;
    dynamicId: string;
    post: Post;
    posts: Post[];
    postId: string;
    comments: Comment[];
    Reply: Reply[];
    tokens: Token | null;
    scrollPosition: number;
  };
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  followers: User[];
  following: User[];
  bio: string;
  location: string;
  image: string;
  cover: string;
  isVerified: boolean;
  activities: Post[];
  updatedAt: Date;
  createdAt?: Date;
}

export interface Note {
  content: string;
  readonly createdAt: string;
}

export interface Post {
  id: string;
  text: string;
  media: string;
  sharedPost: Post;
  user: User;
  comments: Comment[];
  likes: User[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface Comment {
  id: string;
  content: string;
  media: string;
  user: User;
  postId: string;
  Reply: Reply[];
  createdAt: Date;
}

export interface Reply {
  id: string;
  text: string;
  media?: string;
  user: User;
  commentId: string;
  createdAt: Date;
}

export interface Room {
  _id: string;
  members: OnlineUser[];
}

export interface Message {
  roomId?: string;
  receiver?: string | undefined;
  text: string;
  image?: string;
  media?: string;
  sender: string;
  socketId?: string;
  createdAt: number;
}
export interface Cover {
  coverId: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
}

export type LogInResponse = RegisterResponse;
