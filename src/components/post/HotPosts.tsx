import { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { reRouteAction } from '../../redux/actions';
import { GET_STORE } from '../../redux/store';
import Loader from '../loader/Loader';
import './styles.scss';

const HotPosts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [seeMore, setSeeMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { posts } = useSelector(GET_STORE).data;

  const newPost = posts
    ?.map((p) => p)
    .sort((a, b) => b.likes.length - a.likes.length);

  const toggle = () => {
    !seeMore ? setSeeMore(true) : setSeeMore(false);
  };

  const reRoute = (id: string | undefined) => {
    navigate(`/posts/${id}`);
    dispatch(reRouteAction(true));
  };

  return !posts ? (
    <Loader />
  ) : (
    <div id="hotposts" className="mb-4">
      {isLoading ? (
        <div className="loader">
          <Spinner className="spinner" animation="border" />{' '}
        </div>
      ) : (
        <>
          <div className="p-3 d-flex">
            <img
              src="https://img.icons8.com/ios-filled/50/000000/anonymous-mask.png"
              width="27px"
              height="27px"
              alt=""
            />
            <h4 className="textColor ml-2"> Top Posts</h4>
          </div>
          <div className="mb-0">
            {newPost &&
              newPost.slice(0, 5).map((p, i) => (
                <div key={p.id} className="hotpostList">
                  <div className="d-flex index">
                    <span className="text-muted">{i + 1} .</span>
                    <span className="text-muted">Top Posts</span>
                  </div>
                  <div className="text-black">
                    <p className="strong">{p.text}</p>
                  </div>
                  <div className="likes">
                    {p.likes.length > 1 ? (
                      <span className="text-muted">{p.likes.length} likes</span>
                    ) : (
                      <span className="text-muted">{p.likes.length} like</span>
                    )}
                  </div>
                </div>
              ))}
            {seeMore
              ? newPost.slice(5, 10).map((p, i) => (
                  <div key={p.id} className="hotpostList">
                    <div className="d-flex index">
                      <span className="text-muted">{i + 6} .</span>
                      <span className="text-muted">Top Posts</span>
                    </div>
                    <div className="text">
                      <p className="strong">{p.text}</p>
                    </div>
                    <div className="likes">
                      {p.likes.length > 1 ? (
                        <span className="text-muted">
                          {p.likes.length} likes
                        </span>
                      ) : (
                        <span className="text-muted">
                          {p.likes.length} like
                        </span>
                      )}
                    </div>
                  </div>
                ))
              : null}
          </div>
          <div className="seeMoreDiv">
            {newPost?.length > 5 ? (
              <div>
                {!seeMore ? (
                  <p className="text-left text-muted p-0" onClick={toggle}>
                    <b className="seeMore">Show More</b>
                  </p>
                ) : (
                  <p className="text-left text-muted p-0" onClick={toggle}>
                    <b className="seeMore">Show Less</b>
                  </p>
                )}
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default HotPosts;
