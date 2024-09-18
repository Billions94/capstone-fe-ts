import { Dispatch, FC, SetStateAction } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import API from '../../../lib/API';
import { getUsersAction } from '../../../redux/actions';
import { ReduxState } from '../../../redux/interfaces';
import { useInput } from '../../hooks/useInput';
import './styles.scss';
interface Props {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}

const EditProfile: FC<Props> = ({ show, setShow }: Props) => {
  const dispatch = useDispatch();
  const handleClose = () => setShow(false);
  const { user } = useSelector((state: ReduxState) => state.data);

  const savedState = {
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    bio: user.bio,
    location: user.location,
  };

  const { input, handleChange } = useInput(savedState);

  async function edit() {
    try {
      const { data } = await API.patch(`/users/current-user`, input);

      if (data) {
        setShow(false);
        dispatch(getUsersAction());
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Modal
        id="editModal"
        size="lg"
        centered
        className="px-4"
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title id="edit-profile">edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="form">
            {Object.keys(input).map((key) => (
              <Form.Group controlId="blog-form" key={key} className="mt-3">
                <Form.Label className="label text-dark">
                  {key.toLowerCase()}
                </Form.Label>
                <Form.Control
                  id="control"
                  size="lg"
                  className="text-dark form-control-user-update"
                  name={key}
                  value={(input as any)[key]}
                  onChange={handleChange}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex">
          {!user.firstName &&
          !user.lastName &&
          !user.userName &&
          !user.bio &&
          !user.location ? (
            <Button size="lg" disabled className="modal-btn" variant="primary">
              <p>update</p>
            </Button>
          ) : (
            <Button
              size="lg"
              className="modal-btn ml-auto"
              variant="primary"
              onClick={edit}
            >
              <p>update</p>
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditProfile;
