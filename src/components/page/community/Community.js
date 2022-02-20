import React from "react";
import { Route, Routes } from "react-router-dom";
import styled from "styled-components";
import List from "./List";
import Read from "./Read";
import Update from "./Update";
import Write from "./Write";

const Background = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 45px);
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Community = () => {
    return (
        <Background>
            <Routes>
                <Route path="/" element={<List />} />
                <Route path="/write" element={<Write />} />
                <Route path="/read/:num" element={<Read />} />
                <Route path="/update/:num" element={<Update />} />
            </Routes>
        </Background>
    );
};

export default Community;
