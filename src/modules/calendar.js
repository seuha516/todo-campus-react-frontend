import { createAction, handleActions } from "redux-actions";
import { takeLatest } from "redux-saga/effects";
import createRequestSaga, {
    createRequestActionTypes,
} from "lib/createRequestSaga";
import * as calendarAPI from "lib/api/calendar";

const INIT_GETLIST_CALENDAR_ERROR = "calendar/INIT_GETLIST_CALENDAR_ERROR";
const INIT_INSERT_CALENDAR_ERROR = "calendar/INIT_INSERT_CALENDAR_ERROR";
const INIT_UPDATE_CALENDAR_ERROR = "calendar/INIT_UPDATE_CALENDAR_ERROR";
const INIT_REMOVE_CALENDAR_ERROR = "calendar/INIT_REMOVE_CALENDAR_ERROR";
const [GETLIST_CALENDAR, GETLIST_CALENDAR_SUCCESS, GETLIST_CALENDAR_FAILURE] =
    createRequestActionTypes("calendar/GETLIST_CALENDAR");
const [INSERT_CALENDAR, INSERT_CALENDAR_SUCCESS, INSERT_CALENDAR_FAILURE] =
    createRequestActionTypes("calendar/INSERT_CALENDAR");
const [UPDATE_CALENDAR, UPDATE_CALENDAR_SUCCESS, UPDATE_CALENDAR_FAILURE] =
    createRequestActionTypes("calendar/UPDATE_CALENDAR");
const [REMOVE_CALENDAR, REMOVE_CALENDAR_SUCCESS, REMOVE_CALENDAR_FAILURE] =
    createRequestActionTypes("calendar/REMOVE_CALENDAR");

export const initGetListCalendarError = createAction(
    INIT_GETLIST_CALENDAR_ERROR
);
export const initInsertCalendarError = createAction(INIT_INSERT_CALENDAR_ERROR);
export const initUpdateCalendarError = createAction(INIT_UPDATE_CALENDAR_ERROR);
export const initRemoveCalendarError = createAction(INIT_REMOVE_CALENDAR_ERROR);
export const getListCalendar = createAction(
    GETLIST_CALENDAR,
    ({ username, year, month }) => ({
        username,
        year,
        month,
    })
);
export const insertCalendar = createAction(INSERT_CALENDAR, (data) => data);
export const updateCalendar = createAction(UPDATE_CALENDAR, (data) => data);
export const removeCalendar = createAction(REMOVE_CALENDAR, ({ num }) => ({
    num,
}));

//사가
const getListCalendarSaga = createRequestSaga(
    GETLIST_CALENDAR,
    calendarAPI.getList
);
const insertCalendarSaga = createRequestSaga(
    INSERT_CALENDAR,
    calendarAPI.insert
);
const updateCalendarSaga = createRequestSaga(
    UPDATE_CALENDAR,
    calendarAPI.update
);
const removeCalendarSaga = createRequestSaga(
    REMOVE_CALENDAR,
    calendarAPI.remove
);

export function* calendarSaga() {
    yield takeLatest(GETLIST_CALENDAR, getListCalendarSaga);
    yield takeLatest(INSERT_CALENDAR, insertCalendarSaga);
    yield takeLatest(UPDATE_CALENDAR, updateCalendarSaga);
    yield takeLatest(REMOVE_CALENDAR, removeCalendarSaga);
}

const initialState = {
    list: null,
    getListError: null,
    insertError: null,
    updateError: null,
    removeError: null,
};

const calendar = handleActions(
    {
        [INIT_GETLIST_CALENDAR_ERROR]: (state) => {
            return { ...state, getListError: null };
        },
        [INIT_INSERT_CALENDAR_ERROR]: (state) => {
            return { ...state, insertError: null };
        },
        [INIT_UPDATE_CALENDAR_ERROR]: (state) => {
            return { ...state, updateError: null };
        },
        [INIT_REMOVE_CALENDAR_ERROR]: (state) => {
            return { ...state, removeError: null };
        },
        [GETLIST_CALENDAR]: () => (state) => {
            return { ...state, list: null, getListError: null };
        },
        [GETLIST_CALENDAR_SUCCESS]: (state, { payload: result }) => {
            return { ...state, list: result.result, getListError: false };
        },
        [GETLIST_CALENDAR_FAILURE]: (state, { payload: error }) => {
            return { ...state, getListError: error };
        },
        [INSERT_CALENDAR]: (state) => {
            return { ...state, insertError: null };
        },
        [INSERT_CALENDAR_SUCCESS]: (state) => {
            return { ...state, insertError: false };
        },
        [INSERT_CALENDAR_FAILURE]: (state, { payload: error }) => {
            return { ...state, insertError: error };
        },
        [UPDATE_CALENDAR]: (state) => {
            return { ...state, updateError: null };
        },
        [UPDATE_CALENDAR_SUCCESS]: (state) => {
            return { ...state, updateError: false };
        },
        [UPDATE_CALENDAR_FAILURE]: (state, { payload: error }) => {
            return { ...state, updateError: error };
        },
        [REMOVE_CALENDAR]: (state) => {
            return { ...state, removeError: null };
        },
        [REMOVE_CALENDAR_SUCCESS]: (state) => {
            return { ...state, removeError: false };
        },
        [REMOVE_CALENDAR_FAILURE]: (state, { payload: error }) => {
            return { ...state, removeError: error };
        },
    },
    initialState
);
export default calendar;
