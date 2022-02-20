import React from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "components/page/main/Home";
import Login from "components/page/auth/Login";
import Signup from "components/page/auth/Signup";
import TimeTable from "components/page/timetable/TimeTable";
import Todo from "components/page/todo/Todo";
import Memo from "components/page/memo/Memo";
import Community from "components/page/community/Community";
import Introduction from "components/page/main/Introduction";
import Redirect from "components/etc/Redirect";

const FirstPage = () => {
    const user = useSelector((state) => state.account.user);
    if (user) {
        return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/timetable" element={<TimeTable />} />
                <Route path="/todo" element={<Todo />} />
                <Route path="/memo" element={<Memo />} />
                <Route path="/community/*" element={<Community />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Redirect />} />
            </Routes>
        );
    } else {
        return (
            <Routes>
                <Route path="/" element={<Introduction />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Redirect />} />
            </Routes>
        );
    }
};

export default FirstPage;
