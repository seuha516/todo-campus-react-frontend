import { combineReducers } from "redux";
import { all } from "redux-saga/effects";

import loading from "modules/loading";
import account, { accountSaga } from "modules/account";
import weektable, { weektableSaga } from "modules/weektable";
import calendar, { calendarSaga } from "modules/calendar";
import post, { postSaga } from "modules/post";
import memo, { memoSaga } from "modules/memo";
import todo, { todoSaga } from "modules/todo";

const rootReducer = combineReducers({
    loading,
    account,
    weektable,
    calendar,
    post,
    memo,
    todo,
});

export function* rootSaga() {
    yield all([
        accountSaga(),
        weektableSaga(),
        calendarSaga(),
        postSaga(),
        memoSaga(),
        todoSaga(),
    ]);
}

export default rootReducer;
