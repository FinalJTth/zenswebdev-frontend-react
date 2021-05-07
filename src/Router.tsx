import React from 'react';
/*
import logo from './logo.svg';
*/
import loadable from '@loadable/component';
import { Route, Switch } from 'react-router-dom';
import Home from './scenes/Home';
import Login from './scenes/Login';
import Signup from './scenes/Signup';
import Playground from './Playground';
import Profile from './scenes/Profile';

/*
const Home = loadable(() => import('./scenes/Home'));
const Login = loadable(() => import('./scenes/Login'));
const Signup = loadable(() => import('./scenes/Signup'));
const Playground = loadable(() => import('./Playground'));
*/

const Router: React.FC<any> = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/playground" component={Playground} />
      <Route path="/profile" component={Profile} />
    </Switch>
  );
};

export default Router;
