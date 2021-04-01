import {combineReducers} from "redux";
//import entityById from './entityById'
import {
  GENERAL_REQUEST,
  GENERAL_SUCCESS,
  GENERAL_FAILURE,
  TODO_REQUEST,
  TODO_SUCCESS,
  TODO_FAILURE,
  TODO_UPDATE_REQUEST,
  TODO_UPDATE_SUCCESS,
  TODO_UPDATE_FAILURE
} from "../actions";
import InitialData from "../../data";

const todo_list = (state = [], action = {}) => {
  switch (action.type) {
    case TODO_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case TODO_SUCCESS: {
      return {
        ...state,
        request: action.payload.request ? action.payload.request : "",
        response: action.payload.response ? action.payload.response : "",
        resource: action.payload.resource ? action.payload.resource : "",
        isFetching: false,
        error: null
      };
    }
    case TODO_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    }
    default:
      return state;
  }
};

const update_todo_list = (state = [], action = {}) => {
  switch (action.type) {
    case TODO_UPDATE_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case TODO_UPDATE_SUCCESS: {
      return {
        ...state,
        request: action.payload.request ? action.payload.request : "",
        response: action.payload.response ? action.payload.response : "",
        resource: action.payload.resource ? action.payload.resource : "",
        isFetching: false,
        error: null
      };
    }
    case TODO_UPDATE_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    }
    default:
      return state;
  }
};

const generalData = (state = [], action = {}) => {
  switch (action.type) {
    case GENERAL_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case GENERAL_SUCCESS: {
      return {
        ...state,
        tableData: action.payload.response ? action.payload.response : "",
        response: action.payload.response ? action.payload.response : "",
        resource: action.payload.resource ? action.payload.resource : "",
        isFetching: false,
        error: null
      };
    }
    case GENERAL_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    }
    default:
      return state;
  }
};

const combined = combineReducers({
  todo_list,
  update_todo_list
});

export default combined;
