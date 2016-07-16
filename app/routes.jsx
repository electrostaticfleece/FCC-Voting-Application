import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from 'containers/App';


export default (store) => {
  const requireAuth = (nextState, replace, callback) => {
    const { user: {authenticated }} = store.getState();
    if(!authenticated) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
    }
    callback();
  };

  const redirectAuth = (nextState, replace, callback) => {
    const { user: {authenticated }} = store.getState();
    if(authenticated){
      replace({
        pathname: '/'
      });
    }
    callback();
  };

  return (
    <Route path='/' component={App}>
    </Route>
  );
};