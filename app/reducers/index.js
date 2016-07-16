import { combineReducers } from 'redux';
import user from 'reducers/users';
import { routerReducer as routing } from 'react-router-redux';

// Combine reducers with routeReducer which keeps track of
// router state
const rootReducer = combineReducers({
  user,
  routing
});

export default rootReducer;