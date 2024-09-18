import React from 'react';
import { Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import API from '../../../lib/API';
import { getPosts } from '../../../lib/requests/post';
import { likeAction } from '../../../redux/actions';
import { Post } from '../../../redux/interfaces';
import { GET_STORE } from '../../../redux/store';
import CommentModal from '../comment/new/CommentModal';
import SharePost from '../crud/SharePost';

interface Props {
  me: string;
  post?: Post;
  className?: string;
}

export const InteractionButtons: React.FC<Props> = ({
  me: userId,
  post,
  className,
}) => {
  const dispatch = useDispatch();
  const liker = { userId };
  const { user: loggedInUser, post: postFromRedux } =
    useSelector(GET_STORE).data;

  const likesToUse = !postFromRedux ? post?.likes : postFromRedux.likes ?? [];
  const [commentLabel, setCommentLabel] = React.useState(false);
  const [likeLabel, setLikeLabel] = React.useState(false);
  const [shareLabel, setShareLabel] = React.useState(false);

  const [show, setShow] = React.useState(false);
  const [share, setShare] = React.useState(false);

  const handleCommentLabelShow = () => setCommentLabel(true);
  const handleLikeLabelShow = () => setLikeLabel(true);
  const handleShareLabelShow = () => setShareLabel(true);

  const handleCommentLabelClose = () => setCommentLabel(false);
  const handleLikeLabelClose = () => setLikeLabel(false);
  const handleShareLabelClose = () => setShareLabel(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleShareShow = () => setShare(true);

  const like = async () => {
    try {
      await API.patch(`/posts/${post?.id}/likes`, liker);
      await getPosts(dispatch, post?.id);
    } catch (error) {
      console.log(error);
    }
  };

  const likePost = async () => {
    dispatch(likeAction(loggedInUser));
    await like();
  };

  const unLikePost = async () => {
    dispatch(likeAction(loggedInUser));
    await like();
  };

  const toggle = () => {
    !post?.likes ? likePost() : unLikePost();
  };

  return (
    <div
      className={
        className
          ? `d-flex justify-content-around mt-1 mb-0 ml-auto`
          : `d-flex justify-content-around mt-1 mb-0`
      }
    >
      <div
        onMouseEnter={handleCommentLabelShow}
        onMouseLeave={handleCommentLabelClose}
        className="postition-relative"
      >
        <button className="candl" onClick={handleShow}>
          <img
            src="https://img.icons8.com/ios-filled/50/000000/comment-discussion.png"
            width="20px"
            alt=""
          />
        </button>
        <button className="text-dark btnX">
          <span>{post?.comments.length}</span>
        </button>
        {!commentLabel ? null : (
          <Badge pill variant="secondary" className="interactionBadge">
            Comment
          </Badge>
        )}
        <CommentModal
          id={String(post?.id)}
          show={show}
          setShow={setShow}
          handleClose={handleClose}
        />
      </div>
      <div
        onMouseEnter={handleLikeLabelShow}
        onMouseLeave={handleLikeLabelClose}
        onClick={toggle}
        className="postition-relative"
      >
        {!post?.likes.some((elem) => elem.id === userId) ? (
          <>
            <button className={className ? `candl ml-3` : `candl`}>
              <img
                className="interactions"
                src="https://img.icons8.com/ios-filled/50/000000/two-hearts.png"
                width="20px"
                alt=""
              />
            </button>
            <button className="text-dark btnX">
              <span>{likesToUse?.length}</span>
            </button>
            {!likeLabel ? null : (
              <Badge pill variant="secondary" className="interactionBadge">
                Like
              </Badge>
            )}
          </>
        ) : (
          <>
            <button className={className ? `candl ml-3` : `candl`}>
              <img
                className="interactions"
                src="https://img.icons8.com/color/50/000000/two-hearts.png"
                width="20px"
                alt=""
              />
            </button>
            <button className="text-dark btnX">
              <span>{likesToUse?.length}</span>
            </button>
            {!likeLabel ? null : (
              <Badge pill variant="secondary" className="interactionBadge">
                Like
              </Badge>
            )}
          </>
        )}
      </div>
      <div
        onMouseEnter={handleShareLabelShow}
        onMouseLeave={handleShareLabelClose}
        className="postition-relative"
      >
        <button
          className={className ? `candl ml-3` : `candl`}
          onClick={handleShareShow}
        >
          <img
            src="https://img.icons8.com/ios-filled/50/000000/right2.png"
            width="20px"
            alt=""
          />
        </button>
        {!shareLabel ? null : (
          <Badge pill variant="secondary" className="interactionBadge">
            Share
          </Badge>
        )}
        <SharePost
          id={post?.id}
          user={post?.user}
          show={share}
          setShow={setShare}
          createdAt={post?.createdAt}
        />
      </div>
    </div>
  );
};
