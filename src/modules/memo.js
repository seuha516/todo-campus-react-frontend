import { createAction, handleActions } from "redux-actions";
import { takeLatest } from "redux-saga/effects";
import createRequestSaga, {
    createRequestActionTypes,
} from "lib/createRequestSaga";
import * as memoAPI from "lib/api/memo";

const INIT_LIST_MEMO_ERROR = "memo/INIT_LIST_MEMO_ERROR";
const INIT_WRITE_MEMO_ERROR = "memo/INIT_WRITE_MEMO_ERROR";
const INIT_UPDATE_MEMO_ERROR = "memo/INIT_UPDATE_MEMO_ERROR";
const INIT_REMOVE_MEMO_ERROR = "memo/INIT_REMOVE_MEMO_ERROR";
const [LIST_MEMO, LIST_MEMO_SUCCESS, LIST_MEMO_FAILURE] =
    createRequestActionTypes("memo/LIST_MEMO");
const [WRITE_MEMO, WRITE_MEMO_SUCCESS, WRITE_MEMO_FAILURE] =
    createRequestActionTypes("memo/WRITE_MEMO");
const [UPDATE_MEMO, UPDATE_MEMO_SUCCESS, UPDATE_MEMO_FAILURE] =
    createRequestActionTypes("memo/UPDATE_MEMO");
const [REMOVE_MEMO, REMOVE_MEMO_SUCCESS, REMOVE_MEMO_FAILURE] =
    createRequestActionTypes("memo/REMOVE_MEMO");

export const initListMemoError = createAction(INIT_LIST_MEMO_ERROR);
export const initWriteMemoError = createAction(INIT_WRITE_MEMO_ERROR);
export const initUpdateMemoError = createAction(INIT_UPDATE_MEMO_ERROR);
export const initRemoveMemoError = createAction(INIT_REMOVE_MEMO_ERROR);
export const listMemo = createAction(LIST_MEMO, ({ username }) => ({
    username,
}));
export const writeMemo = createAction(WRITE_MEMO, (data) => data);
export const updateMemo = createAction(UPDATE_MEMO, (data) => data);
export const removeMemo = createAction(REMOVE_MEMO, ({ num }) => ({
    num,
}));

//사가
const listMemoSaga = createRequestSaga(LIST_MEMO, memoAPI.list);
const writeMemoSaga = createRequestSaga(WRITE_MEMO, memoAPI.write);
const updateMemoSaga = createRequestSaga(UPDATE_MEMO, memoAPI.update);
const removeMemoSaga = createRequestSaga(REMOVE_MEMO, memoAPI.remove);

export function* memoSaga() {
    yield takeLatest(LIST_MEMO, listMemoSaga);
    yield takeLatest(WRITE_MEMO, writeMemoSaga);
    yield takeLatest(UPDATE_MEMO, updateMemoSaga);
    yield takeLatest(REMOVE_MEMO, removeMemoSaga);
}

const initialState = {
    list: null,
    listError: null,
    writeError: null,
    updateError: null,
    removeError: null,
};

const memo = handleActions(
    {
        [INIT_LIST_MEMO_ERROR]: (state) => {
            return { ...state, listError: null };
        },
        [INIT_WRITE_MEMO_ERROR]: (state) => {
            return { ...state, writeError: null };
        },
        [INIT_UPDATE_MEMO_ERROR]: (state) => {
            return { ...state, updateError: null };
        },
        [INIT_REMOVE_MEMO_ERROR]: (state) => {
            return { ...state, removeError: null };
        },
        [LIST_MEMO]: () => (state) => {
            return { ...state, list: null, listError: null };
        },
        [LIST_MEMO_SUCCESS]: (state, { payload: result }) => {
            return { ...state, list: result.result, listError: false };
        },
        [LIST_MEMO_FAILURE]: (state, { payload: error }) => {
            return { ...state, listError: error };
        },
        [WRITE_MEMO]: (state) => {
            return { ...state, writeError: null };
        },
        [WRITE_MEMO_SUCCESS]: (state) => {
            return { ...state, writeError: false };
        },
        [WRITE_MEMO_FAILURE]: (state, { payload: error }) => {
            return { ...state, writeError: error };
        },
        [UPDATE_MEMO]: (state) => {
            return { ...state, updateError: null };
        },
        [UPDATE_MEMO_SUCCESS]: (state) => {
            return { ...state, updateError: false };
        },
        [UPDATE_MEMO_FAILURE]: (state, { payload: error }) => {
            return { ...state, updateError: error };
        },
        [REMOVE_MEMO]: (state) => {
            return { ...state, removeError: null };
        },
        [REMOVE_MEMO_SUCCESS]: (state) => {
            return { ...state, removeError: false };
        },
        [REMOVE_MEMO_FAILURE]: (state, { payload: error }) => {
            return { ...state, removeError: error };
        },
    },
    initialState
);
export default memo;
