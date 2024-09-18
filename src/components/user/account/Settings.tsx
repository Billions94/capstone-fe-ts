import { useEffect, useState } from 'react';
import {
  Accordion,
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  OverlayTrigger,
  Popover,
  Row,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import API from '../../../lib/API';
import { getUsersAction } from '../../../redux/actions';
import { ReduxState } from '../../../redux/interfaces';
import './styles.scss';

const Settings = () => {
  const navigate = useNavigate();

  const user = useSelector((state: ReduxState) => state.data.user);
  const dispatch = useDispatch();

  const [passwordState, setPasswordState] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const [alert, setAlert] = useState(false);
  const [match, setMatch] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const changePassword = async () => {
    try {
      const { data } = await API.patch(
        '/users/current-user/resetPassword',
        passwordState
      );

      if (data) {
        setPasswordState({
          oldPassword: '',
          newPassword: '',
        });
        setAlert(true);
        setAlertMessage('Password successfully changed!');
      }
    } catch (error) {
      setAlert(true);
      setAlertMessage('An error occured and your password was not changed!');
      console.log(error);
    }
  };

  const modifyPassword = async () => {
    if (passwordState.oldPassword === passwordState.newPassword) {
      await changePassword();
      triggerError();
    } else {
      setMatch(true);
      setTimeout(() => {
        setMatch(false);
      }, 6000);
    }
  };

  const triggerError = () => {
    setTimeout(() => {
      setAlert(false);
    }, 3000);
  };

  useEffect(() => {
    dispatch(getUsersAction());
  }, []);

  return (
    <Row className="justify-content-center" style={{ marginTop: '90px' }}>
      <Col className="settings" md={7}>
        <ListGroup id="listGroup">
          <div className="profileInfo">
            <ListGroup.Item>
              <h4 className="settings-header-font">Profile information</h4>
            </ListGroup.Item>
            <ListGroup.Item>
              {/* <a href={`${feUrl}/userProfile/me`} className="a-links"> */}
              <div
                onClick={() => navigate(`/userProfile/${user?.userName}`)}
                className="d-flex a-links justify-content-between"
              >
                <div>
                  <h5>Name, location, bio</h5>
                  <p className="text-muted">
                    choose how your name and profile info will be displayed
                  </p>
                </div>
                <div className="change">Change</div>
              </div>
              {/* </a> */}
            </ListGroup.Item>
          </div>
          <div className="">
            <ListGroup.Item className="customListItem">
              <h4 className="settings-header-font">Account management</h4>
            </ListGroup.Item>
            <ListGroup.Item>
              {/* <a href={`${feUrl}/closeAccount`} className="a-links"> */}
              <div
                onClick={() => navigate(`/closeAccount`)}
                className="d-flex a-links justify-content-between"
              >
                <div>
                  <h5>Close and delete account</h5>
                  <p className="text-muted">
                    learn about your options and decide if you want to delete
                    your account
                  </p>
                </div>
                <div className="change">Change</div>
              </div>
              {/* </a> */}
            </ListGroup.Item>
          </div>
          <div className="accountAccess">
            <ListGroup.Item className="customListItem">
              <h4 className="settings-header-font">Account access</h4>
            </ListGroup.Item>
            <ListGroup.Item className="py-0 px-1">
              <Accordion id="accordion">
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h5 className="text-left text-dark">
                            Email Addresses
                          </h5>
                          <p className="text-muted">
                            add or remove email addresses on your account.
                          </p>
                        </div>
                        <div className="change">Change</div>
                      </div>
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <Container id="passwordContainer">
                        <div></div>
                        <Form id="form">
                          <Form.Group controlId="blog-form" className="mt-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                              size="lg"
                              type="password"
                              className="form-control-custom"
                              value={passwordState.newPassword}
                              onChange={(e) =>
                                setPasswordState({
                                  ...passwordState,
                                  newPassword: e.target.value,
                                })
                              }
                            />
                          </Form.Group>
                          <Button
                            className="save-btn"
                            onClick={() => modifyPassword()}
                          >
                            save
                          </Button>
                        </Form>
                      </Container>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </ListGroup.Item>
            <ListGroup.Item className="signInSecurity">
              <Accordion id="accordion">
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h5 className="text-left">Password</h5>
                          <p className="text-muted">Change Your Password</p>
                        </div>
                        <div className="change">Change</div>
                      </div>
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <Container id="passwordContainer">
                        {alert ? (
                          <Alert className="alert" variant="success">
                            {alertMessage}
                          </Alert>
                        ) : null}
                        {match ? (
                          <Alert className="alert" variant="warning">
                            Passwords do not match!
                          </Alert>
                        ) : null}
                        <div className="text-muted">
                          Create a new password that is at least 8 characters
                          long.
                        </div>
                        <div>
                          <img
                            src="https://img.icons8.com/ios-glyphs/50/000000/privacy.png"
                            width="20px"
                            alt=""
                          />
                          <OverlayTrigger
                            trigger="click"
                            placement="bottom"
                            overlay={
                              <Popover id="">
                                <Popover.Title as="h3"></Popover.Title>
                                <Popover.Content id="overlay">
                                  <h5 className="customH5">
                                    Choose a strong password to protect your
                                    account
                                  </h5>
                                  <span className="customSpan">
                                    It <strong>should</strong> be a mix of
                                    letters, numbers and special characters
                                  </span>
                                  <br />
                                  <span className="customSpan">
                                    It <strong>should</strong> be atleast 8
                                    characters long
                                  </span>
                                  <br />
                                  <span className="customSpan">
                                    It <strong>should not</strong> contain your
                                    name, phone number or email address
                                  </span>
                                </Popover.Content>
                              </Popover>
                            }
                          >
                            <Button className="overlay-btn">
                              <span className="text-muted">
                                What makes a strong password?
                              </span>
                            </Button>
                          </OverlayTrigger>
                        </div>
                        <Form id="form">
                          <Form.Group
                            controlId="blog-form"
                            className="mt-3 formgroup"
                          >
                            <Form.Label>Old Password</Form.Label>
                            <Form.Control
                              size="lg"
                              type="password"
                              className="form-control-custom"
                              value={passwordState.oldPassword}
                              onChange={(e) =>
                                setPasswordState({
                                  ...passwordState,
                                  oldPassword: e.target.value,
                                })
                              }
                            />
                          </Form.Group>
                          <Form.Group
                            controlId="blog-form"
                            className="mt-3 formgroup"
                          >
                            <Form.Label>New password</Form.Label>
                            <Form.Control
                              size="lg"
                              type="password"
                              className="form-control-custom"
                              value={passwordState.newPassword}
                              onChange={(e) =>
                                setPasswordState({
                                  ...passwordState,
                                  newPassword: e.target.value,
                                })
                              }
                            />
                          </Form.Group>
                          <Button className="save-btn" onClick={changePassword}>
                            save
                          </Button>
                        </Form>
                      </Container>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </ListGroup.Item>
          </div>
        </ListGroup>
      </Col>
    </Row>
  );
};

export default Settings;
