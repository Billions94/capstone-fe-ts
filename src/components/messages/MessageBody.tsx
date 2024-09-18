import React from 'react';
import { Image } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import { Message, User } from '../../redux/interfaces';

interface MessageBodyProps {
  message: Message;
  user: User;
}

export const MessageBody: React.FC<MessageBodyProps> = ({ user, message }) => {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      {user?.id !== message?.sender ? (
        <div className="d-flex">
          <LazyLoadImage
            src={message.image}
            onClick={() => navigate(`/userProfile/${message.sender}`)}
            style={{ cursor: 'pointer' }}
            className="roundpic"
            alt=""
            width={37}
            height={37}
          />
          <div className="ml-2 dmUserName">
            <p
              style={{ cursor: 'default' }}
              className="dmBubble m-0 p-relative"
            >
              {message?.text}

              {message?.media && (
                <Image
                  className="p-absolute"
                  src={message?.media}
                  alt="new message"
                />
              )}
            </p>
            <h1 style={{ cursor: 'default' }} className="h1">
              {new Date(message?.createdAt).toLocaleTimeString('en-US')}
            </h1>
          </div>
        </div>
      ) : (
        <div style={{ marginLeft: 'auto' }}>
          <div className="d-flex">
            <div className="ml-2 dmUserName">
              <p style={{ cursor: 'default' }} className="dmBubble1 m-0">
                {message?.text}

                {message?.media && (
                  <Image src={message?.media} alt="new message" />
                )}
              </p>
              <h1 style={{ cursor: 'default' }} className="h2">
                {new Date(message?.createdAt).toLocaleTimeString('en-US')}
              </h1>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
