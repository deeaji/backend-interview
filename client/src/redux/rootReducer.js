import {combineReducers} from "redux";

import {keyInfoReducer} from "./reducers";

const rootReducer = combineReducers({
  keyInfo: keyInfoReducer
});

export {rootReducer};
export default rootReducer;
