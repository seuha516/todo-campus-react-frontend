import { createAction, handleActions } from "redux-actions";
import { takeLatest } from "redux-saga/effects";
import createRequestSaga, {
    createRequestActionTypes,
} from "lib/createRequestSaga";
import * as weektableAPI from "lib/api/weektable";

const INIT_GETLIST_WEEKTABLE_ERROR = "weektable/INIT_GETLIST_WEEKTABLE_ERROR";
const INIT_INSERT_WEEKTABLE_ERROR = "weektable/INIT_INSERT_WEEKTABLE_ERROR";
const INIT_UPDATE_WEEKTABLE_ERROR = "weektable/INIT_UPDATE_WEEKTABLE_ERROR";
const INIT_REMOVE_WEEKTABLE_ERROR = "weektable/INIT_REMOVE_WEEKTABLE_ERROR";
const [
    GETLIST_WEEKTABLE,
    GETLIST_WEEKTABLE_SUCCESS,
    GETLIST_WEEKTABLE_FAILURE,
] = createRequestActionTypes("weektable/GETLIST_WEEKTABLE");
const [INSERT_WEEKTABLE, INSERT_WEEKTABLE_SUCCESS, INSERT_WEEKTABLE_FAILURE] =
    createRequestActionTypes("weektable/INSERT_WEEKTABLE");
const [UPDATE_WEEKTABLE, UPDATE_WEEKTABLE_SUCCESS, UPDATE_WEEKTABLE_FAILURE] =
    createRequestActionTypes("weektable/UPDATE_WEEKTABLE");
const [REMOVE_WEEKTABLE, REMOVE_WEEKTABLE_SUCCESS, REMOVE_WEEKTABLE_FAILURE] =
    createRequestActionTypes("weektable/REMOVE_WEEKTABLE");

export const initGetListWeekTableError = createAction(
    INIT_GETLIST_WEEKTABLE_ERROR
);
export const initInsertWeekTableError = createAction(
    INIT_INSERT_WEEKTABLE_ERROR
);
export const initUpdateWeekTableError = createAction(
    INIT_UPDATE_WEEKTABLE_ERROR
);
export const initRemoveWeekTableError = createAction(
    INIT_REMOVE_WEEKTABLE_ERROR
);
export const getListWeekTable = createAction(
    GETLIST_WEEKTABLE,
    ({ username }) => ({ username })
);
export const insertWeekTable = createAction(INSERT_WEEKTABLE, (data) => data);
export const updateWeekTable = createAction(UPDATE_WEEKTABLE, (data) => data);
export const removeWeekTable = createAction(REMOVE_WEEKTABLE, ({ num }) => ({
    num,
}));

//사가
const getListWeekTableSaga = createRequestSaga(
    GETLIST_WEEKTABLE,
    weektableAPI.getList
);
const insertWeekTableSaga = createRequestSaga(
    INSERT_WEEKTABLE,
    weektableAPI.insert
);
const updateWeekTableSaga = createRequestSaga(
    UPDATE_WEEKTABLE,
    weektableAPI.update
);
const removeWeekTableSaga = createRequestSaga(
    REMOVE_WEEKTABLE,
    weektableAPI.remove
);

export function* weektableSaga() {
    yield takeLatest(GETLIST_WEEKTABLE, getListWeekTableSaga);
    yield takeLatest(INSERT_WEEKTABLE, insertWeekTableSaga);
    yield takeLatest(UPDATE_WEEKTABLE, updateWeekTableSaga);
    yield takeLatest(REMOVE_WEEKTABLE, removeWeekTableSaga);
}

const initialState = {
    list: null,
    getListError: null,
    insertError: null,
    updateError: null,
    removeError: null,
};

const weektable = handleActions(
    {
        [INIT_GETLIST_WEEKTABLE_ERROR]: (state) => {
            return { ...state, getListError: null };
        },
        [INIT_INSERT_WEEKTABLE_ERROR]: (state) => {
            return { ...state, insertError: null };
        },
        [INIT_UPDATE_WEEKTABLE_ERROR]: (state) => {
            return { ...state, updateError: null };
        },
        [INIT_REMOVE_WEEKTABLE_ERROR]: (state) => {
            return { ...state, removeError: null };
        },
        [GETLIST_WEEKTABLE]: () => (state) => {
            return { ...state, list: null, getListError: null };
        },
        [GETLIST_WEEKTABLE_SUCCESS]: (state, { payload: result }) => {
            return { ...state, list: result, getListError: false };
        },
        [GETLIST_WEEKTABLE_FAILURE]: (state, { payload: error }) => {
            return { ...state, getListError: error };
        },
        [INSERT_WEEKTABLE]: (state) => {
            return { ...state, insertError: null };
        },
        [INSERT_WEEKTABLE_SUCCESS]: (state) => {
            return { ...state, insertError: false };
        },
        [INSERT_WEEKTABLE_FAILURE]: (state, { payload: error }) => {
            return { ...state, insertError: error };
        },
        [UPDATE_WEEKTABLE]: (state) => {
            return { ...state, updateError: null };
        },
        [UPDATE_WEEKTABLE_SUCCESS]: (state) => {
            return { ...state, updateError: false };
        },
        [UPDATE_WEEKTABLE_FAILURE]: (state, { payload: error }) => {
            return { ...state, updateError: error };
        },
        [REMOVE_WEEKTABLE]: (state) => {
            return { ...state, removeError: null };
        },
        [REMOVE_WEEKTABLE_SUCCESS]: (state) => {
            return { ...state, removeError: false };
        },
        [REMOVE_WEEKTABLE_FAILURE]: (state, { payload: error }) => {
            return { ...state, removeError: error };
        },
    },
    initialState
);
export default weektable;
