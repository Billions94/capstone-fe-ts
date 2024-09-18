import { FC, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { GET_STORE } from 'src/redux/store';
import { Post } from '../../../redux/interfaces';
import CommentComponent from '../comment/Comment';
import { DropDown } from './DropDown';
import { InteractionButtons } from './InteractionButtons';
import { PostDetails } from './PostDetail';
import { SharedPost } from './SharedPost';
import './styles.scss';

interface Props {
  post: Post;
}

const PostItem: FC<Props> = ({ post }) => {
  const [smShow, setSmShow] = useState(false);
  const [reload, setReload] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const {
    data: { posts, user: newUser },
  } = useSelector(GET_STORE);

  const newPost = posts?.find((p) => p.id === post?.id);
  const me = newUser?.id;

  console.log(post?.comments);

  const dropDownProps = {
    me,
    post,
    reload,
    setReload,
    smShow,
    setSmShow,
  };

  const sharedPostProps = {
    newPost: newPost as Post,
    post,
  };

  const interactionButtonProps = {
    me,
    post,
  };

  return (
    <ListGroup>
      <ListGroup.Item key={post?.id} className="blog-card">
        <DropDown data={dropDownProps} />
        <PostDetails {...{ post, setIsClicked }} />
        <SharedPost {...{ ...sharedPostProps }} />
        <InteractionButtons {...{ ...interactionButtonProps }} />
        {isClicked && post?.comments?.length > 0 && (
          <CommentComponent {...{ post: post as Post }} />
        )}
      </ListGroup.Item>
    </ListGroup>
  );
};

export default PostItem;
