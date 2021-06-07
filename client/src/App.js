import React from 'react';

import { Switch, Route } from 'react-router-dom';
import { Login } from './pages/user/Login';
import { User } from './pages/user/User';
import { Register } from './pages/user/Register';
import { UserList } from './pages/adminUser/UserList';
import { pageUrl } from './cosntant';
export const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path={pageUrl.user} component={User} />
      <Route path={pageUrl.register} component={Register} />
      <Route path={pageUrl.adminUser} component={UserList} />
    </Switch>
  );
};
