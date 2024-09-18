import React from 'react';
import { Button, Image, Modal } from 'react-bootstrap';
import { Socket } from 'socket.io-client';
import { defaultAvatar } from '../../assets/icons';
import { OnlineUser } from '../../interfaces/OnlineUser';
import API from '../../lib/API';
import { Room, User } from '../../redux/interfaces';
import { FormControlSize } from '../auth/interfaces';

interface Props {
  onlineUsers: OnlineUser[];
  currentUser: User;
  room: Room | null;
  setCurrentChat: any;
  socket: Socket;
  setConversation: React.Dispatch<React.SetStateAction<Room[]>>;
  setOpenConvo: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StartConversation: React.FC<Props> = ({
  currentUser,
  setCurrentChat,
  socket,
  setConversation,
  setOpenConvo,
}) => {
  const [show, setShow] = React.useState(false);
  const [users, setUsers] = React.useState<User[]>([]);

  const handleShow = () => {
    setShow(!show);
    getUsers();
  };

  async function getUsers() {
    try {
      const { data } = await API.get('/users');
      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const newConversation = async (receiver: User) => {
    try {
      const { data } = await API.post('/rooms', {
        senderId: currentUser.id,
        receiverId: receiver.id,
      });
      if (data) {
        const room: Room = data[0];
        setCurrentChat(room);

        socket.emit('startConversation');
        setConversation((prev) => [...prev, data]);

        setShow(false);
        setOpenConvo(true);
        await getUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <Modal
        id="new-conversation-modal"
        show={show}
        size={FormControlSize.LG}
        centered
        onHide={() => setShow(false)}
        style={{
          borderRadius: '20px',
          position: 'absolute',
          left: '50%',
          transform: 'translate(-50%, 0)',
        }}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <span style={{ textAlign: 'center' }}>New conversation</span>
        </Modal.Header>
        <Modal.Body>
          {show === true &&
            users
              ?.filter((user) => user.userName !== currentUser.userName)
              .map((user) => (
                <div
                  key={user.userName}
                  className="d-flex mb-3"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    console.log(user.id);
                    newConversation(user);
                  }}
                >
                  <div>
                    <Image
                      roundedCircle
                      src={user.image ? user.image : defaultAvatar}
                      alt=""
                      width={37}
                      height={37}
                    />
                  </div>

                  <div className="ml-2 mt-2">
                    <strong>{user.userName}</strong>
                    <span>{''}</span>
                  </div>
                </div>
              ))}
        </Modal.Body>
      </Modal>
      <div>
        {!show && (
          <Button className="start-conversation" size="sm" onClick={handleShow}>
            <span>{show ? 'Close' : 'Start convo'}</span>
          </Button>
        )}
      </div>
    </React.Fragment>
  );
};
