import Picker from 'emoji-picker-react';
import React from 'react';
import { Dropdown, Form, Image } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { defaultAvatar } from '../../../assets/icons';
import { dateFormatter } from '../../../lib';
import { deleteComment } from '../../../lib/requests/comment';
import { Comment, Post, ReduxState, Reply } from '../../../redux/interfaces';
import { useInput } from '../../hooks/useInput';
import ReplyComponent from '../../post/reply/Reply';
import { replyInput } from './inputs';
import { ReplyInput } from './interface';

interface SingleCommentProps {
  post: Post;
  comment: Comment;
  comments: Comment[];
  fetchComments: () => Promise<Comment[]>;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const SingleComment: React.FC<SingleCommentProps> = ({
  post,
  comment,
  fetchComments,
  setComments,
}) => {
  const apiUrl = process.env.REACT_APP_GET_URL;
  const [media, setMedia] = React.useState<string>('');
  const [showEmoji, setShowEmoji] = React.useState(false);
  const { user } = useSelector((state: ReduxState) => state.data);
  const me = user?.id;

  const {
    input: reply,
    handleChange,
    setInput,
  } = useInput<ReplyInput>(replyInput);

  const [show, setShow] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [Reply, setReply] = React.useState<Reply[]>();

  const toggle = () => {
    !show ? setShow(true) : setShow(false);
  };

  const target = (e: any) => {
    if (e.target.files) setMedia(e.target.files[0]);
  };

  const replyComment = async (c: Comment) => {
    if (media) {
      try {
        const response = await fetch(`${apiUrl}/Reply/${c.id}`, {
          method: 'POST',
          body: JSON.stringify(reply),
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const replyData = await response.json();
          const newReply = replyData.Reply.pop();

          try {
            const formDt = new FormData();
            formDt.append('media', media);
            const addMedia = await fetch(`${apiUrl}/Reply/${newReply}/upload`, {
              method: 'PATCH',
              body: formDt,
            });
            if (addMedia.ok) {
              setShow(false);
              await getReply();
              await fetchComments();
            }
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log('oops we encountered an error', error);
      }
    } else {
      try {
        const response = await fetch(`${apiUrl}/Reply/${c.id}`, {
          method: 'POST',
          body: JSON.stringify(reply),
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          setInput({
            text: '',
            userId: user?.id,
          });
          setShow(false);
          await getReply();
          await fetchComments();
        }
      } catch (error) {
        console.log('oops we encountered an error', error);
      }
    }
  };

  const getReply = async () => {
    try {
      const response = await fetch(`${apiUrl}/Reply`);
      if (response.ok) {
        const data: Reply[] = await response.json();
        console.log('reply info', data);
        setReply(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostData = {
    commentId: comment.id,
    setComments,
  };

  const inputBtn = React.createRef<HTMLInputElement>();
  const openInputFile = () => inputBtn?.current?.click();

  // Emojis
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [chosenEmoji, setChosenEmoji] = React.useState(null);

  const onEmojiClick = (event: any, emojiObject: any) =>
    setChosenEmoji(emojiObject);

  return (
    <div key={comment.id} className="mt-2">
      <div className="cardHeader">
        <div className="d-flex">
          <Link to={`/userProfile/${comment.user.userName}`}>
            <div>
              <LazyLoadImage
                className="d-block g-width-50 g-height-50 rounded-circle g-mt-3 g-mr-15"
                src={comment.user.image ? comment.user.image : defaultAvatar}
                alt="Image Description"
                width={50}
                height={50}
              />
            </div>
          </Link>
          <div className="cAndR position-relative">
            <div className="d-flex customBB">
              <div className="text-dark posted mb-2">
                Posted: {dateFormatter(comment.createdAt)}
              </div>
              {comment.user.id !== me ? null : (
                <Dropdown className="dropdowntext ml-auto" id={comment.user.id}>
                  <Dropdown.Toggle className="btn btn-dark dropdownbtn">
                    <div className="text-dark dots">
                      <b>
                        <strong>•••</strong>
                      </b>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    className="dropDownMenu"
                    style={{
                      padding: '18px',
                      borderRadius: '25px',
                      border: '1px solid rgb(216, 215, 215)',
                    }}
                  >
                    {/* <Edit /> */}
                    <div className="d-flex customLinks">
                      <div className="mr-3">
                        <img
                          alt=""
                          className="lrdimg"
                          width="17px"
                          src="https://img.icons8.com/fluency/50/000000/delete-sign.png"
                        />
                      </div>
                      <div onClick={() => deleteComment(deletePostData)}>
                        delete
                      </div>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </div>
            <div className="text-dark mb-2 userInfo">
              {comment.user.firstName} {comment.user.lastName}
            </div>
            <div className="commentText">
              <p className="text-dark">{comment.content}</p>
              <div className="mt-2">
                {!comment.media
                  ? null
                  : comment.media &&
                    comment.media
                      .split('.')
                      .slice(-1)
                      .join()
                      .match(`heic|png|jpg|pdf|jpeg`) && (
                      <img className="img" src={comment.media} alt="" />
                    )}
                {!comment.media
                  ? null
                  : comment.media
                      .split('.')
                      .slice(-1)
                      .join()
                      .match(`mp4|MPEG-4|mkv`) && (
                      <video
                        src={comment.media}
                        className="post-video"
                        controls
                        autoPlay
                        muted
                      ></video>
                    )}
              </div>
            </div>
            <span
              onClick={toggle}
              className={!comment.media ? 'replyspan' : 'replyspan1'}
            >
              Reply
            </span>
          </div>
        </div>

        <ReplyComponent post={post} comment={comment} commentID={comment.id} />

        {!show ? null : (
          <div className="reply">
            <Link to={`/userProfile/${user.id}`}>
              <div className="mt-2">
                <Image
                  roundedCircle
                  src={user.image}
                  alt=""
                  className="d-block rounded-circle g-mt-3 g-mr-15"
                  width={37}
                  height={37}
                />
              </div>
            </Link>

            <div className="textAreaDm w-100">
              <div id="textArea-container" className="panel-body">
                <svg
                  id="input-icon1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="10px"
                  height="10px"
                  fill="#f91880"
                  className="bi bi-emoji-smile ml-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
                </svg>
                {!showEmoji ? null : (
                  <Picker
                    onEmojiClick={onEmojiClick}
                    pickerStyle={{ width: '100%' }}
                  />
                )}
                <div>
                  {!reply.text ? (
                    <div>
                      <input
                        type="file"
                        ref={inputBtn}
                        className="d-none"
                        onChange={target}
                      />
                      <svg
                        id="input-icon"
                        onClick={openInputFile}
                        xmlns="http://www.w3.org/2000/svg"
                        width="50px"
                        height="18"
                        fill="#f91880"
                        className="bi bi-card-image btn btn-sm uploadicons"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                        <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z" />
                      </svg>
                    </div>
                  ) : (
                    <button
                      className="btn ml-auto btn-sm sendBtnDm"
                      onClick={() => replyComment(comment)}
                    >
                      <i className="fa fa-pencil fa-fw" /> send
                    </button>
                  )}
                </div>
                <Form.Control
                  className="form-control dmText search"
                  placeholder="Write a comment..."
                  name="text"
                  value={reply.text}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleComment;
