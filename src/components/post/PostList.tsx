import React, { useEffect } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { reRouteAction } from '../../redux/actions';
import { GET_STORE } from '../../redux/store';
import PostItem from './post-item/PostItem';

const PostList: React.FC = () => {
  const {
    data: { posts, isLoading },
  } = useSelector(GET_STORE);

  useEffect(() => {
    reRouteAction(false);
  }, []);

  return (
    <Row id="blogList" className="blogList justify-content-center">
      {isLoading ? (
        <div className="loader">
          <Spinner animation="border" />{' '}
        </div>
      ) : (
        <React.Fragment>
          {posts.map((post) => (
            <Col key={post.id} md={12} lg={12} style={{ padding: '0px' }}>
              <div className="blogList">
                <div>
                  <PostItem key={post.id} post={post} />
                </div>
              </div>
            </Col>
          ))}
        </React.Fragment>
      )}
    </Row>
  );
};

export default PostList;
