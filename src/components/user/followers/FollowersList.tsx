import { Avatar } from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import API from '../../../lib/API';
import { ReduxState, User } from '../../../redux/interfaces';
import FollowButton from './FollowButton';

interface FollowersListProps {
  f: User;
  id: string | undefined;
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

const FollowersList: React.FC<FollowersListProps> = ({
  f,
  refresh,
  setRefresh,
}) => {
  const { user, followers, following } = useSelector(
    (state: ReduxState) => state.data
  );
  const me = user?.id;

  // const [following, setFollowing] = useState(false)
  const follower = { followerId: user?.id };

  const follow = async (userId: string) => {
    try {
      const { data } = await API.post(`/users/${userId}/follow`, follower);
      if (data) {
        !refresh ? setRefresh(true) : setRefresh(false);
      } else {
        throw new Error('Something went wrong :(');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggle = (userId: string) => {
    !f.followers ? nowFollow(userId) : unfollow(userId);
  };

  const nowFollow = async (userId: string) => {
    await follow(userId);
    // setFollowing(true)
  };
  const unfollow = async (userId: string) => {
    await follow(userId);
    // setFollowing(false)
  };

  useEffect(() => {
    // if(followers.map(flw => flw._id).indexOf(f._id) !== -1){
    //     dispatch(followAction(true))
    // }else dispatch(followAction(false))
  }, [followers]);

  return (
    <>
      <div key={f.id} className="d-flex mb-2">
        <Link
          to={`/userProfile/${f.id}`}
          className="d-flex followersContainer followers-link"
        >
          <div className="">
            <Avatar
              className="d-block avatar"
              alt=""
              src={f.image}
              sx={{ width: 58, height: 58 }}
            />
          </div>
          <div className="ml-2">
            <div className="nameInfo">
              {f.firstName} {f.lastName}
            </div>
            <span className="bio text-muted">{f.bio}</span>
          </div>
        </Link>

        {f.id !== me ? (
          <FollowButton
            followers={followers}
            following={following}
            toggle={toggle}
            // setFollowing={setFollowing}
            follower={f}
          />
        ) : null}
      </div>
    </>
  );
};

export default FollowersList;
