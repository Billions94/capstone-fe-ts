import { Container, Dropdown, Image, Col, Badge, Button, Row } from "react-bootstrap"
import { useNavigate, Link, useParams } from "react-router-dom"
import { useState, useEffect, Dispatch, SetStateAction } from "react"
import Comment from "../blog-comment/Comment"
import AddComment from "../blog-comment/AddComment"
import Edit from "../blog-home/new/EditPost"
import useAuthGuard, { postTimer } from "../../../lib/index"
import { useSelector, useDispatch } from "react-redux"
import Loader from "../loader/Loader"
import { ReduxState } from "../../../redux/interfaces"
import { Posts, Comments, User } from "../../../redux/interfaces"
import "./styles.scss"
import ShareModal from "./SharedModal"
import { likeAction, loaderAction, reRouteAction } from "../../../redux/actions"
import UserInfo from "../blog-author/UserInfo"


interface BlogProps {
  setReRoute: Dispatch<SetStateAction<boolean>>
}


const Blog = () => {

  useAuthGuard()

  const { id } = useParams()
  const navigate = useNavigate()

  const [comments, setComments] = useState<Comments[]>([])
  const [author, setAuthor] = useState<User | null>(null)
  const [blog, setBlog] = useState<Posts | null>(null)
  const [share, setShare] = useState(false)
  const [display, setDisplay] = useState(false)
  const [timer, setTimer] = useState(false)
  const handleDisplayShow = () => setTimeout(() => { setDisplay(true)}, 1000)
  const handleDisplayClose = () => {{setTimeout(() =>{if (timer === true){setDisplay(false);setTimer(false)}}, 1000)}}
  
  
  const url = process.env.REACT_APP_GET_URL
  const dispatch = useDispatch()
  const posts = useSelector((state: ReduxState['posts']) => state)
  const { user, likes, isLoading } = useSelector((state: ReduxState) => state.data)
  const liker = { userId: user!._id}
  const me = user!._id
  
  // for interaction icons label
    const [show, setShow] = useState(false)
    const [commentLabel, setCommentLabel] = useState(false)
    const [likeLabel, setLikeLabel] = useState(false)
    const [shareLabel, setShareLabel] = useState(false)

    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)
    const handleShare = () => setShare(true)
    
    const handleCommentLabelShow = () => setCommentLabel(true)
    const handleLikeLabelShow = () => setLikeLabel(true)
    const handleShareLabelShow = () => setShareLabel(true)
  
    const handleCommentLabelClose = () => setCommentLabel(false)
    const handleLikeLabelClose = () => setLikeLabel(false)
    const handleShareLabelClose = () => setShareLabel(false)
  
    const showNHidde = () => {
      show === false ? handleShow() : handleClose()
    }
  


  const fetchBlog = async (_id: string | undefined) => {
    try {
      const response = await fetch(`${url}/posts/${_id}`)
      if (response.ok) {
        const data: Posts = await response.json()
        setBlog(data)
        console.log("i am the data", data.user)
        setAuthor(data.user)
        setTimeout(()=> {
          dispatch(loaderAction(false))
        }, 3000)
      } else {
        throw new Error('cannot post')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`${url}/comments`)
      if (response.ok) {
        const data: Posts = await response.json()

        const reverseComments = data.comments.reverse()

        setComments(reverseComments)
      } else {
        console.log("after ther fail of if block inside th else ")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const deleteBlogPost = async (id: string | undefined) => {
    try {
      const response = await fetch(`${url}/posts/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchBlog(id)
        navigate("/home")
      }
    } catch (error) {
      console.log("ooops we encountered an error", error)
    }
  }

  const toggle = (id: string | undefined) => {
    !likes ? likePost(id) : unLikePost(id)
  }

  const likePost = (id: string | undefined) => {
    like(id)
    dispatch(likeAction())
  }

  const unLikePost = (id: string | undefined) => {
    like(id)
    dispatch(likeAction())
  }

  const like = async (id: string | undefined) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`${url}/posts/${id}/likes`, {
        method: 'PUT',
        body: JSON.stringify(liker),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` }
      })
        if(response.ok) {
          const data = await response.json()
          fetchBlog(id)
          console.log('You liked this post', data)
          console.log(liker)
        }
    } catch (error) {
      console.log(error)
    }
  }

  

  useEffect(() => {
    fetchBlog(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  function navigateHome(id: string | undefined) {
    deleteBlogPost(id)
    dispatch(reRouteAction(false))
    navigate('/home')
  }

  const likedPost = blog?.likes.find(blog => blog._id === me)

  return isLoading === true ? ( <Loader /> ) : (
        <Row id='indexDiv'>
          <Container key={blog?._id} className="blog-details-root">
              <Col md={12} className="blogContent mb-2">
                <div className="d-flex align-items-center">
                  <Button className='nav-back' onClick={() => navigateHome('')}>
                  <img src="https://img.icons8.com/ios-filled/50/000000/left.png"
                    className="arrowBack"/>
                  </Button>
                  <div className="mt-2 ml-2">
                    <h5>Posts</h5>
                  </div>
                  <div className="text-muted timer ml-auto">
                    Posted : {postTimer(blog?.createdAt)} ago
                  </div>
                </div>
                <div className='d-flex blogPostTitle'>
                  <Dropdown className="dropdowntext ml-auto">
                    <Dropdown.Toggle
                      className="btn btn-dark dropdownbtn">
                      <img alt=''
                        className="lrdimg"
                        width="17px"
                        src="https://img.icons8.com/android/50/000000/more.png"/>
                    </Dropdown.Toggle>
                      <Dropdown.Menu
                        className='dropDownMenu'
                        style={{padding: "18px", borderRadius: "25px", border: "1px solid rgb(216, 215, 215)"}}>
                        <br />

                        <a className="deleteBlog customLinks"
                          href={`${url}/${id}/downloadPDF`}>
                          <div
                            style={{ marginTop: "-20px" }}
                            className="d-flex">
                            <div className="mr-3">
                              <img alt=''
                                className="lrdimg"
                                width="17px"
                                src="https://img.icons8.com/ios/50/000000/circled-down.png"/>
                            </div>
                            <div >
                              download pdf
                            </div>
                          </div>
                        </a>
                        { blog && blog.user._id !== me ? null
                            : 
                          <>
                    <Edit />
                    <div className="d-flex customLinks">
                      <div  className="mr-3">
                        <img alt='' className="lrdimg" width="17px"
                          src="https://img.icons8.com/fluency/50/000000/delete-sign.png"/>
                      </div>
                      <div onClick={() => navigateHome(blog?._id)} >
                        delete
                      </div> 
                    </div>
                  </>
                }
                </Dropdown.Menu>
              </Dropdown>
            </div>  

          {  
            <div className="blog-details-author">         
                <div onMouseEnter={handleDisplayShow} onMouseLeave={() => {handleDisplayClose(); setTimer(true)}}
                    className="d-flex align-items-center">
                  {/* <UserInfo
                  show={display}
                  handleShow={handleDisplayShow}
                  handleClose={handleDisplayClose}
                  setTimer={setTimer}
                  props={user}
                  /> */}
                  <div>
                    <Link to={`/userProfile/${author?._id}`}>
                      <Image style={{ width: "60px", height: "60px" }}
                        className="blog-author authorDetails"
                        src={author?.image}
                        roundedCircle/>
                    </Link>
                  </div>
                  <Link className="text-decoration-none" to={`/userProfile/${author?._id}`}>
                    <div style={{ marginLeft: "10px" }}>
                      <h3 className="text-dark authorDetails">
                        {author?.firstName} {author?.lastName}
                        { author?.isVerified === true &&
                        <span className=" mt-1 ml-1  d-flex-row align-items-center">
                          <img alt='' className="mr-2" width="20px"
                            src="https://img.icons8.com/ios-filled/50/4a90e2/verified-account.png"/>
                        </span>
                       }
                      </h3>
                      <h4 className="text-muted authorUserName">
                        @{author?.userName}</h4>
                    </div>
                  </Link>
                </div>
              </div>
            }
                <h4 className="mt-3 blogText">{blog?.text}</h4>
                <div className="mt-2 mb-4">
                    <img className="blog-details-cover" alt=''  
                      src={blog?.cover} width='100%' />
                </div>
                <div>{blog?.likes.length} like</div>
                {/* { newPost!.sharedPost!._id !== id ? 
                <>
                  <div className="mt-3">{newPost!.sharedPost!.text}</div>
                  <div className="mt-2">
                      <img className="blog-details-cover" alt=''  
                        src={newPost!.sharedPost!.cover} width='100%' />
                  </div> 
                </>
                  : null
                }  */}

                  <div className="interactionContainer d-flex mt-2"> 
                    <div onMouseEnter={handleCommentLabelShow}
                      onMouseLeave={handleCommentLabelClose}
                      onClick={() => showNHidde()}
                      className='position-relative'>
                    <button className='candl comment'>
                      <img className="interactions" src="https://img.icons8.com/wired/64/000000/comments.png"
                        width='25px'/>
                    </button>
                    {  commentLabel === false ? null :
                      <Badge pill variant="secondary"
                        className='interactionBadge'>
                        Comment
                      </Badge>
                    }
                    </div>

                    <div onMouseEnter={handleLikeLabelShow}
                        onMouseLeave={handleLikeLabelClose}
                        className='interactions position-relative'>
                      { !likes.some(elem => elem._id === id)   ?
                      <>
                        <button className='candl '>
                          <img className="interactions" onClick={()=> toggle(blog?._id)}
                          src="https://img.icons8.com/wired/64/000000/hearts.png"
                            width='25px'/>
                        </button>
                        { likeLabel === false ? null :
                          <Badge pill variant="secondary"
                            className='interactionBadge'>
                            Like
                          </Badge>
                        }
                      </>
                          :
                      <>
                        <button className='candl '> 
                        <img className="interactions" onClick={()=> toggle(blog?._id)}
                          src="https://img.icons8.com/dusk/64/000000/hearts.png"
                          width='25px'/>
                          </button>
                        { likeLabel === false ? null :
                          <Badge pill variant="secondary"
                            className='interactionBadge'>
                            Like
                          </Badge>
                        }
                      </>
                      }
                    </div>

                    <div onMouseEnter={handleShareLabelShow} onMouseLeave={handleShareLabelClose}
                      className="interactions position-relative m-0">
                      <button onClick={handleShare}
                        className='candl share'>
                        <img src="https://img.icons8.com/wired/64/000000/share-2.png"
                        width='25px'/>
                      </button>
                      { shareLabel === false ? null :
                        <Badge pill variant="secondary"
                          className='interactionBadge'>
                          Share
                        </Badge>
                      }
                      <ShareModal id={id}
                        user={blog?.user!}
                        show={share}
                        setShow={setShare}
                        createdAt={blog?.createdAt}
                      />
                    </div>
                  </div>
                  { show === false ? null
                  : 
                   <AddComment fetchComments={fetchComments} id={id} />
                  }
              <Col className='mt-5'>
              <Comment blog={blog} id={id} comments={comments} 
                author={author} fetchComments={fetchComments}/>
              </Col>
            </Col>
          </Container>
        </Row>
    ) 
}

export default Blog
