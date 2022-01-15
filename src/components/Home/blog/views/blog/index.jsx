import React from "react";
import { Container, Dropdown, Image, Col, Spinner } from "react-bootstrap";
import { useNavigate, Link, useParams } from "react-router-dom";
import BlogLike from "../../../blog-likes/BlogLike";
import { useState, useEffect } from "react";
import Comments from "../../../blog-comment/Comments";
import AddComment from "../../../blog-comment/AddComment";
import Edit from "../../../new/EditPost";
import { postTimer } from "../../../../../lib/index";
import { format } from "date-fns";
import "./styles.scss";
import useAuthGuard from "../../../../../hooks";
import { useSelector } from "react-redux";
import Loader from "../../../loader/Loader";
import UserInfo from "../../../blog-author/UserInfo";


const Blog = () => {

  useAuthGuard()

  const { id } = useParams();
  const [comments, setComments] = useState(null)
  const [author, setAuthor] = useState(null)

  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const posts = useSelector(state => state.posts)


  const url = process.env.REACT_APP_GET_URL;

  const fetchBlog = async (_id) => {
    try {
      const response = await fetch(`${url}/posts/${_id}`);
      if (response.ok) {
        const data = await response.json();
        setBlog(data);
        console.log("i am the data", data);
        setAuthor(data.user);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`${url}/comments`);
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

  const deleteBlogPost = async (id) => {
    try {
      const response = await fetch(`${url}/posts/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchBlog();
        navigate("/home");
      }
    } catch (error) {
      console.log("ooops we encountered an error", error);
    }
  };

  

  useEffect(() => {
    fetchBlog(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loader />
  } else {
    return (
      blog &&
      posts !== null && (
      <>
        <div id='indexDiv' >
          <Container key={blog.id} className="blog-details-root">


              <Col md={8} className="blogContent mt-4 mb-2">
                <div className='d-flex blogPostTitle'>
                  <div className="text-muted timer">
                    blogPost : {format(new Date(blog.createdAt), 'h:mm b dd MMM yyyy')}
                  </div>
                  <Dropdown className="dropdowntext ml-auto">
                        <Dropdown.Toggle
                          drop='left'
                          className="btn btn-dark dropdownbtn">
                          <img alt=''
                            className="lrdimg"
                            width="17px"
                            src="https://img.icons8.com/carbon-copy/50/000000/menu-2.png"/>
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
                          <Edit />
                          <div className="d-flex customLinks">
                            <div  className="mr-3">
                              <img alt='' className="lrdimg" width="17px"
                                src="https://img.icons8.com/fluency/50/000000/delete-sign.png"/>
                            </div>
                            <div onClick={(e) => deleteBlogPost(blog._id)} >
                              delete Post
                            </div> 
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>  

          {  
            <div onMouseEnter={handleShow} onMouseLeave={handleClose}
                className="blog-details-author">         
                <div className="d-flex align-items-center">
                  { show === true &&
                    <UserInfo props={author}/>
                  } 
                  <div>
                    <Link to={`/userProfile/${author._id}`}>
                      <Image style={{ width: "60px", height: "60px" }}
                        className="blog-author authorDetails"
                        src={author.image}
                        roundedCircle/>
                    </Link>
                  </div>
                  <Link className="text-decoration-none" to={`/userProfile/${author._id}`}>
                    <div style={{ marginLeft: "10px" }}>
                      <h5 className="text-dark authorDetails">
                        {author.firstName} {author.lastName}
                      </h5>
                      <h5 className="text-muted authorUserName">
                        @{author.userName}</h5>
                    </div>
                  </Link>
                </div>
              </div>
              }
                <div className="mt-3">{blog.text}</div>
                <div className="mt-2">
                    <img className="blog-details-cover" alt=''  src={blog.cover} width='100%'/>
                </div>  
                <div className="d-flex mt-2">
                    <BlogLike defaultLikes={["123"]} onChange={console.log} />
                    <div style={{ marginLeft: "5px" }}>
                      <button className="btn btn-dark  shareComment">
                        share
                      </button>
                    </div>
                  </div>
              </Col>
              <AddComment fetchComments={fetchComments} id={id} />
              <Col className='mb-2' md={6}>
              <Comments blog={blog} id={id} comments={comments} setComments={setComments}
                author={author} fetchComments={fetchComments}/>
              </Col>
          </Container>
        </div>
      </>
      )
    );
  }
};

export default Blog;