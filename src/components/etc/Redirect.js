import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Loading from "./Loading";

const Background = styled.div`
    width: 100%;
    height: calc(100vh - 45px);
`;

const Redirect = () => {
    const navigate = useNavigate();
    const [state, setState] = useState(false);
    useEffect(() => {
        setTimeout(() => setState(true), 200);
    }, []);
    useEffect(() => {
        if (state) navigate("/");
    }, [navigate, state]);
    return (
        <Background>
            <Loading r="100px" />
        </Background>
    );
};

export default Redirect;
