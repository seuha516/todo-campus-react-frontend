import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";

import rootReducer, { rootSaga } from "modules";
import { login } from "modules/account";
import "index.scss";

import Header from "components/etc/Header";
import Footer from "components/etc/Footer";
import FirstPage from "components/page/main/FirstPage";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware))
);
function loadUser() {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;
        store.dispatch(login(user));
    } catch (e) {
        console.log("localStorage is not working.", e);
    }
}
sagaMiddleware.run(rootSaga);
loadUser();
document.getElementById("root").setAttribute("spellcheck", "false");

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Header />
            <FirstPage />
            <Footer />
        </BrowserRouter>
    </Provider>,
    document.getElementById("root")
);
