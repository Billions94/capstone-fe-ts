import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { Dropdown, ListGroup } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { OnlineUser } from '../../interfaces/OnlineUser';
import API from '../../lib/API';
import { Message, Room, User } from '../../redux/interfaces';

interface RoomProps {
  index: number;
  room: Room;
  messageId?: string;
  selectedIndex: number | undefined;
  setSelectedIndex: Dispatch<SetStateAction<number | undefined>>;
  currentUser: User;
  onlineUsers: OnlineUser[];
  chatHistory: Message[];
  currentChat: Room | null;
  setCurrentChat: (value: React.SetStateAction<Room | null>) => void;
  notification: boolean;
  setOpenConvo: React.Dispatch<React.SetStateAction<boolean>>;
  setReceiverId?: React.Dispatch<React.SetStateAction<string>>;
  setMessageId?: React.Dispatch<React.SetStateAction<string>>;
  getConversation: () => void;
}

export default function Convo(props: RoomProps) {
  const {
    index,
    room,
    messageId,
    currentUser,
    chatHistory,
    onlineUsers,
    setCurrentChat,
    selectedIndex,
    setSelectedIndex,
    notification,
    setOpenConvo,
    setReceiverId,
    getConversation,
  } = props;

  const navigate = useNavigate();
  const receiver = room.members.find(
    (members) => members.userName !== currentUser?.userName
  );
  const activeStatus = onlineUsers.some((user) => user._id === receiver?._id);

  const selectRoom = useCallback(
    (index: number, room: Room, receiverId?: string) => {
      getConversation();
      setReceiverId && setReceiverId(receiverId as string);
      setSelectedIndex(index);
      setCurrentChat(room);
      setOpenConvo(true);
      navigate(`/messages/${room._id}`);
    },
    [receiver]
  );

  return (
    <ListGroup.Item
      id="convo"
      action
      active={index === selectedIndex}
      onClick={() => selectRoom(index, room, receiver?._id)}
    >
      <div className="d-flex">
        <div className="onlineIconConvo">
          <LazyLoadImage
            src={receiver?.image}
            className="roundpic"
            alt=""
            width={37}
            height={37}
          />
        </div>
        {activeStatus ? (
          <div className="onlineBadgeConvo">
            <img
              src="https://img.icons8.com/ios-filled/50/26e07f/new-moon.png"
              width={10}
              height={10}
              alt=""
            />
          </div>
        ) : null}
        <div className="ml-2">
          <div className="dmUserName">{receiver?.userName}</div>
          <div className="textHolder">
            {chatHistory.map((message, i) => (
              <React.Fragment key={message.sender}>
                {room?._id === message?.roomId && (
                  <React.Fragment>
                    {i === chatHistory.length - 1 && (
                      <p key={message.createdAt} className="text-dark msgtext">
                        {message.text}
                      </p>
                    )}
                  </React.Fragment>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        {notification &&
          messageId ===
            chatHistory?.find((c) => c.roomId === messageId)?.roomId &&
          !!chatHistory.find((msg) => msg.sender === receiver?._id) && (
            <div className="ml-auto">
              <img
                src="https://img.icons8.com/ios-glyphs/50/000000/new.png"
                alt=""
                width="25px"
              />
            </div>
          )}
      </div>
    </ListGroup.Item>
  );
}

interface ConvoProps {
  convoId: string;
  socket: Socket;
  conversation: Room[];
  setConversation: any;
  setOpenConvo: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DeleteConversations: React.FC<ConvoProps> = ({
  convoId,
  socket,
  conversation,
  setConversation,
  setOpenConvo,
}) => {
  async function deleteConversations(roomId: string) {
    try {
      await API.delete(`/messages/${roomId}`);

      const newConvo = conversation.filter((convo) => convo._id !== convoId);
      setConversation(newConvo);
      setOpenConvo(false);
      socket.emit('deleteConversation');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dropdown
      className="dropdowntext ml-auto"
      style={{ top: 'auto', zIndex: 100, bottom: '45px' }}
    >
      <Dropdown.Toggle className="btn btn-dark dropdownbtn">
        <div className="text-muted dots">
          <b>
            <strong>•••</strong>
          </b>
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdownmenu">
        {
          <div className="d-flex customLinks">
            <div className="mr-3">
              <img
                alt=""
                className="lrdimg"
                width="17px"
                src="https://img.icons8.com/fluency/50/000000/delete-sign.png"
              />
            </div>
            <div onClick={() => deleteConversations(convoId)}>delete</div>
          </div>
        }
      </Dropdown.Menu>
    </Dropdown>
  );
};
