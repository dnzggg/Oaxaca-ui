/**
 * If action type is log_in changes state with user information
 * if action type is log_out then gets rid of user information
 *
 * @param state global state of user
 * @param action the action triggered from actions
 * @return {{}|{loggedIn: boolean, staff: boolean, user: {}}|{loggedIn: boolean, staff: boolean, user: *}}
 * @memberOf module:Reducers
 */
const currentUser = (state = {}, action) => {
    switch (action.type) {
        case "LOG_IN":
            return {
                ...state,
                user: action.payload,
                loggedIn: true,
                staff: action.payload.staff
            };
        case "LOG_OUT":
            return {
                ...state,
                user: {},
                loggedIn: false,
                staff: false
            };
        default:
            return state
    }
};

export default currentUser;
