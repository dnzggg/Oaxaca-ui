/**
 * Stores user in the global state
 *
 * @param userObj the user that is logged in
 * @return {{payload: *, type: string}}
 * @memberOf module:Actions
 */
const logIn = (userObj) => {
    return {
        type: "LOG_IN",
        payload: userObj
    }
};

/**
 * Resets user in global state
 *
 * @return {{payload: *, type: string}}
 * @memberOf module:Actions
 */
const logOut = () => {
    return {
        type: "LOG_OUT"
    }
};

/**
 * First fetches the api to check if user is logged in and then if it is stores information of user in global state
 *
 * @return {{payload: *, type: string}}
 * @memberOf module:Actions
 */
const autoLogIn = () => {
    return dispatch => {fetch("//127.0.0.1:5000/get_session_id", {method: 'POST'})
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                if (data.data !== undefined) {
                    let user;
                    user = {name:data.data.session_id, staff:data.data.staff};
                    dispatch(logIn(user))
                }
            });
        };
};

export default {
    logIn, logOut, autoLogIn
}
