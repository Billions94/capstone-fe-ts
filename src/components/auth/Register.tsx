import axios from 'axios';
import React from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { apiUrl } from '../../lib/API';
import { setTokenAction } from '../../redux/actions';
import { RegisterResponse } from '../../redux/interfaces';
import { getFormAttributes } from '../../util/funcs';
import { useInput } from '../hooks/useInput';
import Loader from '../loader/Loader';
import { registerForm } from './forms/registerForm';
import { registerInput } from './inputs';
import { FormControlSize, RegisterInput } from './interfaces';
import './styles.scss';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);
  const { input, handleChange } = useInput<RegisterInput>(registerInput);

  const registerData: RegisterInput = {
    userName: input.userName,
    email: input.email,
    password: input.password,
    confirmPassword: input.confirmPassword,
  };

  async function register(e: any): Promise<void> {
    e.preventDefault();
    const { data } = await axios.post<RegisterResponse>(
      `${apiUrl}/users/register`,
      registerData
    );

    if (data) {
      setLoading(true);
      const { accessToken, refreshToken } = data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      dispatch(setTokenAction({ accessToken, refreshToken }));

      setTimeout(() => {
        setLoading(false);
        navigate(`/verifyAccount`);
      }, 1000);
    }
  }

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div id="loginContainer" className="col3">
      <div className="text-center createAcc textColor">
        Create your account now
      </div>
      <Col sm={6} md={4} className="customMT mx-auto">
        <Form onSubmit={register}>
          {getFormAttributes(input, registerForm).map((item) => (
            <Form.Group
              key={item.name}
              className="format"
              controlId="formBasicPassword"
            >
              <Form.Control
                className={'login'}
                size={FormControlSize.LG}
                type={item.type}
                name={item.name}
                value={item.value}
                placeholder={item.placeholder}
                isInvalid={!!item.name}
                onChange={handleChange}
              />
              <Form.Control.Feedback className="FeedBack" type="invalid">
                {item.name}
              </Form.Control.Feedback>
            </Form.Group>
          ))}

          <Button
            variant="primary"
            disabled={input.confirmPassword.trim().length < 5}
            className={'modal-btn'}
            type="submit"
          >
            <span>Register</span>
          </Button>
          <Form.Text>
            Already a user?{' '}
            <Link className="signin" to="/login">
              <a href="#signin" className="signin">
                Log in
              </a>
            </Link>
          </Form.Text>
        </Form>
      </Col>
    </div>
  );
};

export default Register;
