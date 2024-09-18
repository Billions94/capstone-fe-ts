import { Dispatch } from 'redux';
import { Post } from 'src/redux/interfaces';
import { Actions } from '../../../redux/actions';
import API from '../../API';
import {
  CreateNewPost,
  SharePost,
  UpdatePost,
} from '../interfaces/post.interface';

export async function getPosts(dispatch: Dispatch, postId?: string) {
  try {
    const { data } = await API.get<{ posts: Post[] }>('/posts');

    if (data) {
      dispatch({
        type: Actions.GET_POSTS,
        payload: data.posts,
      });

      if (postId)
        dispatch({
          type: Actions.SET_POST,
          payload: data.posts.find((p) => p.id === postId),
        });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function createPost(args: CreateNewPost) {
  const { media, setMedia, post, setPost, setFetchLoading, dispatch, setShow } =
    args;

  if (media) {
    try {
      setFetchLoading && setFetchLoading(true);

      const formData = new FormData();
      formData.append('text', post.text);
      formData.append('media', media);

      const { data } = await API.post(`/posts`, formData);

      if (setShow && data) {
        setPost({ text: '' });
        setMedia('');
        await getPosts(dispatch);
        setShow(false);
      }

      if (data) {
        setPost({ text: '' });
        setMedia('');
        await getPosts(dispatch);

        setTimeout(() => {
          setFetchLoading && setFetchLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      setFetchLoading && setFetchLoading(true);
      const { data } = await API.post(`/posts`, post);

      if (setShow && data) {
        setPost({ text: '' });
        await getPosts(dispatch);
        setShow(false);
      }

      if (data) {
        setPost({ text: '' });
        await getPosts(dispatch);

        setTimeout(() => {
          setFetchLoading && setFetchLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export async function updatePost(args: UpdatePost) {
  const {
    post,
    media,
    postId,
    setShow,
    dispatch,
    refresh,
    setRefresh,
    setMedia,
  } = args;

  if (media) {
    try {
      const formData = new FormData();
      formData.append('text', post.text);
      formData.append('media', media);

      const { data } = await API.patch(`/posts/${postId}`, formData);

      if (data) {
        setShow(false);
        setMedia('');
        !refresh ? setRefresh(true) : setRefresh(false);
        await getPosts(dispatch);
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const { data } = await API.patch(`/posts/${postId}`, post);

      if (data) {
        setShow(false);
        !refresh ? setRefresh(true) : setRefresh(false);
        await getPosts(dispatch);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export async function deletePost(postId: string, dispatch: any) {
  try {
    const { data } = await API.delete(`/posts/${postId}`);
    if (data) {
      await getPosts(dispatch);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function sharePost(args: SharePost) {
  const { media, post, setShow, navigate, dispatch, setMedia } = args;

  if (media) {
    try {
      const formData = new FormData();
      formData.append('text', post.text);
      formData.append('media', media);
      formData.append('sharedPost', post?.sharedPost?.id);

      const { data } = await API.post(`/posts`, formData);

      if (data) {
        if (setShow) {
          setShow(false);
        }

        setMedia('');
        navigate('/home');
        await getPosts(dispatch);
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const { data } = await API.post(`/posts`, {
        ...post,
        sharedPost: post?.sharedPost?.id,
      });

      if (data) {
        if (setShow) {
          setShow(false);
        }

        setMedia('');
        navigate('/home');
        await getPosts(dispatch);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
