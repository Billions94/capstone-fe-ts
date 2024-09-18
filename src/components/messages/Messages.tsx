import { debounce } from 'lodash';
import {
  createRef,
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { conversationGif } from '../../assets/icons';
import { OnlineUser } from '../../interfaces/OnlineUser';
import API from '../../lib/API';
import useAuthGuard from '../../lib/index';
import { setDynamicId } from '../../redux/actions';
import { Message, ReduxState, Room } from '../../redux/interfaces';
import { useSocket } from '../hooks/useSocket';
import Convo, { DeleteConversations } from './Conversation';
import { DirectMessage } from './DirectMessage';
import OnlineUsers from './OnlineUsers';
import { StartConversation } from './StartConversation';
import './styles.scss';

const Messages = () => {
  useAuthGuard();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messageId = useParams().id;

  const { socket } = useSocket();

  const { user } = useSelector((state: ReduxState) => state.data);
  const me = user?.id;
  const [notification, setNotification] = useState<boolean>(false);

  const [media, setMedia] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);

  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [message, setMessage] = useState('');
  const [currentChat, setCurrentChat] = useState<Room | null>(null);

  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Room[]>([
    { _id: '', members: [] },
  ]);

  const [arrivalMessage, setArrivalMessage] = useState<any | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const scrollRef = createRef<HTMLDivElement>();
  const isTypingRef = createRef<HTMLDivElement>();

  const [openConvo, setOpenConvo] = useState(false);

  const handleIsTyping = useCallback(
    debounce((value) => {
      setIsTyping(value);
    }, 1000),
    []
  );

  const getConversation = async () => {
    try {
      const { data } = await API.get(`/rooms/${me}`);
      if (data) {
        setConversation(data.conversations);
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMessages = async () => {
    if (currentChat?._id !== undefined) {
      try {
        const { data } = await API.get<Message[]>(
          `/messages/${currentChat?._id}`
        );
        if (data) {
          setChatHistory(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    dispatch(setDynamicId(messageId));
  }, [messageId]);

  useEffect(() => {
    getConversation().then(({ conversations }) => {
      setConversation(conversations);
    });
  }, [me, conversation.length]);

  function setUsers() {
    socket.emit('getUsers', {
      id: user.id,
      userName: user.userName,
      image: user.image,
    });
  }

  useEffect(() => {
    (async () => await getMessages())();
  }, [currentChat]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connection established!');
      setUsers();
    });

    socket.on('message', (message) => {
      console.log({ message });
    });

    socket.on('getUsers', (users: OnlineUser[]) => {
      setOnlineUsers(users);
    });

    socket.on('startConversation', async () => {
      console.log('Conversation started!');
      await getConversation();
    });

    socket.on('deleteConversation', async () => {
      console.log('Conversation deleted!');
      await getConversation();
    });

    socket.on('typing', () => {
      setIsTyping(true);
      handleIsTyping(false);
    });

    socket.on('receiveMessage', (newMessage) => {
      setNotification(true);
      setArrivalMessage(newMessage.message);
      setChatHistory((chatHistory) => [...chatHistory, newMessage.message]);
    });

    return () => {
      socket.on('disconnect', () => {
        console.log('Disconnected');
        setUsers();
      });
      socket.disconnect();
    };
  }, []);

  console.log({ onlineUsers });

  useEffect(() => {
    socket.emit('setUsername', {
      userId: user.id,
      userName: user.userName,
      image: user.image,
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setChatHistory((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  const handleMessageSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const receiver = currentChat?.members.find((m) => m._id !== me);

    const newMessage: Message = {
      roomId: currentChat?._id,
      text: message,
      sender: me,
      receiver: receiver?._id,
      image: user.image,
      media: media,
      createdAt: Date.now(),
    };

    socket.emit('sendmessage', { message: newMessage });

    try {
      const { data } = await API.post(`/messages`, newMessage);
      if (data) {
        setChatHistory((chatHistory) => [...chatHistory, data]);
        setMessage('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    isTypingRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isTyping]);

  const target = (e: any) => {
    if (e.target && e.target.files[0]) {
      setMedia(e.target.files[0]);
    }
  };

  const singleMsg = chatHistory?.find((m) => m.receiver === undefined);
  const actualRoom = conversation?.find((r) => r._id === singleMsg?.roomId);
  const receiver = actualRoom?.members.find((m) => m._id !== me);
  const typer = chatHistory && chatHistory.find((m) => m.sender !== user?.id);

  const handleKeyboardEvent = async (e: KeyboardEvent<HTMLInputElement>) => {
    setNotification(false);
    socket.emit('typing', {
      user: onlineUsers.find((u) => u._id === typer?.sender),
    });

    if (e.key === 'Enter') {
      await handleMessageSubmit(e);
    }
  };

  return (
    <Container
      style={{ marginTop: '90px', overflow: 'hidden' }}
      fluid
      className="p-0"
    >
      <Row id="dmContainer" className="mx-auto p-0 customDmRow">
        <Col className="user-column-dm ml-auto" sm={5} md={3} lg={3}>
          <div className="d-flex customMess">
            <h3 className="dmUserName mt-2 ml-2">{user.userName}</h3>
          </div>

          <div id="input-container" className="panel-body"></div>

          <OnlineUsers
            onlineUsers={onlineUsers}
            currentUser={user}
            conversation={conversation}
            currentChat={currentChat}
            setCurrentChat={setCurrentChat}
            setConversation={setConversation}
            socket={socket}
            setOpenConvo={setOpenConvo}
          />

          <div
            style={{
              borderBottom: '1px solid #ffd1c5',
            }}
          >
            <div className="conversations d-flex">
              <div className="convoNfc">
                Conversations
                <Button className="text-dark notification-btn">
                  <span className="convo-notification">
                    {conversation.length}
                  </span>
                </Button>
              </div>
              <div className="ml-auto">
                <img src={conversationGif} alt="" width="25px" />
              </div>
            </div>
          </div>

          <ListGroup variant={'flush'} className="listofDM position-relative">
            {conversation &&
              conversation.map((room, i) => (
                <ListGroup.Item key={room._id} className="customList">
                  <Convo
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                    index={i}
                    room={room}
                    messageId={messageId}
                    currentUser={user}
                    onlineUsers={onlineUsers}
                    currentChat={currentChat}
                    chatHistory={chatHistory}
                    setCurrentChat={setCurrentChat}
                    notification={notification}
                    setOpenConvo={setOpenConvo}
                    getConversation={getConversation}
                  />
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      left: 'auto',
                      zIndex: '100',
                    }}
                  >
                    <DeleteConversations
                      setOpenConvo={setOpenConvo}
                      convoId={room._id}
                      socket={socket}
                      conversation={conversation}
                      setConversation={setConversation}
                    />
                  </div>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Col>

        <Col className="mr-auto dm-column" sm={7} md={6} lg={5}>
          {!receiver ? null : (
            <div className="dmHeader1 d-flex">
              <img
                src={receiver?.image}
                onClick={() => navigate(`/userProfile/${receiver._id}`)}
                style={{ cursor: 'pointer' }}
                className="roundpic"
                alt=""
                width={37}
                height={37}
              />
              <div className="ml-2 dmUserName">
                <span style={{ cursor: 'default' }}>{receiver?.userName}</span>
              </div>
            </div>
          )}

          {!openConvo ? (
            <div className="d-flex beforeConvo position-relative">
              <div className="text-muted px-3 mb-5">
                <span className="noMessages">Start a new conversation :)</span>
              </div>
              <div className="position-absolute mt-5 ml-2">
                <StartConversation
                  onlineUsers={onlineUsers}
                  currentUser={user}
                  room={currentChat}
                  setCurrentChat={setCurrentChat}
                  socket={socket}
                  setConversation={setConversation}
                  setOpenConvo={setOpenConvo}
                />
              </div>
            </div>
          ) : (
            <DirectMessage
              {...{
                user,
                chatHistory,
                message,
                messageId,
                isTyping,
                isTypingRef,
                scrollRef,
                typer,
                setMedia,
                setMessage,
                handleMessageSubmit,
                target,
                handleKeyboardEvent,
                setNotification,
              }}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Messages;
