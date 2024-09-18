import { createRef, Dispatch, SetStateAction, useState } from 'react';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FormControlSize } from '../../../components/auth/interfaces';
import { sharePost } from '../../../lib/requests/post';
import { Post, ReduxState, User } from '../../../redux/interfaces';
import BlogAuthor from '../author/PostAuthor';
import { MediaDetails } from './MediaDetails';

interface SharePostProps {
  id: string | undefined;
  user?: User;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  createdAt?: Date;
}

const SharePost = ({ id, user, show, setShow, createdAt }: SharePostProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { posts } = useSelector((state: ReduxState) => state['data']);
  const loggedInUser = useSelector((state: ReduxState) => state.data.user);

  const userName = loggedInUser?.userName;
  const sharePostBody = posts.map((p) => p).find((p) => p.id === id) as Post;

  const [media, setMedia] = useState('');
  const [post, setPost] = useState({
    text: '',
    sharedPost: sharePostBody,
  });
  const handleClose = () => setShow(false);

  const target = (e: any) => {
    if (e.target && e.target.files[0]) {
      setMedia(e.target.files[0]);
    }
  };

  const inputBtn = createRef<HTMLInputElement>();

  const openInputFile = () => {
    inputBtn?.current?.click();
  };

  const sharePostData = {
    media,
    userName,
    post,
    setShow,
    navigate,
    dispatch,
    setMedia,
  };

  return (
    <Modal
      id="shareModal"
      centered
      show={show}
      size={FormControlSize.LG}
      onHide={handleClose}
      animation={true}
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-dark">Share</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex userInfoContainer">
          <div>
            <img
              src={loggedInUser?.image}
              alt=""
              className="roundpic"
              width={47}
              height={47}
            />
          </div>
          <div className="ml-2 userInfo">
            <span className="text-dark">
              {loggedInUser?.firstName} {loggedInUser?.lastName}
              {loggedInUser?.isVerified && (
                <span className=" mt-1 ml-1  d-flex-row align-items-center">
                  <img
                    alt=""
                    className="mr-2"
                    width="15"
                    src="https://img.icons8.com/ios-filled/50/4a90e2/verified-account.png"
                  />
                </span>
              )}
            </span>
          </div>
        </div>
        <Form.Group controlId="blog-content" className="form1 mt-3">
          <Form.Control
            placeholder="start typing...."
            as="textarea"
            className="textarea"
            rows={5}
            value={post.text}
            onChange={(e) => setPost({ ...post, text: e.target.value })}
          />
        </Form.Group>
        <div className="sharePostDiv">
          <div className="sharePost">
            <div
              className="authorinfo d-flex "
              style={{ justifyContent: 'space-between' }}
            >
              <BlogAuthor {...(user as User)} createdAt={createdAt} />
            </div>
            <p
              className="text-dark"
              style={{
                display: 'inline-block',
                paddingLeft: '10px',
              }}
            >
              {post.sharedPost.text}
            </p>
            {!post.sharedPost.media ? null : (
              <MediaDetails
                media={post.sharedPost.media}
                flag={true}
                postContent={post.sharedPost.text}
              />
            )}
            <Card.Body className="mb-0"></Card.Body>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="mt-0">
        <div>
          <button onClick={openInputFile} className="btn btn-sm btnIcon">
            <input
              type="file"
              ref={inputBtn}
              className="d-none"
              onChange={(e) => target(e)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="27"
              height="27"
              fill="#f91880"
              className="bi bi-card-media"
              viewBox="0 0 16 16"
            >
              <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
              <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z" />
            </svg>
          </button>
        </div>
        {!post.text ? (
          <Button variant="primary" disabled className="btn btn-md disabled1">
            post
          </Button>
        ) : (
          <Button
            variant="primary"
            className="btn btn-md modal-btn"
            onClick={() => sharePost(sharePostData)}
          >
            post
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default SharePost;
