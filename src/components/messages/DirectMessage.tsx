import React, { FormEvent } from 'react';
import { Form, Image } from 'react-bootstrap';
import { isTypingGif } from '../../assets/icons';
import { Message, User } from '../../redux/interfaces';
import { MessageBody } from './MessageBody';

interface DirectMessageProps {
  user: User;
  chatHistory: Message[];
  message: string;
  messageId?: string;
  isTyping: boolean;
  isTypingRef: React.RefObject<HTMLDivElement>;
  typer?: Message;
  scrollRef: React.RefObject<HTMLDivElement>;
  handleMessageSubmit: (e: FormEvent) => void;
  setNotification: (value: React.SetStateAction<boolean>) => void;
  handleKeyboardEvent: (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => Promise<void>;
  setMedia: React.Dispatch<React.SetStateAction<string>>;
  setMessage: (value: React.SetStateAction<string>) => void;
}

export const DirectMessage: React.FC<DirectMessageProps> = ({
  user,
  message,
  messageId,
  isTyping,
  isTypingRef,
  scrollRef,
  chatHistory,
  typer,
  setMedia,
  setMessage,
  handleMessageSubmit,
  setNotification,
  handleKeyboardEvent,
}) => {
  const inputBtnRef = React.createRef<HTMLInputElement>();
  const openInputFile = () => inputBtnRef?.current?.click();
  const target = (e: any) => e.target && setMedia(e.target.files[0]);
  console.log({ messageId });

  return (
    <div className="messageBody">
      <div className="customDmBody  pt-2">
        {chatHistory?.map((message) => (
          <div ref={scrollRef} key={message.createdAt} className="d-flex">
            <MessageBody user={user} message={message} />
          </div>
        ))}

        {isTyping && (
          <div ref={isTypingRef} className="ml-2">
            <Image
              roundedCircle
              src={typer?.image}
              alt=""
              width="37px"
              height="37px"
            />
            <Image
              className="ml-2"
              src={isTypingGif}
              alt=""
              width="50px"
              height="30px"
            />
          </div>
        )}
      </div>

      <div className="textAreaDm">
        <div id="textArea-container" className="panel-body">
          <svg
            id="input-icon1"
            xmlns="http://www.w3.org/2000/svg"
            width="10px"
            height="10px"
            fill="#f91880"
            className="bi bi-emoji-smile ml-2"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
          </svg>

          <div>
            {!message ? (
              <div>
                <input
                  type="file"
                  ref={inputBtnRef}
                  className="d-none"
                  onChange={target}
                />
                <svg
                  id="input-icon"
                  onClick={openInputFile}
                  xmlns="http://www.w3.org/2000/svg"
                  width="50px"
                  height="18"
                  fill="#f91880"
                  className="bi bi-card-image btn btn-sm uploadicons"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                  <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z" />
                </svg>
              </div>
            ) : (
              <button
                className="btn ml-auto btn-sm sendBtnDm"
                onClick={(e) => handleMessageSubmit(e)}
              >
                <i className="fa fa-pencil fa-fw" /> send
              </button>
            )}
          </div>
          <Form.Control
            className="form-control message-input"
            placeholder="Message..."
            value={message}
            onClick={() => setNotification && setNotification(false)}
            onKeyPress={handleKeyboardEvent}
            onChange={(e) => setMessage && setMessage(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
