import { useEffect, useRef, useState } from "react"
import { Modal, Form, Button } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { getUsersAction } from "../../../redux/actions"


const CommentModal = ({ id, show, setShow, handleClose }) => {

    const apiUrl = process.env.REACT_APP_GET_URL

    const dispatch = useDispatch()
    const { users } = useSelector(state => state.data)
    const userId = users._id

    const [comments, setComments] = useState({
        text: '',
        userId: userId
    })
    
    const [image, setImage] = useState()

    const fetchComments = async () => {
        try {
          const response = await fetch(`${apiUrl}/comments`);
          if (response.ok) {
            const data = await response.json();
    
            const reverseComments = data.comments.reverse();
    
            setComments(reverseComments);
          } else {
            console.log("after ther fail of if bloct inside th eelse ");
          }
        } catch (error) {
          console.error(error);
        }
      };

    const postComment = async () => {
    
        try {
          const response = await fetch(`${apiUrl}/comments/${id}`, {
            method: "POST",
            body: JSON.stringify(comments),
            headers: { "Content-Type": "application/json" },
          });
          if (response.ok) {
            fetchComments()
            setComments({
                text: "",
                user: userId
            })
            setShow(false)
            
          }
        } catch (error) {
          console.error("oops with encountered an error ", error);
        }
      }


      const target = (e) => {
        console.log(e.target.files[0]);
        if (e.target && e.target.files[0]) {
          setImage(e.target.files[0]);
        }
      };
    
      const inputBtn = useRef()
    
      const openInputFile = () => {
        inputBtn.current.click();
      }

      useEffect(() => {
        dispatch(getUsersAction())
      }, [])

    return (
        <Modal id='postModal' show={show} onHide={handleClose} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>Post a comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex userInfoContainer">
            <div>
              <img src={users.image} alt="" 
                  className="roundpic" width={47}/>
            </div>
            <div className="ml-2 userInfo">
                <span>{users.firstName} {users.lastName}</span>
            </div>
          </div>
          <Form.Group controlId="blog-content" className="form1 mt-3">
            <Form.Control
              placeholder="what's poppin?"
              as="textarea"
              className="textarea"
              rows={5}
              value={comments.text}
              onChange={(e) =>
              setComments({ ...comments, text: e.target.value })}
              />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className='mt-0'>
                <div >
                  <button onClick={openInputFile} className="btn btn-sm btnIcon">
                  <input type="file" ref={inputBtn} className="d-none" onChange={target} />
                    <img src="https://img.icons8.com/wired/50/000000/picture.png" alt='' height='27px' width='27px'/>
                  </button>
                  <button onClick={openInputFile} className="btn btn-sm btnIcon ml-2">
                  <input type="file" ref={inputBtn} className="d-none" onChange={target} />
                    <img src="https://img.icons8.com/dotty/50/000000/attach.png" alt='' height='27px' width='27px'/>
                  </button>
                </div>
          <Button variant="primary" className='modal-btn' onClick={() => postComment()}>
            send
          </Button>
        </Modal.Footer>
      </Modal>
    )
}

export default CommentModal