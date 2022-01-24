import { useEffect, useState, Dispatch, SetStateAction } from "react"
import { Badge, Image } from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { GET_BLOGS } from "../../../redux/actions"
import { ReduxState } from "../../../redux/interfaces"
import Loader from "../loader/Loader"
import "./styles.scss"

interface HotPostsProps {
  setReRoute: Dispatch<SetStateAction<boolean>>
 
}

const HotPosts = ({ setReRoute }: HotPostsProps) => {

    const apiUrl = process.env.REACT_APP_GET_URL

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const posts = useSelector((state: ReduxState) => state.posts)
    const [seeMore, setSeeMore] = useState(false)

   
    const newPost = posts.map(p => p).sort((a,b) => b.likes.length - a.likes.length)

    const getData = async () => {
        try {
          const response = await fetch(`${apiUrl}/posts`)
          if (response.ok) {
            const { posts } = await response.json()
            const newPost = posts.reverse()
            console.log('here is the post', newPost)
            dispatch({
              type: GET_BLOGS,
              payload: newPost
            })
          }
        } catch (error) {
          console.log(error)
        }
      }

      const length = newPost.map(p => p)

      useEffect(() => {
        getData()
      }, [length.length])

      const toggle = () => {
          seeMore === false ? setSeeMore(true) : setSeeMore(false)
      }
      
      const doSomething = (id: string | undefined) => {
        navigate(`/posts/${id}`)
        setReRoute(true) 
      }
    
    return (
        <div id='hotposts' className="mb-4">
            <div className="p-3 d-flex">
            <img src="https://img.icons8.com/ios-filled/50/000000/anonymous-mask.png" width='27px' height='27px'/>
                <h4 className="text-muted ml-1"> Top Posts</h4>
            </div>
            <div className="mb-0">
            { newPost && newPost ?
                newPost.slice(0, 5).map((p, i) => (
                // <Link key={i}  className="text-decoration-none text-dark" to={`/home/${p._id}`}>
                    <div key={i} onClick={() => doSomething(p._id)}
                        className="hotpostList">
                        <div className="d-flex index">
                            <div className="text-muted">
                                {i + 1} .
                            </div>
                            <div className="text-muted">
                                Top Posts
                            </div>
                        </div>
                            <div className="text">
                                <p className="strong">{p.text}</p>
                            </div>
                        <div className="likes">
                            {p.likes.length > 1 ?
                            <div className="text-muted">{p.likes.length} likes</div>
                            : 
                            <div className="text-muted">{p.likes.length} like</div>
                            }
                        </div>
                    </div>  
                // </Link> 
                )) 
                : ( <Loader /> )
            }
            { seeMore === true ?
            newPost.slice(5, 10).map((p, i) => (
                <div key={i} onClick={() => doSomething(p._id)}
                    className="hotpostList">
                    <div className="d-flex index">
                        <div className="text-muted">
                            {i + 6} .
                        </div>
                        <div className="text-muted">
                            Top Posts
                        </div>
                    </div>
                        <div className="text">
                            <p className="strong">{p.text}</p>
                        </div>
                    <div className="likes">
                        {p.likes.length > 1 ?
                        <div className="text-muted">{p.likes.length} likes</div>
                        : 
                        <div className="text-muted">{p.likes.length} like</div>
                        }
                    </div>
                </div>
                   )) : null
            }
            
            </div>
            <div className="seeMoreDiv">
            { newPost!.length > 5 ? (
                <div >
                { seeMore === false ? 
                    <p className="text-left text-muted p-0"
                    onClick={() => toggle()}><b className='seeMore'>Show More</b></p>
                    :
                    <p className="text-left text-muted p-0"
                    onClick={() => toggle()}><b className='seeMore'>Show Less</b></p> 
                }
                </div>
                ) : null
            }
            </div>
        </div>
    ) 
}

export default  HotPosts