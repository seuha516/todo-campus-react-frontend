import { createAction, handleActions } from "redux-actions";
import { call, takeLatest } from "redux-saga/effects";
import createRequestSaga, {
    createRequestActionTypes,
} from "lib/createRequestSaga";
import * as accountAPI from "lib/api/account";

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] =
    createRequestActionTypes("account/REGISTER");
const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] =
    createRequestActionTypes("account/LOGIN");
const LOGOUT = "account/LOGOUT";

export const register = createAction(REGISTER, (user) => user);
export const login = createAction(LOGIN, (user) => user);
export const logout = createAction(LOGOUT);

//사가
const registerSaga = createRequestSaga(REGISTER, accountAPI.register);
const loginSaga = createRequestSaga(LOGIN, accountAPI.login);
function loginFailureSaga() {
    try {
        localStorage.removeItem("user");
    } catch (e) {
        console.log("localStorage is not working");
    }
}
function logoutSaga() {
    try {
        localStorage.removeItem("user");
    } catch (e) {
        console.log("localStorage is not working");
    }
}
export function* accountSaga() {
    yield takeLatest(REGISTER, registerSaga);
    yield takeLatest(LOGIN, loginSaga);
    yield takeLatest(LOGIN_FAILURE, loginFailureSaga);
    yield takeLatest(LOGOUT, logoutSaga);
}

const initialState = {
    user: null,
};

const account = handleActions(
    {
        [REGISTER_SUCCESS]: (state, { payload: user }) => {
            return { user };
        },
        [REGISTER_FAILURE]: (state, { payload: error }) => {
            alert(error.response.data.message);
            return state;
        },
        [LOGIN_SUCCESS]: (state, { payload: user }) => {
            return { user };
        },
        [LOGIN_FAILURE]: (state, { payload: error }) => {
            alert(error.response.data.message);
            return { user: null };
        },
        [LOGOUT]: (state) => {
            return { user: null };
        },
    },
    initialState
);
export default account;
