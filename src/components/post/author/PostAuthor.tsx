import React from 'react';
import { Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { defaultAvatar } from '../../../assets/icons';
import { useHoverState } from '../../../components/hooks/useHoverState';
import { dateFormatter } from '../../../lib';
import { Post, User } from '../../../redux/interfaces';
import './styles.scss';
import UserInfo from './UserInfo';

type UserProps = User & { isUpdated?: boolean; sharedPost?: Post };

const PostAuthor: React.FC<UserProps> = (userProps) => {
  const { show, handleShow } = useHoverState();

  return (
    <Row
      id="blogAuthorContainer"
      onMouseEnter={() => handleShow(true)}
      onMouseLeave={() => handleShow(false)}
    >
      <div className="d-flex align-items-center">
        <UserInfo show={show} userFromProps={userProps} />

        <Link
          className="text-decoration-none"
          to={`/userProfile/${userProps.userName}`}
        >
          <div id="authorDetails" className="d-flex">
            <Image
              style={{ width: '50px', height: '50px' }}
              className="blog-author authorDetails"
              src={userProps.image ? userProps.image : defaultAvatar}
              roundedCircle
            />
            <div style={{ marginLeft: '10px' }}>
              <h6 className="text-dark authorFirstName mb-0">
                {userProps.firstName}
                {userProps.isVerified && (
                  <span className=" mt-1 ml-1  d-flex-row align-items-center">
                    <img
                      alt=""
                      className="mr-2"
                      width="15"
                      src="https://img.icons8.com/ios-filled/50/4a90e2/verified-account.png"
                    />
                  </span>
                )}
              </h6>
              <h6 className="text-muted authorUserName mb-1">
                @{userProps.userName}
              </h6>
              <h6 className="text-muted postTime">
                ●{' '}
                {userProps.sharedPost
                  ? 'reposted'
                  : userProps.isUpdated && 'edited'}{' '}
                {dateFormatter(userProps.createdAt as Date)} ago
              </h6>
            </div>
          </div>
        </Link>
      </div>
    </Row>
  );
};

export default PostAuthor;
