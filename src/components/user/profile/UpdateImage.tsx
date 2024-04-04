import { Modal, Button } from 'react-bootstrap';
import {
  useState,
  Dispatch,
  SetStateAction,
  createRef,
  useEffect,
  FC,
} from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ReduxState, User } from '../../../redux/interfaces';
import API from '../../../lib/API';
import {
  getPosts,
  getUsersAction,
  saveUserAction,
} from '../../../redux/actions';
import React from 'react';
import { AvatarStyle, NewUserAvatar } from '../../../dummy/NewUserAvatar';
import { Avatar } from '@mui/material';
import Loader from '../../loader/Loader';

interface Props {
  xUser: User;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  getUser: () => Promise<void>;
  handlePic: () => void;
}

const UpdateImage: FC<Props> = ({
  xUser,
  show,
  setShow,
  getUser,
  handlePic,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state: ReduxState) => state.data);
  const me = user?.id;

  const [image, setImage] = useState<string>('');
  const [update, setUpdate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const target = (e: any) => {
    if (e.target && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const inputBtn = createRef<HTMLInputElement>();

  const openInputFile = () => {
    inputBtn?.current?.click();
  };
  const handleClose = () => setShow(false);

  const updateProfilePic = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', image);

      const { data } = await API.patch(`/users/me/profilePic`, formData);

      if (data) {
        setShow(false);
        setUpdate(data?.image);
        await getUser();

        setTimeout(function () {
          setLoading(false);
        }, 2400);
        setTimeout(function () {
          setShow(false);
        }, 2500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getUsersAction());
  }, [update]);

  return (
    <div>
      <Modal
        id="updatePicModal"
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="imgWrapper">
            {id !== me ? (
              <img
                className="ProfilePicture"
                src={xUser?.image}
                alt="ProfilePicture"
                width="430px"
                height="430px"
              />
            ) : (
              <>
                {!user?.image ? (
                  <Avatar
                    onClick={handlePic}
                    sx={{
                      width: 430,
                      height: 430,
                    }}
                    children={
                      <NewUserAvatar
                        firstName={String(user?.firstName)}
                        lastName={String(user?.lastName)}
                        className={AvatarStyle.MODAL}
                      />
                    }
                  />
                ) : (
                  <img
                    className="ProfilePicture"
                    src={user?.image}
                    alt="ProfilePicture"
                    width="430px"
                    height="430px"
                  />
                )}
              </>
            )}
          </div>
        </Modal.Body>
        {id !== me ? null : (
          <Modal.Footer>
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
                  width="32"
                  height="32"
                  fill="#f91880"
                  className="bi bi-card-image"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                  <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z" />
                </svg>
                {/* <div className="addPhoto">
                        add Photo
                    </div> */}
              </button>
            </div>
            {!image ? (
              <Button disabled variant="primary" className="modal-btn">
                <p>update</p>
              </Button>
            ) : (
              <Button
                onClick={updateProfilePic}
                variant="primary"
                className="modal-btn"
              >
                {loading ? (
                  <Loader
                    color={'white'}
                    marginTop={'0px'}
                    width={'28px'}
                    height={'28px'}
                  />
                ) : (
                  <p>update</p>
                )}
              </Button>
            )}
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
};

export default UpdateImage;
