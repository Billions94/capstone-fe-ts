import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { follow } from "../../../lib/requests/user";
import {
  followAction,
  getFollowersAction,
  getPosts,
} from "../../../redux/actions";
import { User } from "../../../redux/interfaces";
import { ReduxState } from "../../../redux/interfaces";
import { defaultAvatar } from "../../../assets/icons";

interface Props {
  show: boolean;
  props: User | null;
  handleShow: () => void;
  setTimer: Dispatch<SetStateAction<boolean>>;
  handleClose: () => void;
}

const UserInfo: FC<Props> = ({
  show,
  handleShow,
  handleClose,
  setTimer,
  props,
}: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, followers } = useSelector((state: ReduxState) => state.data);
  const me = user!._id;

  const followUser = {
    userId: me,
    following: {
      followingUserID: props!._id
    },
    dispatch,
  }

  type FollowUser = typeof followUser;

  const toggle = (followUser: FollowUser) => {
    !followers ? nowFollow(followUser) : unfollow(followUser);
  };

  const nowFollow = (followUser: FollowUser) => {
    follow(followUser);
    dispatch(followAction(true));
  };
  const unfollow = (followUser: FollowUser) => {
    follow(followUser);
    dispatch(followAction(false));
  };

  useEffect(() => {
    dispatch(getFollowersAction(props?._id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {show === true && (
        <div
          id="userInfo"
          onMouseEnter={() => {
            handleShow();
          }}
          onMouseLeave={() => {
            handleClose();
            setTimer(true);
          }}
        >
          <div className="p-2 userInfoContainer">
            <div className="d-flex">
              <div
                id="userDetails"
                onClick={() => navigate(`/userProfile/${props?._id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={props?.image ? props?.image : defaultAvatar}
                  alt=""
                  className="roundpic"
                  width={47}
                  height={47}
                />
                <div className="">
                  <h5 className="userDetails mb-0">
                    {props?.firstName} {props?.lastName}
                    {props?.isVerified === true && (
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
                    @{props?.userName}
                  </span>
                </div>
              </div>
              {props?._id !== me && (
                <div className="ml-auto">
                  {!followers.some((elem) => elem._id === me) ? (
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
            <div>{props?.bio}</div>
            <div className="followers1">
              {props!.followers!.length > 1 ? (
                <span
                  className="customLinks1"
                  onClick={() => navigate(`/followers/${props?._id}`)}
                >
                  {props?.followers?.length} followers
                </span>
              ) : null}
              {props!.followers!.length === 1 ? (
                <span
                  className="customLinks1"
                  onClick={() => navigate(`/followers/${props?._id}`)}
                >
                  {props?.followers?.length} follower
                </span>
              ) : null}
              {props?.followers!.length === 0 ? (
                <span className="customLinks1">
                  {props?.followers?.length} follower
                </span>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
