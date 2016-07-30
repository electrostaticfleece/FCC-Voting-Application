import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from 'containers/App';
import Home from 'containers/Home';
import CreatePollInput from 'containers/CreatePoll';
import ViewPoll from 'containers/ViewPoll';
import MyPolls from 'containers/MyPolls';


export default (store) => {
  const requireAuth = (nextState, replace, callback) => {
    const { user: {authenticated }} = store.getState();
    if(!authenticated) {
      replace({
        pathname: '/',
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
    <Route path='/' component={ App }>
      <IndexRoute component={ Home } />
      <Route path="about" />
      <Route path="mypolls" onEnter={requireAuth} component={ MyPolls } />
      <Route path="createpoll" onEnter={requireAuth} component={ CreatePollInput }/>
      <Route path="view/:pollId" component={ ViewPoll } />
    </Route>
  );
};