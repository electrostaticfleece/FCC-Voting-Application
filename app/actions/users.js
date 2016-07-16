import { polyfill } from 'es6-promise';
import request from 'axios';
import { push } from 'react-router-redux';

import * as types from 'types';

polyfill();

function makeUserRequest(method, data, api) {
  return request[method](api, data);
}

export function beginLogout() {
  return { type: types.LOGOUT_USER};
}

export function logoutSuccess() {
  return { type: types.LOGOUT_SUCCESS_USER};
}

export function logoutError() {
  return { type: types.LOGOUT_ERROR_USER};
}

export function logOut() {
  return dispatch => {
    dispatch(beginLogout());

    return makeUserRequest('post', null, '/logout')
      .then(response => {
        if(response.status === 200){
          dispatch(logoutSuccess());
        } else {
          dispatch(logoutError());
        }
      });
  };
}