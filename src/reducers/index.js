import currentUser from "./currentUser";
import currentItems from "./currentItems";
import {combineReducers} from "redux";

/**
 * @module Reducers
 */

/**
 * Combines all the reducers given so it can be used in index.js as a global state
 */
const rootReducer = combineReducers({
    currentItems, currentUser
});

export default rootReducer;
