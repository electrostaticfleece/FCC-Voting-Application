import { polyfill } from 'es6-promise';
import request from 'axios';
import { browserHistory } from 'react-router';
import shortid from 'shortid';
import * as types from 'types';

polyfill();

//REQUEST ACTIONS

export function makePollRequest(method, id, data, api = '/poll') {
  return request[method](api + (id ? ('/' + id) : ''), data);
}

//OPTIMIST UPDATES REQUEST ACTIONS

export function createPollRequest(data, options){
  return {
    type: types.CREATE_POLL_REQUEST,
    id: data.poll.pollId,
    name: data.poll.question,
    options: options
  }
}

export function fetchPollRequest(data){
  return {
    type: types.FETCH_POLL_REQUEST,
    id: data
  }
}

//SUCCESS ACTIONS 

export function createPollSuccess() {
  return {
    type: types.CREATE_POLL_SUCCESS
  };
}

export function fetchPollSuccess(data) {
  return {
    type: types.FETCH_POLL_SUCCESS,
    id: data.pollId,
    name: data.question,
    options: data.options,
    voters: data.voters
  };
}


//FAILURE ACTIONS

export function fetchPollFailure(data) {
  return {
    type: types.FETCH_POLL_FAILURE,
    id: data.id,
    error: data.error
  };
}

export function createPollFailure(data){
  return {
    type: types.CREATE_POLL_FAILURE,
    id: data.id,
    error: data.error
  };
}

//MESSAGE ACTIONS

export function message(data){
  return {
    type: types.DISPERSE_MESSAGE,
    message: data.message
  }
}

//POLL UPDATE ACTIONS

export function increment(data){
  return {
    type: types.INCREMENT_COUNT,
    id: data.id
  };
}

export function add(data){
  return {
    type: types.ADD_OPTION,
    id: data.id,
    option: data.option
  }
}

//SERVER REQUESTS

// The following action creators return a function,
// which will get executed by Redux-Thunk middleware
// This function does not need to be pure, and thus allowed
// to have side effects, including executing asynchronous API calls.


//CREATE & UPDATE REQUESTS
export function createPoll(poll){ 
  const { name, options } = poll;
  return(dispatch, getState) => {

    //If there is no name or there are no options do not createPoll
    if (name.trim().length <= 0 ||
        options.length <= 0 ) return;

    //If an option is repeated do not createPoll
    if(options.some((option, i, arr) => 
      i !== arr.lastIndexOf(option)
    )) return;

    //Generate a unique ID to create relation between poll and items
    const id = shortid.generate();
    const voters = [0];
    const optionsObj = options.map((opt) => {
      return { 
        count: 0,
        item: opt,
        poll: id
      };
    });

    const data = {
      poll: {
        question: name,
        pollId: id,
        voters: voters
      },
      items: options
    }

    //First dispatch an optimistic update
    dispatch(createPollRequest(data, optionsObj));

    return makePollRequest('post', id, data)
      .then( res => {
        if(res.status === 200) {
          browserHistory.push('view/' + data.poll.pollId);
          return dispatch(createPollSuccess());
        }
      })
      .catch(() => 
        dispatch(createPollFailure({id, error: 'Awww we couldn\'t create your poll :(. Please try again'}))
      );
  };
}

export function incrementCount(data) {
  const { pollId, itemId } = data;
  return (dispatch, getState) => {
    return makePollRequest('put', pollId, {
      updateType: 'increment',
      item: itemId
    })
    .then( res => {
      if(res.status === 200){
        return dispatch(increment({id: itemId}))
      }
      if(res.status === 204){
        return dispatch(message({message: 'We cannot process your request because you already voted for this poll.'}));
      }
    })
    .catch(() => 
      dispatch(createPollFailure({id: pollId, error: 'Something went wrong. We were unable to add your vote'}))
    );
  };
}

export function addOption(data) {
  const { option, pollId } = data;
  return (dispatch, getState) => {
    return makePollRequest('put', pollId, {
      updateType: 'add',
      item: data.option
    })
    .then( res => {
      if(res.status === 200){
        return dispatch(add({option: data.option, id: res.data.id}))
      }
      if(res.status === 204){
        return dispatch(message({message: 'We cannot process your request because you already voted for this poll.'}));
      }
    })
    .catch(() => 
      dispatch(createPollFailure({id: data.pollId, error: 'Something went wrong. We were unable to add an option'}))
    );
  };
}

//DELETE REQUESTS 

export function destroyPoll(data){
  console.log(data);
  return {
    type: types.DESTROY_POLL,
    promise: makePollRequest('delete', data)
  }
}

//GET REQUESTS

export function fetchPolls(){
  return {
    type: types.FETCH_POLLS,
    promise: makePollRequest('get', null, null, '/allpolls')
  };
}

export function fetchPoll(pollId) {
  return (dispatch, getState) => {
    //First dispatch an optimistic update

    dispatch(fetchPollRequest(pollId));

    return makePollRequest('get', pollId)
      .then( res => {
        if(res.status === 200) {
          const poll = res.data[0];
          const data = {
            options: poll.Items,
            pollId: poll.pollId,
            question: poll.question
          }
          return dispatch(fetchPollSuccess(data));
        }
      })
      .catch(() => 
         dispatch(fetchPollFailure({ pollId, error: 'Looks like we were unable to fetch poll data from the database.'}))
      );
  };
}