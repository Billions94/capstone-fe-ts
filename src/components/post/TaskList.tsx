import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { dateFormatter } from '../../lib';
import { deleteNoteAction, saveNoteAction } from '../../redux/actions';
import { Note, ReduxState } from '../../redux/interfaces';
import Loader from '../loader/Loader';

interface TaskListsProps {
  notes: Note[];
  show: boolean;
  setShow?: React.Dispatch<React.SetStateAction<boolean>>;
  handleShow: () => void;
}

const TaskList: React.FC<{ className?: string }> = ({ className }) => {
  const dispatch = useDispatch();

  const { notes } = useSelector((state: ReduxState) => state['data']);
  const [loading, setLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const handleShow = () => setShow(!show);
  const [notification, setNotification] = React.useState(false);
  const [note, setNote] = React.useState<Note>({
    content: '',
    createdAt: '',
  });

  function handleSubmit(event: any) {
    event.preventDefault();
    dispatch(saveNoteAction(note));
    triggerLoading();
  }

  function triggerLoading() {
    setLoading(true);
    setTimeout(function () {
      setLoading(false);
      setNote({ content: '', createdAt: '' });
      triggerNotification();
    }, 1000);
  }

  function triggerNotification() {
    setNotification(true);
    setTimeout(function () {
      setNotification(false);
    }, 2000);
  }

  return (
    <div id="Task" className={className}>
      <Form onSubmit={handleSubmit}>
        <textarea
          className="form-control taskList"
          placeholder="Save a  note 🖊️"
          value={note.content}
          onChange={({ target: { value } }) =>
            setNote({
              ...note,
              content: value,
              createdAt: new Date().toString(),
            })
          }
          rows={5}
        />

        <div className="activator" onClick={handleShow}>
          {loading ? (
            <Loader
              color={'#f91880'}
              marginTop={'25%'}
              width={20}
              height={20}
            />
          ) : (
            <ul>
              {notes.length ? (
                [...notes]
                  .reverse()
                  .slice(0, 3)
                  .map((note) => (
                    <li key={note.createdAt} className="li">
                      {note.content}
                    </li>
                  ))
              ) : (
                <div style={{ top: '15px', position: 'absolute' }}></div>
              )}
            </ul>
          )}
        </div>

        {notification && (
          <Notification
            style={{
              top: '5px',
              position: 'absolute',
              right: '5px',
            }}
          />
        )}

        <TaskLists
          notes={[...notes].reverse()}
          show={show}
          handleShow={handleShow}
        />

        {note?.content.length > 0 ? (
          <Button className="saveBtn" type="submit">
            <span>
              {loading ? (
                <Loader
                  marginTop={0}
                  background={'transparent'}
                  width={10}
                  height={10}
                  color={'white'}
                />
              ) : (
                'Save' + ' note'
              )}
            </span>
          </Button>
        ) : (
          <Button className="saveBtn" disabled>
            <span>Save note</span>
          </Button>
        )}
      </Form>
    </div>
  );
};

const TaskLists: React.FC<TaskListsProps> = ({ notes, show, handleShow }) => {
  const dispatch = useDispatch();
  const [deleted, setDeleted] = React.useState(false);

  function handleDelete(note: Note) {
    setDeleted(true);
    setTimeout(function () {
      dispatch(deleteNoteAction(note));
      setDeleted(false);
    }, 200);
  }

  return (
    <>
      <Modal id="noteModal" onHide={handleShow} show={show} size="sm">
        <Modal.Header className="mdHeader" closeButton>
          {notes.length ? 'Previous notes...' : 'Your notes are empty'}
        </Modal.Header>
        <div>
          {notes.map((note, index) => (
            <div className="mdBody" key={note.content}>
              <div>
                <p className={deleted ? 'deleted' : ''}>
                  {note.content}{' '}
                  <em className="time">{dateFormatter(note.createdAt)} ago</em>
                </p>
              </div>
              <div className="trash" onClick={() => handleDelete(notes[index])}>
                🗑️
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

interface NotificationProps {
  style: React.CSSProperties;
}

export const Notification: React.FC<NotificationProps> = ({ style }) => {
  return <div style={style}> ✅</div>;
};

export default TaskList;
