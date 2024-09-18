import { Avatar } from '@mui/material';
import Picker from 'emoji-picker-react';
import {
  createRef,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useState,
} from 'react';
import { Row } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { defaultAvatar } from '../../assets/icons';
import { AvatarStyle, NewUserAvatar } from '../../dummy/NewUserAvatar';
import { createPost } from '../../lib/requests/post';
import { ReduxState } from '../../redux/interfaces';
import Loader from '../loader/Loader';

interface PostContainerProps {
  fetchLoading: boolean;
  setFetchLoading: Dispatch<SetStateAction<boolean>>;
}

const PostContainer = ({
  fetchLoading,
  setFetchLoading,
}: PostContainerProps) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: ReduxState) => state.data);
  const userName = user?.userName;

  const [post, setPost] = useState({ text: '' });
  const [media, setMedia] = useState<string>('');
  const [show, setShow] = useState(false);

  const [emoji, setEmoji] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const newPostData = {
    userName,
    post,
    media,
    setMedia,
    setPost,
    setFetchLoading,
    dispatch,
  };

  const toggleEmoji = () => {
    !showEmoji ? setShowEmoji(true) : setShowEmoji(false);
  };

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleEmojiShow = () => setEmoji(true);
  const handleEmojiClose = () => setEmoji(false);

  const target = (e: any) => e.target.files && setMedia(e.target.files[0]);
  const inputBtn = createRef<HTMLInputElement>();
  const openInputFile = () => inputBtn?.current?.click();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [chosenEmoji, setChosenEmoji] = useState('');

  const onEmojiClick = (event: any, emojiObject: any) =>
    setChosenEmoji(emojiObject);

  const handleKeyboardEvent = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await createPost(newPostData);
    }
  };

  return (
    <Row id="Row" className="justify-content-center mb-0">
      <div className="col">
        <div className="postContainer">
          <div className="userImage">
            <Link
              style={{ textDecoration: 'none' }}
              to={`/userProfile/${user.userName}`}
            >
              {!user.image ? (
                <Avatar
                  sx={{
                    width: 47,
                    height: 47,
                  }}
                  children={
                    <NewUserAvatar
                      firstName={user.firstName}
                      lastName={user.lastName}
                      className={AvatarStyle.PROFILE}
                    />
                  }
                />
              ) : (
                <LazyLoadImage
                  className="img rounded-circle"
                  src={user.image ? user.image : defaultAvatar}
                  alt="ProfilePicture"
                  width="47"
                  height="47"
                />
              )}
            </Link>
          </div>
          <div className="p-2 w-100">
            <div className="textareaborder">
              <textarea
                className="form-control textarea"
                rows={2}
                placeholder="start typing to share your thoughts...."
                value={post.text}
                onKeyPress={(e: any) => handleKeyboardEvent(e)}
                onChange={({ target: { value } }) =>
                  setPost({ ...post, text: value })
                }
              />
            </div>
            <div className="d-flex sharebtn">
              <>
                <div className="relative">
                  <button
                    onMouseEnter={handleShow}
                    onMouseLeave={handleClose}
                    onClick={openInputFile}
                    className="btn btn-sm btnIcon"
                  >
                    <input
                      type="file"
                      ref={inputBtn}
                      className="d-none"
                      onChange={target}
                    />

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="#f91880"
                      className="bi bi-card-image"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                      <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z" />
                    </svg>
                  </button>
                  {!show ? null : (
                    <div className="absolute">
                      <span className="badge text-muted">Media</span>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onMouseEnter={handleEmojiShow}
                    onMouseLeave={handleEmojiClose}
                    className="btn btn-sm btnIcon"
                  >
                    <svg
                      onClick={toggleEmoji}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="#f91880"
                      className="bi bi-emoji-smile"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                      <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
                    </svg>
                  </button>
                  {!emoji ? null : (
                    <div className="absolute">
                      <span className="badge text-muted">Emojis</span>
                    </div>
                  )}
                </div>

                {!showEmoji ? null : (
                  <div style={{ zIndex: '10px' }}>
                    <Picker
                      onEmojiClick={onEmojiClick}
                      pickerStyle={{ width: '100%' }}
                    />
                  </div>
                )}
              </>
              <div className="mar-top clearfix mt-2 ml-auto">
                {!post.text ? (
                  <button disabled className="btn btn-md disabled1">
                    <i className="fa fa-pencil fa-fw" /> Post
                  </button>
                ) : (
                  <button
                    className="btn btn-md modal-btn"
                    onClick={() => createPost(newPostData)}
                  >
                    <i className="fa fa-pencil fa-fw" /> Post
                  </button>
                )}
              </div>
            </div>
          </div>
          <>
            {fetchLoading && (
              <Loader
                {...{
                  position: 'absolute',
                  top: '-240px',
                  right: '10px',
                }}
              />
            )}
          </>
        </div>
      </div>
    </Row>
  );
};

export default PostContainer;
