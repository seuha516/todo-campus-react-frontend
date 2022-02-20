import React, { useReducer, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "modules/account";
import styled from "styled-components";
import Loading from "components/etc/Loading";

const FlexCol = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;
const Background = styled(FlexCol)`
    width: 100%;
    max-width: 640px;
    height: 100%;
    min-height: calc(100vh - 45px);
    margin-left: max(calc(50% - 320px), 0px);
    padding: 45px 20px;
    justify-content: center;
`;
const ContentWrapper = styled.div`
    width: 100%;
    max-width: 360px;
    margin-bottom: 32px;
`;
const Title = styled.div`
    font-size: 24px;
    font-family: "Raleway", sans-serif;
    font-style: italic;
    margin-bottom: 7.5px;
`;
const Form = styled.input`
    width: 100%;
    border: 0;
    border-bottom: 2px solid grey;
    font-size: 24px;
    font-family: "Nanum Gothic", sans-serif;
`;
const ConfirmButton = styled.div`
    width: 120px;
    height: 40px;
    text-align: center;
    font-size: 30px;
    font-family: "Quicksand", sans-serif;
    margin-top: 40px;
    cursor: pointer;
    transition: all 0.15s linear;
    color: #5c5c5c;
    &:hover {
        color: black;
    }
`;

const initialState = {
    username: "",
    password: "",
};
const reducer = (state, action) => ({
    ...state,
    [action.name]: action.target.value,
});

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [state, stateDispatch] = useReducer(reducer, initialState);
    const user = useSelector((state) => state.account.user);
    const loading = useSelector((state) => state.loading["account/LOGIN"]);
    useEffect(() => {
        if (user) {
            navigate("/");
            try {
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        username: user.username,
                        token: user.token,
                    })
                );
            } catch (e) {
                console.log("localStorage is not working");
            }
        }
    }, [navigate, user]);

    return (
        <Background>
            <ContentWrapper>
                <Title>ID</Title>
                <Form
                    onChange={(e) => stateDispatch({ ...e, name: "username" })}
                    value={state.username}
                />
            </ContentWrapper>
            <ContentWrapper>
                <Title>Password</Title>
                <Form
                    onChange={(e) => stateDispatch({ ...e, name: "password" })}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            dispatch(login(state));
                        }
                    }}
                    type="password"
                    value={state.password}
                />
            </ContentWrapper>
            {loading ? (
                <ConfirmButton>
                    <Loading r="40px" />
                </ConfirmButton>
            ) : (
                <ConfirmButton
                    onClick={() => {
                        dispatch(login(state));
                    }}
                >
                    Log in
                </ConfirmButton>
            )}
        </Background>
    );
};

export default Login;
