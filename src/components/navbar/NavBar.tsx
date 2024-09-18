import { FC, useEffect, useState } from 'react';
import { Button, Container, Navbar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../lib/API';
import { getPostsAction } from '../../redux/actions';
import { GET_STORE } from '../../redux/store';
import { useReroute } from '../hooks/useReroute';
import PostModal from '../post/crud/PostModal';
import { NavbarSignUpButton } from './button/NavbarSignUpButton';
import { NavBarDropdown } from './dropDown/NavBarDropdown';
import { getNavbarProps } from './funcs/funcs';
import './styles.scss';

const NavBar: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);

  const [show, setShow] = useState(false);
  const { route } = useReroute();

  const {
    data: { user },
  } = useSelector(GET_STORE);
  const handleShow = () => setShow(true);
  const loggedInUserId = user?.id;

  /**
   * Logs out current user.
   * @remarks This is a custom function.
   */
  async function logOut(): Promise<void> {
    await API.delete('/sessions');

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('cover');

    navigate('/');
  }

  useEffect(() => {
    dispatch(getPostsAction());
    if (
      location.pathname === '/register' ||
      location.pathname === '/login' ||
      location.pathname === '/'
    ) {
      return;
    }
  }, [show, loggedInUserId]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {getNavbarProps(loggedInUserId, user?.image, navigate, logOut)
        .filter((item) => item.path === location.pathname)
        .map(
          (item) =>
            location.pathname === item.path && (
              <Navbar
                key={item.name}
                expand="lg"
                className={
                  isScrolled
                    ? item.container.divClassName + ' scroll'
                    : item.path !== '/home'
                    ? 'blog-navbar-not-home'
                    : item.container.divClassName
                }
                fixed="top"
              >
                <Container className={item.container.className}>
                  <Navbar.Brand className={item.brandClassName} onClick={route}>
                    <img
                      className={item.brandLogo.className}
                      alt="logo"
                      src={item.brandLogo.src}
                    />
                    <span className="navspan ml-2">{item.brandName}</span>
                  </Navbar.Brand>

                  {item.path === '/home' && (
                    <div className="d-flex justity-content-between ml-auto">
                      <div className="d-flex">
                        <Button
                          onClick={handleShow}
                          className="newBlogPost"
                          size="lg"
                        >
                          <div>
                            <img
                              alt=""
                              src="https://img.icons8.com/ios-filled/50/ffffff/new.png"
                              width="23px"
                            />
                          </div>
                          <div style={{ fontSize: '16px' }}> newPost</div>
                        </Button>

                        <PostModal show={show} setShow={setShow} />

                        <NavBarDropdown
                          dropDownProps={item.dropDownProps}
                          path={item.path}
                          name={item.name}
                          flag={true}
                          userId={loggedInUserId}
                          user={user}
                          isScrolled={isScrolled}
                        />
                      </div>
                    </div>
                  )}

                  {item.path !== '/home' && (
                    <div className="d-flex justity-content-between ml-auto">
                      <NavBarDropdown
                        dropDownProps={item.dropDownProps}
                        path={item.path}
                        name={item.name}
                        userId={loggedInUserId}
                        user={user}
                      />
                    </div>
                  )}

                  {item.path === '/' && (
                    <NavbarSignUpButton navigate={navigate} />
                  )}
                </Container>
              </Navbar>
            )
        )}
    </>
  );
};

export default NavBar;
