import { Avatar } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { Button, Col, Image, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { defaultAvatar, defaultCover } from '../../../assets/icons';
import { Verified } from '../../../assets/svg/verified';
import { AvatarStyle, NewUserAvatar } from '../../../dummy/NewUserAvatar';
import API from '../../../lib/API';
import useAuthGuard from '../../../lib/index';
import { getUser } from '../../../lib/requests/user';
import {
  followAction,
  getFollowersAction,
  setCover,
  setDynamicId,
} from '../../../redux/actions';
import { ReduxState, User } from '../../../redux/interfaces';
import Loader from '../../loader/Loader';
import RecentPosts from '../recentPost/RecentPosts';
import Cover from './Cover';
import EditProfile from './EditProfile';
import './styles.scss';
import UpdateImage from './UpdateImage';

const UserProfile: FC = () => {
  useAuthGuard();

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    following,
    cover,
    user: loggedInUser,
  } = useSelector((state: ReduxState) => state.data);

  const [show, setShow] = useState(false);
  const [pic, setPic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const handleShow = () => setShow(true);
  const handlePic = () => setPic(true);

  const me = loggedInUser?.userName;
  const currentUser = me === id ? loggedInUser : user;
  const follower = { userToFollow: currentUser?.userName };

  const follow = async () => {
    try {
      const { data } = await API.post(`/users/current-user/follow`, follower);
      if (data) {
        if (id) dispatch(getFollowersAction(id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggle = () => {
    following === false ? nowFollow() : unfollow();
  };

  const nowFollow = async () => {
    await follow();
    dispatch(followAction(true));
  };

  const unfollow = async () => {
    await follow();
    dispatch(followAction(false));
  };

  useEffect(() => {
    dispatch(setCover(loggedInUser.cover));
  }, []);

  useEffect(() => {
    dispatch(setDynamicId(id));
    if (id) getUser(id).then(setUser);
  }, [id, following]);

  return user ? (
    <>
      <Row
        id="userProfileContainer"
        className="justify-content-center"
        style={{ marginTop: '90px' }}
      >
        <Col
          className="userJumbo magicRow jumbotron-banner1 p-0 pb-3"
          sm={12}
          md={10}
          lg={7}
        >
          <Row className="magicRow d-flex p-0">
            <Col sm={6} md={7} lg={7} className="coverDiv">
              {id !== me ? (
                <>
                  {!currentUser?.cover ? (
                    <img
                      className="cover mb-2"
                      src={defaultCover}
                      alt="new Cover"
                      height="250px"
                    />
                  ) : (
                    <img
                      className="cover mb-2"
                      src={currentUser?.cover}
                      alt=""
                      height="250px"
                    />
                  )}
                </>
              ) : (
                // Cover container
                <div>
                  <img
                    className="cover mb-2"
                    src={cover ? cover : defaultCover}
                    alt=""
                    height="250px"
                  />
                </div>
              )}
            </Col>

            {/*Cover Modal*/}
            <div className="coverModal">{id !== me ? null : <Cover />}</div>

            <div id="user-details" className="d-flex px-4 col-lg-10">
              <div className="imgDiv ml5">
                {!currentUser?.image ? (
                  <Avatar
                    onClick={handlePic}
                    sx={{
                      width: 130,
                      height: 130,
                    }}
                    children={
                      <NewUserAvatar
                        firstName={String(currentUser?.firstName)}
                        lastName={String(currentUser?.lastName)}
                        className={AvatarStyle.PROFILE}
                      />
                    }
                  />
                ) : (
                  <Image
                    roundedCircle
                    id="profile-pic"
                    onClick={handlePic}
                    src={
                      currentUser?.image ? currentUser?.image : defaultAvatar
                    }
                    alt="ProfilePicture"
                    width="130"
                    height="130"
                  />
                )}

                <div>
                  <div className="nameHeader ">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </div>
                  <div className="">lives in {currentUser?.location}</div>
                  <div className="">{currentUser?.bio}</div>
                  {(currentUser?.followers?.length as number) > 1 ? (
                    <span
                      className=" followers-link"
                      onClick={() => navigate(`/followers/${currentUser?.id}`)}
                    >
                      {currentUser?.followers?.length} followers
                    </span>
                  ) : null}
                  {currentUser?.followers?.length === 1 ? (
                    <span
                      className=" followers-link"
                      onClick={() => navigate(`/followers/${user?.id}`)}
                    >
                      {currentUser?.followers?.length} follower
                    </span>
                  ) : null}
                  {currentUser?.followers?.length === 0 ? (
                    <span className=" followers-link">
                      {currentUser?.followers?.length} follower
                    </span>
                  ) : null}
                </div>
              </div>

              <UpdateImage
                xUser={user}
                show={pic}
                setShow={setPic}
                handlePic={handlePic}
              />

              <div className="text-left ml-auto justify-content-center">
                <br />
                <div className="d-flex justify-content-center mb-3">
                  {currentUser?.isVerified && (
                    <div className=" mt-1  d-flex-row align-items-center">
                      {Verified}
                    </div>
                  )}
                </div>
                <Col md={12} lg={12}>
                  {id !== me ? null : (
                    <Button
                      onClick={handleShow}
                      variant="white"
                      className="nowfollowing text-white"
                    >
                      <p id="edit-profile1">edit Profile</p>
                    </Button>
                  )}
                  {id !== me && (
                    <p>
                      {!currentUser?.followers?.some(
                        (user) => user.userName === me
                      ) ? (
                        <Button
                          onClick={toggle}
                          variant="primary"
                          className="followbtn mt-2"
                        >
                          follow
                        </Button>
                      ) : (
                        <Button
                          onClick={toggle}
                          variant="primary"
                          className="nowfollowing mt-2"
                        >
                          following
                        </Button>
                      )}
                    </p>
                  )}
                  <EditProfile show={show} setShow={setShow} />
                </Col>
              </div>
            </div>
          </Row>
          <Col className="recentDiv">
            <RecentPosts />
          </Col>
        </Col>
      </Row>
      {/* <Col lg={12} className="justify-content-center">
      <Footer />
      </Col> */}
    </>
  ) : (
    <div className="text-center">{loading && <Loader />}</div>
  );
};

export default UserProfile;
