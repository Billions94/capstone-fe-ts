import React from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import API from '../../lib/API';
import { followAction } from '../../redux/actions';
import { ReduxState, User } from '../../redux/interfaces';

const Search = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = React.useState('');
  const [users, setUsers] = React.useState<User[]>([]);
  const newUser = useSelector((state: ReduxState) => state.data.user);
  const me = newUser.id;
  const follower = { followerId: me };

  function filter(query: string) {
    const filteredUser = users.filter((user) => {
      return user?.firstName?.toLowerCase().includes(query.toLowerCase());
    });
    setUsers(filteredUser);
  }

  const getUsers = async () => {
    if (input) {
      try {
        const { data } = await API.get<User[]>(`/users?name=${input}`);
        if (data) {
          setUsers(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const follow = async (userId: string | undefined) => {
    try {
      await API.post(`/users/${userId}/follow`, { follower });
    } catch (error) {
      console.log(error);
    }
  };

  const anotherUser = users.find((u) => u.id !== me);

  const toggle = (userId: string | undefined) => {
    !anotherUser?.followers ? nowFollow(userId) : unfollow(userId);
  };

  const nowFollow = async (userId: string | undefined) => {
    await follow(userId);
    dispatch(followAction(true));
  };
  const unfollow = async (userId: string | undefined) => {
    await follow(userId);
    dispatch(followAction(false));
  };

  React.useEffect(() => {
    (async () => await getUsers())();
  }, [input]);

  return (
    <div id="searchContainer" className="mb-3">
      <Col className="customInputDiv">
        <Form className="mb-4">
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              className="customInput"
              type="search"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                filter(e.target.value);
              }}
              placeholder="Search LexySpace"
            />
          </Form.Group>
        </Form>
      </Col>
      <div>
        {input.length > 0
          ? users.map((user) => (
              <div key={user.userName} className="d-flex">
                <div
                  onClick={() => navigate(`/userProfile/${user.userName}`)}
                  className="linkToProfile"
                >
                  <LazyLoadImage
                    className="profile-pic"
                    src={user.image}
                    alt=""
                  />
                  <div className="ml-2">
                    <h6 className="firstandlastname">
                      {user.firstName} {user.lastName}
                      {user.isVerified && (
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
                    <h6 className="username text-muted">@{user.userName}</h6>
                    <h6 className="bio">{user.bio}</h6>
                  </div>
                </div>
                <div className="ml-auto">
                  {user.id !== me && (
                    <div className="ml-auto">
                      {!anotherUser?.followers.some(
                        (elem) => elem.id === me
                      ) ? (
                        <Button
                          onClick={() => toggle(user?.id)}
                          size="sm"
                          variant="primary"
                          className="followbtn ml-auto"
                        >
                          follow
                        </Button>
                      ) : (
                        <Button
                          onClick={() => toggle(user?.id)}
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
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default Search;
