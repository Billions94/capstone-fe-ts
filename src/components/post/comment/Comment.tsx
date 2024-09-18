import React from 'react';
import { Post } from '../../../redux/interfaces';
import { useComments } from '../../hooks/useComments';
import Loader from '../../loader/Loader';
import SingleComment from './SingleComment';
import './styles.scss';

const CommentComponent: React.FC<{ post: Post }> = ({ post }) => {
  const { comments, setComments, fetchComments } = useComments();

  return comments ? (
    <div className="comment-container">
      {comments.map((c) =>
        c.postId !== post?.id ? null : (
          <SingleComment
            key={c.id}
            post={post as Post}
            comment={c}
            comments={comments}
            fetchComments={fetchComments}
            setComments={setComments}
          />
        )
      )}
    </div>
  ) : (
    <Loader />
  );
};

export default CommentComponent;
