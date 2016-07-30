import { combineReducers} from 'redux';
import * as types from 'types';


const options = (
  state,
  action
) => {
  switch(action.type){
    case types.INCREMENT_COUNT:
        return state.map((option, index) => {
          if(option.id === action.id){
            return Object.assign({}, option, {
              count: option.count + 1
            })
          }
          return option;
        });
    default: 
      return state;
  }
}

const currentPoll = (
  state = {
    id: null,
    options: [
      {count: 0, item: ''}
    ]
  },
  action
) => {
  switch(action.type) {
    case types.FETCH_POLL_SUCCESS:
    case types.CREATE_POLL_REQUEST:
      return {
        id: action.id,
        name: action.name,
        options: action.options
      };
    case types.INCREMENT_COUNT:
      return Object.assign({}, state, {options: options(state.options, action) })
    case types.DISPERSE_MESSAGE: 
      return state;
    default:
      return {
        id: null,
        options: [
          {count: 0, item: ''}
        ]
      }; 
  }
}

const allPolls = (
  state = {},
  action
) => {
  switch(action.type) {
    case types.FETCH_POLLS_SUCCESS:
      return action.res.data;
    default:
      return state;
  }
}

const pollReducer = combineReducers({
  currentPoll,
  allPolls
});

export default pollReducer; 