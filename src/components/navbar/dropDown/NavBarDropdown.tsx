import { Avatar } from '@mui/material';
import React, { useEffect } from 'react';
import { Dropdown, Image } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useReroute } from '../../../components/hooks/useReroute';
import { useSocket } from '../../../components/hooks/useSocket';
import { NewUserAvatar } from '../../../dummy/NewUserAvatar';
import { getUser } from '../../../lib/requests/user';
import { setUserAction } from '../../../redux/actions';
import { User } from '../../../redux/interfaces';
import {
  appendIdToUrl,
  getNavbarIcons,
  getOrder,
  isDynamicUserRoute,
  isWelcomePage,
  sx,
} from '../funcs/funcs';
import { NavbarProp } from '../interface/navbar';
import '../styles.scss';

interface NavBarDropdownProps {
  flag: boolean;
  userId: string;
  user?: User;
  isScrolled?: boolean;
}

export const NavBarDropdown: React.FC<
  Partial<NavbarProp & NavBarDropdownProps>
> = function (props) {
  const {
    path,
    name,
    dropDownProps: {
      dropDownMenuStyle,
      className,
      navigate,
      avatar,
      logOut,
      style,
      linkClassName,
    },
    flag,
    user,
    isScrolled,
  } = { ...props } as NavbarProp & NavBarDropdownProps;

  const dispatch = useDispatch();
  const { route } = useReroute();
  const { socket } = useSocket();

  const avatarStyle: { [key: string]: string } = {
    top: sx(String(avatar?.sx.src), flag).top,
    left: sx(String(avatar?.sx.src), flag).left,
    height: '' + sx(String(avatar?.sx.src), flag).height,
    width: '' + sx(String(avatar?.sx.src), flag).width,
    position: sx(String(avatar?.sx.src), flag).position,
  };

  useEffect(() => {
    getUser().then((user) => {
      dispatch(setUserAction(user));
    });
  }, []);

  return isWelcomePage(path) ? null : (
    <div className={className}>
      <Dropdown style={style} id={'n'}>
        {flag ? (
          <Dropdown.Toggle className="btn btn-dark navToggle">
            {!user?.image ? (
              <Avatar
                className="d-block"
                alt="photo not found"
                style={avatarStyle}
              >
                <NewUserAvatar
                  firstName={user?.firstName as string}
                  lastName={user?.lastName as string}
                />
              </Avatar>
            ) : (
              <Avatar
                className="d-block"
                alt="photo not found"
                src={avatar?.sx.src}
                style={avatarStyle}
              />
            )}
          </Dropdown.Toggle>
        ) : (
          <>
            {' '}
            <Dropdown.Toggle
              style={{ position: 'relative' }}
              className="btn btn-dark navToggle"
            >
              {!user?.image ? (
                <Avatar
                  className="d-block"
                  alt="photo not found"
                  style={avatarStyle}
                >
                  <NewUserAvatar
                    firstName={user?.firstName as string}
                    lastName={user?.lastName as string}
                  />
                </Avatar>
              ) : (
                <Avatar
                  className="d-block"
                  alt="photo not found"
                  src={avatar?.sx.src}
                  style={avatarStyle}
                />
              )}
            </Dropdown.Toggle>
          </>
        )}
        <Dropdown.Menu className="dropDownMenu" style={dropDownMenuStyle}>
          {getOrder(
            String(name),
            getNavbarIcons(user, navigate, logOut),
            user as User
          ).map((key) => (
            <button
              style={{
                border: 'none',
              }}
              key={key.name}
              className={linkClassName}
              onClick={() => {
                key.name === 'logout'
                  ? key.logOut && key.logOut()
                  : key.name === 'home'
                  ? route()
                  : key.navigate &&
                    key.navigate(
                      isDynamicUserRoute(user as User)
                        ? appendIdToUrl(key.url, user?.userName as string)
                        : String(key.url)
                    );
                //path !== '/messages' && socket.disconnect();
              }}
            >
              <div className="d-flex">
                <div className="mr-3">
                  <Image
                    alt=""
                    className="lrdimg"
                    width="20px"
                    height="20px"
                    src={key.src}
                    rounded={user ? true : false}
                  />
                </div>
                <div>{key.name}</div>
              </div>
            </button>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
