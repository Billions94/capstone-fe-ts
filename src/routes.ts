import React from 'react';
import EditNewUser from './components/auth/EditNewUser';
import LogIn from './components/auth/LogIn';
import Register from './components/auth/Register';
import { VerifyAccount } from './components/auth/VerifyAccount';
import Home from './components/Home/Home';
import Messages from './components/messages/Messages';
import Edit from './components/post/crud/EditPost';
import CloseAccount from './components/user/account/CloseAccount';
import Settings from './components/user/account/Settings';
import Followers from './components/user/followers/Followers';
import UserProfile from './components/user/profile/UserProfile';
import BeforeLogin from './components/welcomePage/WelcomePage';

export const AppRoutes: Array<[string, React.FC]> = [
  ['login', LogIn],
  ['home', Home],
  ['register', Register],
  ['/', BeforeLogin],
  ['messages', Messages],
  ['messages/:id', Messages],
  ['userProfile/:id', UserProfile],
  ['edit', Edit],
  ['followers/:id', Followers],
  ['closeAccount', CloseAccount],
  ['settings', Settings],
  ['editNewUser', EditNewUser],
  ['verifyAccount', VerifyAccount],
  ['verifyAccount/:token', VerifyAccount],
];
