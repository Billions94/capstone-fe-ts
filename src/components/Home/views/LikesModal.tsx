import React, { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FollowUser } from '../../../lib/requests/interfaces/user.interface';
import { getPosts } from '../../../lib/requests/post';
import { follow } from '../../../lib/requests/user';
import { followAction, getUsersAction } from '../../../redux/actions';
import { Post, ReduxState } from '../../../redux/interfaces';

interface Props {
  likeShow: boolean;
  setLikeShow: Dispatch<SetStateAction<boolean>>;
  post: Post;
}

const LikesModal: FC<Props> = ({ likeShow, setLikeShow, post }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { following } = useSelector((state: ReduxState['data']) => state);
  const newUser = useSelector((state: ReduxState) => state.data.user);

  const me = newUser?.id;

  const followUserData = {
    userId: me,
    following: {
      followingUserID: '',
    },
    dispatch,
  };

  function returnFollowerData(
    userToFollowId: string,
    followerUserData: FollowUser
  ): FollowUser {
    return {
      userId: followerUserData.userId,
      following: {
        followingUserID: userToFollowId,
      },
      dispatch: followUserData.dispatch,
    };
  }

  const toggle = (followUser: FollowUser) => {
    !following ? nowFollow(followUser) : unfollow(followUser);
  };

  const nowFollow = async (followUser: FollowUser) => {
    await follow(followUser);
    dispatch(followAction(true));
    dispatch(getUsersAction());
  };
  const unfollow = async (followUser: FollowUser) => {
    await follow(followUser);
    dispatch(followAction(false));
    dispatch(getUsersAction());
  };

  useEffect(() => {
    (async () => await getPosts(dispatch))();
  }, [following]);

  return (
    <div>
      <Modal
        id="likesModal"
        style={{ borderRadius: '20px' }}
        show={likeShow}
        centered
        onHide={() => setLikeShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <div>Liked by</div>
        </Modal.Header>
        <Modal.Body>
          {post?.likes?.map((user) => (
            <div
              key={user.userName}
              id="searchContainer"
              className="d-flex mt-2"
            >
              <div
                onClick={() => navigate(`/userProfile/${user?.id}`)}
                className="linkToProfile"
              >
                <LazyLoadImage
                  className="profile-pic"
                  src={user?.image}
                  alt=""
                />
                <div className="ml-2">
                  <h6 className="firstandlastname">
                    {user?.firstName} {user?.lastName}
                    {user?.isVerified === true && (
                      <span className=" ml-1">
                        <img
                          alt=""
                          className="mr-2"
                          width="15"
                          src="https://img.icons8.com/ios-filled/50/4a90e2/verified-account.png"
                        />
                      </span>
                    )}
                  </h6>
                  <h6 className="text-muted username">@{user?.userName}</h6>
                  <h6 className="bio">{user?.bio}</h6>
                </div>
              </div>
              <div className="ml-auto">
                {user?.id !== me ? (
                  <div className="ml-auto">
                    {user.followers.some(
                      (follower: any) => follower === newUser.id
                    ) ? (
                      <Button
                        onClick={() =>
                          toggle(returnFollowerData(user?.id, followUserData))
                        }
                        size="sm"
                        variant="primary"
                        className="nowfollowing ml-auto"
                      >
                        following
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          toggle(returnFollowerData(user?.id, followUserData))
                        }
                        size="sm"
                        variant="primary"
                        className="followbtn ml-auto"
                      >
                        follow
                      </Button>
                    )}
                  </div>
                ) : null}
                {/* <SingleUser toggle={toggle} following={following} user={user} me={me} /> */}
              </div>
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LikesModal;
