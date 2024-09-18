import React, { createRef, Dispatch, SetStateAction, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch, useSelector } from 'react-redux';
import API, { apiUrl } from '../../../../lib/API';
import { ReduxState } from '../../../../redux/interfaces';

interface Props {
  id: string;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  handleClose: () => void;
}

export interface Comments {
  text: string;
  user: string | undefined;
}

const CommentModal: React.FC<Props> = ({ id, show, setShow }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: ReduxState) => state.data);
  const userId = user?.id;

  const [comments, setComments] = useState<Comments>({
    text: '',
    user: userId,
  });
  const [media, setMedia] = useState<string>('');
  const handleClose = () => setShow(false);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${apiUrl}/comments`);
      if (response.ok) {
        const data = await response.json();
        const reverseComments = data.comments.reverse();
        setComments(reverseComments);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const postComment = async () => {
    if (media) {
      try {
        const { data } = await API.post(`/comments/${id}`, comments);

        if (data) {
          try {
            const formData = new FormData();
            formData.append('media', media);

            const { data: mediaResponse } = await API.patch(
              `/comments/${data.data.comments[0]._id}/upload`,
              formData
            );

            if (mediaResponse) {
              await fetchComments();
              setComments({
                text: '',
                user: userId,
              });
              setShow(false);
            }
          } catch (error) {
            console.log(error);
          }
        }
      } catch ({ message }) {
        console.error(message);
      }
    } else {
      try {
        const { data } = await API.post(`/comments/${id}`, comments);

        if (data) {
          await fetchComments();
          setComments({
            text: '',
            user: userId,
          });
          setShow(false);
        }
      } catch ({ message }) {
        console.error(message);
      }
    }
  };

  const target = (e: any) => e.target && setMedia(e.target.files[0]);
  const inputBtn = createRef<HTMLInputElement>();
  const openInputFile = () => inputBtn?.current?.click();

  return (
    <React.Fragment>
      <Modal
        id="postModal"
        centered
        show={show}
        onHide={handleClose}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-dark">Post a comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex userInfoContainer">
            <div>
              <LazyLoadImage
                src={user?.image}
                alt=""
                className="roundpic"
                width={47}
                height={47}
              />
            </div>
            <div className="ml-2 userInfo">
              <span>
                {user?.firstName} {user?.lastName}
                {user?.isVerified && (
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
              placeholder="what's poppin?"
              as="textarea"
              className="textarea"
              rows={5}
              value={comments.text}
              onChange={(e) =>
                setComments({
                  ...comments,
                  text: e.target.value,
                })
              }
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="mt-0">
          <div>
            <button onClick={openInputFile} className="btn btn-sm btnIcon">
              <input
                type="file"
                ref={inputBtn}
                className="d-none"
                onChange={target}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="27"
                height="27"
                fill="#f91880"
                className="bi bi-card-image"
                viewBox="0 0 16 16"
              >
                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z" />
              </svg>
            </button>
          </div>
          {!comments.text ? (
            <Button
              variant="primary"
              disabled
              className="btn btn-md modal-btn"
              onClick={postComment}
            >
              post
            </Button>
          ) : (
            <Button
              variant="primary"
              className="btn btn-md modal-btn"
              onClick={postComment}
            >
              post
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default CommentModal;
