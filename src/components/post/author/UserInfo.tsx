import { FC, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { defaultAvatar } from '../../../assets/icons';
import { useHoverState } from '../../../components/hooks/useHoverState';
import { follow } from '../../../lib/requests/user';
import { followAction, getFollowersAction } from '../../../redux/actions';
import { User } from '../../../redux/interfaces';
import { GET_STORE } from '../../../redux/store';

interface Props {
  show?: boolean;
  userFromProps?: User;
}

const UserInfo: FC<Props> = ({ show, userFromProps }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleShow } = useHoverState();

  const {
    data: { user: loggedInUser, followers },
  } = useSelector(GET_STORE);
  const me = loggedInUser?.id;

  const followUser = {
    userId: me,
    following: {
      followingUserID: String(userFromProps?.id),
    },
    dispatch,
  };

  type FollowUser = typeof followUser;

  const toggle = (followUser: FollowUser) => {
    !followers ? nowFollow(followUser) : unFollow(followUser);
  };

  const nowFollow = async (followUser: FollowUser) => {
    await follow(followUser);
    dispatch(followAction(true));
  };
  const unFollow = async (followUser: FollowUser) => {
    await follow(followUser);
    dispatch(followAction(false));
  };

  useEffect(() => {
    if (show)
      if (userFromProps?.userName)
        dispatch(getFollowersAction(userFromProps.userName));
  }, [show]);

  return show ? (
    <div
      id="userInfo"
      onMouseEnter={() => handleShow(true)}
      onMouseLeave={() => handleShow(false)}
    >
      <div className="p-2 userInfoContainer">
        <div className="d-flex">
          <div
            id="userDetails"
            onClick={() => navigate(`/userProfile/${userFromProps?.userName}`)}
            style={{ cursor: 'pointer' }}
          >
            <LazyLoadImage
              src={userFromProps?.image ? userFromProps?.image : defaultAvatar}
              alt=""
              className="roundpic"
              width={47}
              height={47}
            />
            <div className="">
              <h5 className="userDetails mb-0">
                {userFromProps?.firstName} {userFromProps?.lastName}
                {userFromProps?.isVerified === true && (
                  <span className=" ml-1">
                    <img
                      alt=""
                      className="mr-2"
                      width="15"
                      src="https://img.icons8.com/ios-filled/50/4a90e2/verified-account.png"
                    />
                  </span>
                )}
              </h5>
              <span className="userUserName text-muted">
                @{userFromProps?.userName}
              </span>
            </div>
          </div>
          {userFromProps?.id !== me && (
            <div className="ml-auto">
              {!followers.some((elem) => elem.id === me) ? (
                <Button
                  onClick={() => toggle(followUser)}
                  size="sm"
                  variant="primary"
                  className="followbtn ml-auto"
                >
                  follow
                </Button>
              ) : (
                <Button
                  onClick={() => toggle(followUser)}
                  size="sm"
                  variant="primary"
                  className="nowfollowing ml-auto"
                >
                  following
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="bio">{userFromProps?.bio}</div>
        <div className="followers-user-info">
          {Number(userFromProps?.followers?.length) > 1 ? (
            <span
              className="followers-link"
              onClick={() => navigate(`/followers/${userFromProps?.id}`)}
            >
              {userFromProps?.followers?.length} followers
            </span>
          ) : null}
          {Number(userFromProps?.followers?.length) === 1 ? (
            <span
              className="followers-link"
              onClick={() => navigate(`/followers/${userFromProps?.id}`)}
            >
              {userFromProps?.followers?.length} follower
            </span>
          ) : null}
          {Number(userFromProps?.followers?.length) === 0 ? (
            <span className="followers-link">
              {userFromProps?.followers?.length} follower
            </span>
          ) : null}
        </div>
      </div>
    </div>
  ) : null;
};

export default UserInfo;
