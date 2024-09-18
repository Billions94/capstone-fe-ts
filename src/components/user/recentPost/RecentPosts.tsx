import { FC, Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { GET_STORE } from 'src/redux/store';
import RecentItem from './RecentItem';

const RecentPosts: FC = () => {
  const [showRecent, setShowRecent] = useState(true);
  const { posts, user } = useSelector(GET_STORE).data;

  console.log({ posts });

  function toggle() {
    !showRecent ? setShowRecent(true) : setShowRecent(false);
  }

  return (
    <div id="recentPost">
      <h5 onClick={() => toggle()} className="text-center text-dark">
        #recent activities
      </h5>
      <div className="recentDiv">
        {!showRecent ? null : (
          <>
            {posts.map((post) => (
              <Fragment key={post.id}>
                {user.userName === post.user.userName ? (
                  <RecentItem post={post} />
                ) : null}
              </Fragment>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default RecentPosts;
