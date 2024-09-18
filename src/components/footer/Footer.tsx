import { Col, Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import './styles.scss';

export const Footer = () => {
  useLocation();
  return (
    <footer className="customFooter mb-1">
      <Container className="sticky">
        <Col className="p-0">
          <p className="textColor">
            {`${new Date().getFullYear()} - © LexySpace | Developed by Ejiroghene.`}
          </p>
        </Col>
        <Col className="d-flex textColor p-0">
          <div className="ml-2">
            <a href="mailto:e.a.egbedi@gmail.com">
              <img
                src="https://img.icons8.com/color-glass/50/000000/gmail.png"
                width="25px"
                alt=""
              />
            </a>
          </div>
          <div className="ml-2">
            <a href="https://www.linkedin.com/in/eagebedi/">
              <img
                src="https://img.icons8.com/color/50/000000/linkedin.png"
                width="25px"
                alt=""
              />
            </a>
          </div>
          <div className="ml-2">
            <a href="https://www.instagram.com/billions_e/">
              <img
                src="https://img.icons8.com/color/50/000000/instagram-new--v1.png"
                width="25px"
                alt=""
              />
            </a>
          </div>
        </Col>
      </Container>
    </footer>
  );
};
