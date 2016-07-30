import { combineReducers } from 'redux';
import user from 'reducers/users';
import poll from 'reducers/polls';
import message from 'reducers/message';
import { routerReducer as routing } from 'react-router-redux';

// Combine reducers with routeReducer which keeps track of
// router state
const rootReducer = combineReducers({
  user,
  poll,
  routing,
  message
});

export default rootReducer;