import { createRef, Dispatch, FC, SetStateAction, useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { InputSVG } from '../../../assets/svg/inputSVG';
import { Verified } from '../../../assets/svg/verified';
import { FormControlSize } from '../../../components/auth/interfaces';
import { useInput } from '../../../components/hooks/useInput';
import useAuthGuard from '../../../lib/index';
import { updatePost } from '../../../lib/requests/post';
import { GET_STORE } from '../../../redux/store';
import { MediaDetails } from './MediaDetails';
import './styles.scss';

interface Props {
  data: {
    postId?: string;
    reload: boolean;
    setReload: Dispatch<SetStateAction<boolean>>;
  };
}

const Edit: FC<Props> = ({ data: { postId, reload, setReload } }) => {
  useAuthGuard();
  const dispatch = useDispatch();
  const [show, setShow] = useState<boolean>(false);
  const [media, setMedia] = useState<string>('');
  const { user, posts } = useSelector(GET_STORE).data;

  const postToEdit = posts.find((post) => post.id === postId);
  const previousPost = {
    text: postToEdit?.text ?? '',
    media: media ? media : postToEdit?.media ?? '',
  };

  const { input, handleChange } = useInput(previousPost);
  const target = (e: any) => e.target && setMedia(e.target.files[0]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const inputBtn = createRef<HTMLInputElement>();

  const openInputFile = () => {
    inputBtn?.current?.click();
  };

  const updatePostData = {
    post: {
      text: input.text,
      media: media ? media : postToEdit?.media,
    },
    media,
    setMedia,
    postId: postId as string,
    setShow,
    dispatch,
    refresh: reload,
    setRefresh: setReload,
  };

  return (
    <Container className="new-blog-container p-0 mb-0 mt-0">
      <div className="d-flex customLinks" style={{ paddingTop: '-110px' }}>
        <div style={{ cursor: 'pointer' }}>
          <img
            alt=""
            className="lrdimg"
            width="17px"
            src="https://img.icons8.com/ios-filled/50/000000/edit--v1.png"
          />
        </div>

        <button
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            color: 'inherit',
          }}
          className="primary"
          onClick={handleShow}
        >
          <div style={{ marginLeft: '15px' }}>
            <span className="text-dark">edit</span>
          </div>
        </button>

        <Modal
          id="editModal"
          centered
          animation={true}
          show={show}
          onHide={handleClose}
          size={FormControlSize.LG}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-dark">edit Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex userInfoContainer">
              <Link to={`/userProfile/${user.userName}`}>
                <LazyLoadImage
                  src={user?.image}
                  alt=""
                  className="roundpic"
                  width={40}
                  height={40}
                />
              </Link>
              <div className="ml-2 userInfo">
                <span className="text-dark">
                  {user?.firstName} {user?.lastName}
                  {user?.isVerified && (
                    <span className=" mt-1 ml-1  d-flex-row align-items-center">
                      {Verified}
                    </span>
                  )}
                </span>
              </div>
            </div>
            <Form.Group controlId="blog-content" className="form1 mt-3">
              <Form.Control
                placeholder="wanna change something?"
                as="textarea"
                className="textarea text-white"
                name="text"
                rows={5}
                value={input.text}
                onChange={handleChange}
              />
            </Form.Group>

            {postToEdit?.media ? (
              <MediaDetails {...{ media: postToEdit?.media }} />
            ) : postToEdit?.sharedPost ? (
              <MediaDetails
                {...{
                  media: postToEdit?.sharedPost.media,
                  postContent: postToEdit?.sharedPost.text,
                  flag: true,
                }}
              />
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <div>
              <button onClick={openInputFile} className="btn btn-sm btnIcon">
                <input
                  type="file"
                  ref={inputBtn}
                  className="d-none"
                  onChange={(e) => target(e)}
                />
                {InputSVG}
              </button>
            </div>
            {!input.text ? (
              <Button
                variant="primary"
                disabled
                className="btn btn-md modal-btn"
              >
                update
              </Button>
            ) : (
              <Button
                variant="primary"
                className="btn btn-md modal-btn"
                onClick={() => updatePost(updatePostData)}
              >
                update
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
};
export default Edit;
