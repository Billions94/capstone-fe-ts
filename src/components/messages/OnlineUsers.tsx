import React from 'react';
import { Image } from 'react-bootstrap';
import { Socket } from 'socket.io-client';
import { defaultAvatar } from '../../assets/icons';
import { OnlineUser } from '../../interfaces/OnlineUser';
import API from '../../lib/API';
import { Room, User } from '../../redux/interfaces';

interface OnlineUsersProps {
  onlineUsers: OnlineUser[];
  currentUser: User;
  conversation: Room[];
  currentChat: Room | null;
  setCurrentChat: (value: React.SetStateAction<Room | null>) => void;
  setConversation: React.Dispatch<React.SetStateAction<Room[]>>;
  socket: Socket;
  setOpenConvo: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OnlineUsers({
  onlineUsers,
  currentUser,
  currentChat,
  setCurrentChat,
  conversation,
  setConversation,
  socket,
  setOpenConvo,
}: OnlineUsersProps) {
  const handleClick = async (friend: OnlineUser) => {
    if (!currentChat?.members.includes(currentUser as unknown as OnlineUser)) {
      let conversationAlreadyOpened;

      for (const room of conversation) {
        conversationAlreadyOpened = room.members.find(
          (member) => member.userName === friend.userName
        );
      }

      if (conversationAlreadyOpened) {
        try {
          const { data } = await API.get<Room[]>(
            `/rooms/find/${currentUser.id}/${friend._id}`
          );
          if (data) {
            const room = data[0];
            setCurrentChat(room);
            setOpenConvo(true);
          } else throw new Error('Could not get chat');
        } catch (error) {
          console.log(error);
        }
      } else {
        await newConversation(friend);
      }
    }
  };

  const newConversation = async (friend: OnlineUser) => {
    try {
      const { data } = await API.post('/rooms', {
        senderId: currentUser.id,
        receiverId: friend._id,
      });
      if (data) {
        const room = data[0];
        setCurrentChat(room);
        socket.emit('startConversation');
        setConversation((prev) => [...prev, data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="onlineUserContainer">
      <div className="mb-1">Online</div>
      <div className="d-flex">
        {onlineUsers
          .filter((user) => user.userName !== currentUser.userName)
          .map((friend) => (
            <div
              key={friend.userName}
              className="mr-1"
              onClick={() => handleClick(friend)}
              style={{ cursor: 'pointer' }}
            >
              <div className="onlineIcon">
                <Image
                  roundedCircle
                  src={friend.image ? friend.image : defaultAvatar}
                  alt=""
                  width="37px"
                  height="37px"
                />
              </div>
              <div className="onlineBadge">
                <img
                  src="https://img.icons8.com/ios-filled/50/26e07f/new-moon.png"
                  width={10}
                  height={10}
                  alt=""
                />
              </div>
              <div className="username">{friend.userName}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
