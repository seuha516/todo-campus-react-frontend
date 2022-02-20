import { createAction, handleActions } from "redux-actions";
import { takeLatest } from "redux-saga/effects";
import createRequestSaga, {
    createRequestActionTypes,
} from "lib/createRequestSaga";
import * as postAPI from "lib/api/post";

const INIT_LIST_POST_ERROR = "post/INIT_LIST_POST_ERROR";
const INIT_READ_POST_ERROR = "post/INIT_READ_POST_ERROR";
const INIT_WRITE_POST_ERROR = "post/INIT_WRITE_POST_ERROR";
const INIT_UPDATE_POST_ERROR = "post/INIT_UPDATE_POST_ERROR";
const INIT_REMOVE_POST_ERROR = "post/INIT_REMOVE_POST_ERROR";
const INIT_ADDCOMMENT_POST_ERROR = "post/INIT_ADDCOMMENT_POST_ERROR";
const [LIST_POST, LIST_POST_SUCCESS, LIST_POST_FAILURE] =
    createRequestActionTypes("post/LIST_POST");
const [READ_POST, READ_POST_SUCCESS, READ_POST_FAILURE] =
    createRequestActionTypes("post/READ_POST");
const [WRITE_POST, WRITE_POST_SUCCESS, WRITE_POST_FAILURE] =
    createRequestActionTypes("post/WRITE_POST");
const [UPDATE_POST, UPDATE_POST_SUCCESS, UPDATE_POST_FAILURE] =
    createRequestActionTypes("post/UPDATE_POST");
const [REMOVE_POST, REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE] =
    createRequestActionTypes("post/REMOVE_POST");
const [ADDCOMMENT_POST, ADDCOMMENT_POST_SUCCESS, ADDCOMMENT_POST_FAILURE] =
    createRequestActionTypes("post/ADDCOMMENT_POST");

export const initListPostError = createAction(INIT_LIST_POST_ERROR);
export const initReadPostError = createAction(INIT_READ_POST_ERROR);
export const initWritePostError = createAction(INIT_WRITE_POST_ERROR);
export const initUpdatePostError = createAction(INIT_UPDATE_POST_ERROR);
export const initRemovePostError = createAction(INIT_REMOVE_POST_ERROR);
export const initAddCommentPostError = createAction(INIT_ADDCOMMENT_POST_ERROR);
export const listPost = createAction(LIST_POST, (query) => query);
export const readPost = createAction(READ_POST, (num) => num);
export const writePost = createAction(WRITE_POST, (post) => post);
export const updatePost = createAction(UPDATE_POST, (post) => post);
export const removePost = createAction(REMOVE_POST, ({ num }) => ({ num }));
export const addCommentPost = createAction(
    ADDCOMMENT_POST,
    (comment) => comment
);

//사가
const listPostSaga = createRequestSaga(LIST_POST, postAPI.list);
const readPostSaga = createRequestSaga(READ_POST, postAPI.read);
const writePostSaga = createRequestSaga(WRITE_POST, postAPI.write);
const updatePostSaga = createRequestSaga(UPDATE_POST, postAPI.update);
const removePostSaga = createRequestSaga(REMOVE_POST, postAPI.remove);
const addCommentPostSaga = createRequestSaga(
    ADDCOMMENT_POST,
    postAPI.addComment
);

export function* postSaga() {
    yield takeLatest(LIST_POST, listPostSaga);
    yield takeLatest(READ_POST, readPostSaga);
    yield takeLatest(WRITE_POST, writePostSaga);
    yield takeLatest(UPDATE_POST, updatePostSaga);
    yield takeLatest(REMOVE_POST, removePostSaga);
    yield takeLatest(ADDCOMMENT_POST, addCommentPostSaga);
}

const initialState = {
    list: null,
    post: null,
    listError: null,
    readError: null,
    writeError: null,
    updateError: null,
    removeError: null,
    addCommentError: null,
};

const post = handleActions(
    {
        [INIT_LIST_POST_ERROR]: (state) => {
            return { ...state, listError: null };
        },
        [INIT_READ_POST_ERROR]: (state) => {
            return { ...state, readError: null };
        },
        [INIT_WRITE_POST_ERROR]: (state) => {
            return { ...state, writeError: null };
        },
        [INIT_UPDATE_POST_ERROR]: (state) => {
            return { ...state, updateError: null };
        },
        [INIT_REMOVE_POST_ERROR]: (state) => {
            return { ...state, removeError: null };
        },
        [INIT_ADDCOMMENT_POST_ERROR]: (state) => {
            return { ...state, addCommentError: null };
        },
        [LIST_POST]: () => (state) => {
            return { ...state, list: null, listError: null };
        },
        [LIST_POST_SUCCESS]: (state, { payload: result }) => {
            return { ...state, list: result.result, listError: false };
        },
        [LIST_POST_FAILURE]: (state, { payload: error }) => {
            return { ...state, listError: error };
        },
        [READ_POST]: () => (state) => {
            return { ...state, post: null, readError: null };
        },
        [READ_POST_SUCCESS]: (state, { payload: result }) => {
            return { ...state, post: result, readError: false };
        },
        [READ_POST_FAILURE]: (state, { payload: error }) => {
            return { ...state, readError: error };
        },
        [WRITE_POST]: (state) => {
            return { ...state, writeError: null };
        },
        [WRITE_POST_SUCCESS]: (state) => {
            return { ...state, writeError: false };
        },
        [WRITE_POST_FAILURE]: (state, { payload: error }) => {
            return { ...state, writeError: error };
        },
        [UPDATE_POST]: (state) => {
            return { ...state, updateError: null };
        },
        [UPDATE_POST_SUCCESS]: (state) => {
            return { ...state, updateError: false };
        },
        [UPDATE_POST_FAILURE]: (state, { payload: error }) => {
            return { ...state, updateError: error };
        },
        [REMOVE_POST]: (state) => {
            return { ...state, removeError: null };
        },
        [REMOVE_POST_SUCCESS]: (state) => {
            return { ...state, removeError: false };
        },
        [REMOVE_POST_FAILURE]: (state, { payload: error }) => {
            return { ...state, removeError: error };
        },
        [ADDCOMMENT_POST]: (state) => {
            return { ...state, addCommentError: null };
        },
        [ADDCOMMENT_POST_SUCCESS]: (state) => {
            return { ...state, addCommentError: false };
        },
        [ADDCOMMENT_POST_FAILURE]: (state, { payload: error }) => {
            return { ...state, addCommentError: error };
        },
    },
    initialState
);
export default post;
