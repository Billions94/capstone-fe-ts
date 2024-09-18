import React, { useEffect, useState } from 'react';
import { Comment, Post, Reply } from '../../../redux/interfaces';
import SingleReply from './SingleReply';

interface ReplyProps {
  post: Post | undefined;
  comment: Comment;
  commentID?: string;
}

const ReplyComponent = ({ post, comment, commentID }: ReplyProps) => {
  const url = process.env.REACT_APP_GET_URL;
  const [replies, setReplies] = useState<Reply[]>();

  const getReplies = async () => {
    try {
      const response = await fetch(`${url}/replies`);
      if (response.ok) {
        const data: Reply[] = await response.json();
        setReplies(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => getReplies())();
  }, [comment]);

  return (
    <>
      {
        <div
          id="replyContainer"
          className="d-flex"
          style={{ fontSize: '10px', marginTop: '5px' }}
        >
          {replies?.map((reply) => (
            <SingleReply
              key={reply.id}
              commentID={commentID}
              reply={reply}
              comment={comment}
              post={post}
              getReplies={getReplies}
            />
          ))}
        </div>
      }
    </>
  );
};

export default ReplyComponent;
