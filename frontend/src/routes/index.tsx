import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import LogIn from '../pages/LogIn';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import Dashboard from '../pages/Dashboard';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path='/' exact component={LogIn} />
      <Route path='/register' component={Register} />
      <Route path='/forgot-password' component={ForgotPassword} />

      <Route path='/dashboard' component={Dashboard} isPrivate />
    </Switch>
  );
}

export default Routes;
