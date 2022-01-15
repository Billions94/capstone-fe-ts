import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import BlogList from "./BlogList";
import Weather from "./Weather";
import useAuthGuard from "../../../lib/index"
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { getUsersAction } from "../../../redux/actions";
import { useParams } from "react-router-dom";
import HotPosts from "./HotPosts";
import Loader from "../loader/Loader";
import { ReduxState } from "../../../redux/interfaces";




const Home = () => {

  useAuthGuard()

  const posts = useSelector((state: ReduxState) => state.posts)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsersAction())
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts.length])
  
    return posts ? (
      <Container id='mainContainer' className="pt-3" fluid="sm">

        <Row>
          {/* <Col sm={4} md={3}>
            <Weather />
          </Col> */}
          <Col className='sidebar' md={4} lg={3}>
            <HotPosts />
            <Weather />
          </Col>
          <Col sm={6} md={8} lg={8}>
            <BlogList />
        </Col>
        </Row>
      </Container>
    ) : ( <Loader /> )
  
}

export default Home