// import axios from 'axios'
// import thunk from 'redux-thunk'
// import axiosQuery from './axiosQuery'
import RESTCall from "./restApi";

export const GENERAL_REQUEST = "GENERAL_REQUEST";
export const GENERAL_SUCCESS = "GENERAL_SUCCESS";
export const GENERAL_FAILURE = "GENERAL_FAILURE";

export const TODO_REQUEST = "TODO_REQUEST";
export const TODO_SUCCESS = "TODO_SUCCESS";
export const TODO_FAILURE = "TODO_FAILURE";

export const TODO_UPDATE_REQUEST = "TODO_UPDATE_REQUEST";
export const TODO_UPDATE_SUCCESS = "TODO_UPDATE_SUCCESS";
export const TODO_UPDATE_FAILURE = "TODO_UPDATE_FAILURE";

const ENV = process.env;

/** General Form Actions */
export const generalRequested = request => {
  // console.log('appointmentRequested',request)
  return {
    type: GENERAL_REQUEST,
    payload: {request}
  };
};
export const generalSuccess = (response, resource, request) => {
  if (
    resource == "todo_table" &&
    (request == "search" || request == "get" || request == "read")
  ) {
    return {
      type: TODO_SUCCESS,
      payload: {response, resource, request}
    };
  } else if (resource == "todo_table") {
    return {
      type: TODO_UPDATE_SUCCESS,
      payload: {response, resource, request}
    };
  } else {
    return {
      type: GENERAL_SUCCESS,
      payload: {response, resource, request}
    };
  }
};

export const generalFailure = error => {
  return {
    type: GENERAL_FAILURE,
    error
  };
};

export const handleQuery = (formData, callBack) => {
  return (dispatch, getState) => {
    // console.log('myRequest',formData)
    RESTCall.axiosQuery(formData)
      .then(response => {
        // console.log('kkkkdispatch',formData,response)

        const callDispatcher = {
          general: generalSuccess(
            response.data,
            formData.resource,
            formData.request
          )
        };
        response.data && dispatch(callDispatcher.general);
      })
      .catch(error => {
        console.log("error", error);
        dispatch(generalFailure(error));
        return error;
      });
  };
};
