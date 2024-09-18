import React from 'react';
import { Card } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { reRouteAction } from '../../../redux/actions';
import { Post } from '../../../redux/interfaces';
import PostAuthor from '../author/PostAuthor';

interface Props {
  newPost: Post;
  post?: Post;
}

export const SharedPost: React.FC<Props> = ({ newPost, post }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const route = (postId: string) => {
    navigate(`/posts/${postId}`);
    dispatch(reRouteAction(true));
  };

  return (
    <React.Fragment>
      {post?.sharedPost && post.sharedPost.id !== post?.id ? (
        <div className="sharePostDiv">
          <div className="sharePost pt-3">
            <div className="d-flex">
              <PostAuthor {...post?.user} /> <div></div>
            </div>
            <div className="blog-link">
              <Card.Title className="sharePostText">
                {post?.sharedPost.text}
              </Card.Title>
              {!post?.sharedPost ? null : post?.sharedPost.media
                  .split('.')
                  .slice(-1)
                  .join()
                  .match(`heic|png|jpg|pdf|jpeg`) ? (
                <Card.Img
                  variant="top"
                  src={post.sharedPost.media}
                  className="blog-cover"
                />
              ) : (
                RegExp(`mp4|MPEG-4|mkv|mov`).exec(
                  post?.sharedPost?.media.split('.').slice(-1).join()
                ) && (
                  <video
                    src={post?.sharedPost?.media}
                    className="blog-video"
                    controls
                    autoPlay
                    muted
                  ></video>
                )
              )}
              <Card.Body className="mb-0"></Card.Body>
            </div>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};
