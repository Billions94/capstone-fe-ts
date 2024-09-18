import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { reRouteAction, setPostIdAction } from '../../../redux/actions';
import { Post } from '../../../redux/interfaces';
import { getFileType } from '../../../util/funcs';

interface Props {
  post?: Post;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PostDetails: React.FC<Props> = ({ post, setIsClicked }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const route = (id: string) => {
    navigate(`/posts/${id}`);
    dispatch(setPostIdAction(id));
    dispatch(reRouteAction(true));
  };

  return (
    <div className="blog-link" onClick={() => setIsClicked(true)}>
      <div className="d-flex postBody">
        <div>
          <h6>{post?.text}</h6>
          {!post?.media ? null : getFileType(post.media) ? (
            <div className="post-detail-image-container">
              {' '}
              <LazyLoadImage
                src={post.media}
                className="post-detail-image-list "
                alt=""
              />
            </div>
          ) : (
            <video src={post?.media} className="blog-video" controls autoPlay>
              {' '}
              <track kind="captions" />
            </video>
          )}
        </div>
      </div>
    </div>
  );
};
