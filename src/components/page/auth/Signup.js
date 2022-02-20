import React, { useReducer, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "modules/account";
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
    padding: 30px 20px;
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
const Warning = styled.div`
    font-size: 16px;
    font-family: "Noto Sans KR", sans-serif;
    letter-spacing: -1px;
    margin-top: 2px;
    color: ${(props) => props.color};
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
    passwordConfirm: "",
    email: "",
    nickname: "",
    usernameWarning: {
        content: "* 5 ~ 12자 영문 + 숫자",
        color: "#686868",
    },
    passwordWarning: {
        content: "* 8 ~ 16자 영문 + 숫자 + 기호",
        color: "#686868",
    },
    passwordConfirmWarning: {
        content: "",
        color: "#686868",
    },
    emailWarning: {
        content: "",
        color: "#686868",
    },
    nicknameWarning: {
        content: "* 2자 이상 8자 이하",
        color: "#686868",
    },
};
const reducer = (state, action) => {
    var newValue = action.target.value;
    var newWarning = {
        content: "",
        color: "",
    };
    switch (action.name) {
        case "username":
            var usernamePattern = /[^a-zA-Z0-9]/g;
            if (usernamePattern.test(newValue)) {
                newWarning.content = "* 영어와 숫자만 입력해 주세요.";
                newValue = newValue.replace(usernamePattern, "");
            } else {
                newWarning.content = "* 5 ~ 12자 영문 + 숫자";
            }
            newValue = newValue.substring(0, 12);
            if (newValue.length >= 5 && newValue.length <= 12) {
                newWarning.color = "#009112";
            } else if (newValue.length === 0) {
                newWarning.color = "#686868";
            } else {
                newWarning.color = "#ff3939";
            }
            break;
        case "password":
            var passwordPattern = /[ㄱ-ㅎㅏ-ㅣ가-힣]/g;
            if (passwordPattern.test(newValue)) {
                newWarning.content = "* 한/영 키를 확인해주세요.";
                newValue = newValue.replace(passwordPattern, "");
            } else {
                newWarning.content = "* 8 ~ 16자 영문 + 숫자 + 기호";
            }
            newValue = newValue.substring(0, 16);
            if (newValue.length >= 8 && newValue.length <= 16) {
                newWarning.color = "#009112";
            } else if (newValue.length === 0) {
                newWarning.color = "#686868";
            } else {
                newWarning.color = "#ff3939";
            }
            if (
                newValue === state.passwordConfirm &&
                state.passwordConfirm.length > 0
            ) {
                return {
                    ...state,
                    [action.name]: newValue,
                    [action.name + "Warning"]: newWarning,
                    passwordConfirmWarning: {
                        content: "* 비밀번호가 일치합니다.",
                        color: "#009112",
                    },
                };
            } else if (state.passwordConfirm.length > 0) {
                return {
                    ...state,
                    [action.name]: newValue,
                    [action.name + "Warning"]: newWarning,
                    passwordConfirmWarning: {
                        content: "* 비밀번호가 일치하지 않습니다.",
                        color: "#ff3939",
                    },
                };
            }
            break;
        case "passwordConfirm":
            var passwordConfirmPattern = /[ㄱ-ㅎㅏ-ㅣ가-힣]/g;
            newValue = newValue.replace(passwordConfirmPattern, "");
            newValue = newValue.substring(0, 16);
            if (newValue.length === 0) {
                newWarning.content = "";
                newWarning.color = "#686868";
            } else if (newValue === state.password) {
                newWarning.content = "* 비밀번호가 일치합니다.";
                newWarning.color = "#009112";
            } else {
                newWarning.content = "* 비밀번호가 일치하지 않습니다.";
                newWarning.color = "#ff3939";
            }
            break;
        case "email":
            var emailPattern = /[^a-zA-Z0-9@.]/g;
            if (emailPattern.test(newValue)) {
                newValue = newValue.replace(emailPattern, "");
            }
            newValue = newValue.substring(0, 45);
            var emailRegex =
                /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
            if (newValue.length === 0) {
                newWarning.content = "";
                newWarning.color = "#686868";
            } else if (emailRegex.test(newValue)) {
                newWarning.content = "* 올바른 이메일 형식입니다.";
                newWarning.color = "#009112";
            } else {
                newWarning.content = "* 올바른 이메일 형식이 아닙니다.";
                newWarning.color = "#ff3939";
            }
            break;
        case "nickname":
            newWarning.content = "* 2자 이상 8자 이하";
            newValue = newValue.substring(0, 8);
            if (newValue.length >= 2 && newValue.length <= 8) {
                newWarning.color = "#009112";
            } else if (newValue.length === 0) {
                newWarning.color = "#686868";
            } else {
                newWarning.color = "#ff3939";
            }
            break;
        default:
            break;
    }
    return {
        ...state,
        [action.name]: newValue,
        [action.name + "Warning"]: newWarning,
    };
};
const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [state, stateDispatch] = useReducer(reducer, initialState);
    const user = useSelector((state) => state.account.user);
    const loading = useSelector((state) => state.loading["account/REGISTER"]);
    const onSubmit = () => {
        if (state.usernameWarning.color !== "#009112") {
            alert("ID를 확인해 주세요.");
            return;
        } else if (state.passwordWarning.color !== "#009112") {
            alert("비밀번호를 확인해 주세요.");
            return;
        } else if (state.passwordConfirmWarning.color !== "#009112") {
            alert("비밀번호를 확인해 주세요.");
            return;
        } else if (state.emailWarning.color !== "#009112") {
            alert("이메일을 확인해 주세요.");
            return;
        } else if (state.nicknameWarning.color !== "#009112") {
            alert("닉네임을 확인해 주세요.");
            return;
        }
        dispatch(register(state));
    };
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
                <Warning color={state.usernameWarning.color}>
                    {state.usernameWarning.content}
                </Warning>
            </ContentWrapper>
            <ContentWrapper>
                <Title>Password</Title>
                <Form
                    onChange={(e) => stateDispatch({ ...e, name: "password" })}
                    type="password"
                    value={state.password}
                />
                <Warning color={state.passwordWarning.color}>
                    {state.passwordWarning.content}
                </Warning>
            </ContentWrapper>
            <ContentWrapper>
                <Title>Password Confirm</Title>
                <Form
                    onChange={(e) =>
                        stateDispatch({ ...e, name: "passwordConfirm" })
                    }
                    type="password"
                    value={state.passwordConfirm}
                />
                <Warning color={state.passwordConfirmWarning.color}>
                    {state.passwordConfirmWarning.content}
                </Warning>
            </ContentWrapper>
            <ContentWrapper>
                <Title>Email</Title>
                <Form
                    onChange={(e) => stateDispatch({ ...e, name: "email" })}
                    value={state.email}
                />
                <Warning color={state.emailWarning.color}>
                    {state.emailWarning.content}
                </Warning>
            </ContentWrapper>
            <ContentWrapper>
                <Title>Nickname</Title>
                <Form
                    onChange={(e) => stateDispatch({ ...e, name: "nickname" })}
                    value={state.nickname}
                />
                <Warning color={state.nicknameWarning.color}>
                    {state.nicknameWarning.content}
                </Warning>
            </ContentWrapper>
            {loading ? (
                <ConfirmButton>
                    <Loading r="40px" />
                </ConfirmButton>
            ) : (
                <ConfirmButton onClick={onSubmit}>Sign up</ConfirmButton>
            )}
        </Background>
    );
};

export default Signup;
