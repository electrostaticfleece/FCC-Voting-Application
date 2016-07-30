import { combineReducers} from 'redux';
import * as types from 'types';

const message = (
  state, 
  action
  ) => {
  switch(action.type){
    case types.DISPERSE_MESSAGE:
      return action.message;
    default:
      return '';
  }
}


const messageReducer = combineReducers({
  message
});

export default messageReducer; 