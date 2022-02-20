import { createAction, handleActions } from "redux-actions";
import { takeLatest } from "redux-saga/effects";
import createRequestSaga, {
    createRequestActionTypes,
} from "lib/createRequestSaga";
import * as todoAPI from "lib/api/todo";

const INIT_LIST_TODO_ERROR = "todo/INIT_LIST_TODO_ERROR";
const INIT_WRITE_TODO_ERROR = "todo/INIT_WRITE_TODO_ERROR";
const INIT_UPDATE_TODO_ERROR = "todo/INIT_UPDATE_TODO_ERROR";
const INIT_REMOVE_TODO_ERROR = "todo/INIT_REMOVE_TODO_ERROR";
const [LIST_TODO, LIST_TODO_SUCCESS, LIST_TODO_FAILURE] =
    createRequestActionTypes("todo/LIST_TODO");
const [WRITE_TODO, WRITE_TODO_SUCCESS, WRITE_TODO_FAILURE] =
    createRequestActionTypes("todo/WRITE_TODO");
const [UPDATE_TODO, UPDATE_TODO_SUCCESS, UPDATE_TODO_FAILURE] =
    createRequestActionTypes("todo/UPDATE_TODO");
const [REMOVE_TODO, REMOVE_TODO_SUCCESS, REMOVE_TODO_FAILURE] =
    createRequestActionTypes("todo/REMOVE_TODO");

export const initListTodoError = createAction(INIT_LIST_TODO_ERROR);
export const initWriteTodoError = createAction(INIT_WRITE_TODO_ERROR);
export const initUpdateTodoError = createAction(INIT_UPDATE_TODO_ERROR);
export const initRemoveTodoError = createAction(INIT_REMOVE_TODO_ERROR);
export const listTodo = createAction(LIST_TODO, (data) => data);
export const writeTodo = createAction(WRITE_TODO, (todo) => todo);
export const updateTodo = createAction(UPDATE_TODO, (todo) => todo);
export const removeTodo = createAction(REMOVE_TODO, ({ num }) => ({ num }));

//사가
const listTodoSaga = createRequestSaga(LIST_TODO, todoAPI.list);
const writeTodoSaga = createRequestSaga(WRITE_TODO, todoAPI.write);
const updateTodoSaga = createRequestSaga(UPDATE_TODO, todoAPI.update);
const removeTodoSaga = createRequestSaga(REMOVE_TODO, todoAPI.remove);

export function* todoSaga() {
    yield takeLatest(LIST_TODO, listTodoSaga);
    yield takeLatest(WRITE_TODO, writeTodoSaga);
    yield takeLatest(UPDATE_TODO, updateTodoSaga);
    yield takeLatest(REMOVE_TODO, removeTodoSaga);
}

const initialState = {
    list: null,
    listError: null,
    writeError: null,
    updateError: null,
    removeError: null,
};

const todo = handleActions(
    {
        [INIT_LIST_TODO_ERROR]: (state) => {
            return { ...state, listError: null };
        },
        [INIT_WRITE_TODO_ERROR]: (state) => {
            return { ...state, writeError: null };
        },
        [INIT_UPDATE_TODO_ERROR]: (state) => {
            return { ...state, updateError: null };
        },
        [INIT_REMOVE_TODO_ERROR]: (state) => {
            return { ...state, removeError: null };
        },
        [LIST_TODO]: () => (state) => {
            return { ...state, list: null, listError: null };
        },
        [LIST_TODO_SUCCESS]: (state, { payload: result }) => {
            return { ...state, list: result, listError: false };
        },
        [LIST_TODO_FAILURE]: (state, { payload: error }) => {
            return { ...state, listError: error };
        },
        [WRITE_TODO]: (state) => {
            return { ...state, writeError: null };
        },
        [WRITE_TODO_SUCCESS]: (state) => {
            return { ...state, writeError: false };
        },
        [WRITE_TODO_FAILURE]: (state, { payload: error }) => {
            return { ...state, writeError: error };
        },
        [UPDATE_TODO]: (state) => {
            return { ...state, updateError: null };
        },
        [UPDATE_TODO_SUCCESS]: (state) => {
            return { ...state, updateError: false };
        },
        [UPDATE_TODO_FAILURE]: (state, { payload: error }) => {
            return { ...state, updateError: error };
        },
        [REMOVE_TODO]: (state) => {
            return { ...state, removeError: null };
        },
        [REMOVE_TODO_SUCCESS]: (state) => {
            return { ...state, removeError: false };
        },
        [REMOVE_TODO_FAILURE]: (state, { payload: error }) => {
            return { ...state, removeError: error };
        },
    },
    initialState
);
export default todo;
