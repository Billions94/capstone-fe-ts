import React, { Dispatch, SetStateAction } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FormControlSize } from '../../../components/auth/interfaces';
import { deletePost } from '../../../lib/requests/post';
import { reRouteAction } from '../../../redux/actions';
import { AnyAction } from 'redux';

interface DeleteModalProps {
  postId: string;
  smShow: boolean;
  setSmShow: Dispatch<SetStateAction<boolean>>;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  postId,
  smShow,
  setSmShow,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function deleteAndReroute(
    postId: string,
    dispatch: Dispatch<AnyAction>
  ) {
    await deletePost(postId, dispatch);
    dispatch(reRouteAction(false));
    navigate('/home');
  }

  return (
    <div>
      <Modal
        id="deleteModal"
        style={{ borderRadius: '20px' }}
        size={FormControlSize.SM}
        show={smShow}
        centered
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Body className="m-auto">
          <div>
            <h5>Delete Post?</h5>
            <div className="blur-white">
              This can't be undone and it will be removed from your profile, the
              feed of any accounts that follow you.
            </div>
          </div>
          <div className="m-auto mt-2">
            <Button
              variant="danger"
              className="modalbtn"
              onClick={() => deleteAndReroute(postId, dispatch)}
            >
              Delete
            </Button>
          </div>
          <div className="m-auto mt-2">
            <Button
              className="modalbtn-cancel"
              onClick={() => setSmShow(false)}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DeleteModal;
