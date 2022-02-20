import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "modules/account";

import { IoMdNotificationsOutline } from "react-icons/io";
import { BiTable } from "react-icons/bi";
import { BsStickies } from "react-icons/bs";
import { AiOutlineCheckSquare } from "react-icons/ai";
import { GoMortarBoard } from "react-icons/go";

const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;
const FlexCol = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;
const Wrapper = styled(FlexRow)`
    position: fixed;
    z-index: 10;
    top: 0px;
    left: 0px;
    padding: 0 20px;
    width: 100%;
    max-width: 1540px;
    height: 45px;
    background-color: white;
    margin-left: max(calc(50% - 770px), 0px);
    -ms-user-select: none;
    -moz-user-select: -moz-none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    user-select: none;
    box-shadow: 1px 1px 2px black;
    @media all and (max-width: 720px) {
        padding: 10px;
    }
    @media all and (max-width: 400px) {
        padding: 3px;
    }
`;
const TitleWrapper = styled(FlexRow)`
    width: 184px;
    height: 100%;
`;
const LoginTitleWrapper = styled(FlexRow)`
    width: 184px;
    height: 100%;
    @media all and (max-width: 720px) {
        width: 45px;
        div {
            display: none;
        }
    }
`;
const TitleIcon = styled.img`
    width: 45px;
    height: 45px;
`;
const TitleText = styled.div`
    margin: 0 0 0 3px;
    height: 30px;
    font-size: 37.5px;
    font-family: "Dongle", sans-serif;
`;
const CategoryWrapper = styled(FlexRow)`
    width: 100%;
    max-width: 620px;
    height: 100%;
    padding: 3px 30px 0 30px;
    font-size: 40px;
    font-family: "Dongle", sans-serif;
    word-break: keep-all;
    @media all and (max-width: 480px) {
        display: none;
    }
`;
const CategoryItem = styled(Link)`
    transition: all 0.2s linear;
    &:hover {
        text-shadow: 1px 1px 1px #aaaaaa;
    }
`;
const ShortCategoryWrapper = styled(FlexRow)`
    width: 100%;
    max-width: 600px;
    height: 100%;
    padding: 3px 30px 0 30px;
    font-size: 40px;
    font-family: "Dongle", sans-serif;
    word-break: keep-all;
    display: none;
    @media all and (max-width: 480px) {
        display: flex;
    }
    @media all and (max-width: 370px) {
        padding: 3px 15px 0 15px;
    }
    @media all and (max-width: 320px) {
        padding: 3px 8px 0 8px;
    }
    svg {
        transition: all 0.2s linear;
        &:hover {
            color: green;
        }
    }
`;
const UserWrapper = styled(FlexRow)`
    justify-content: center;
    height: 100%;
`;
const UserNoticeIcon = styled(IoMdNotificationsOutline)`
    width: 24px;
    height: 24px;
    margin: 0 5px 0 0;
    cursor: pointer;
    transition: all 0.2s linear;
    color: ${(props) => (props.p === 1 ? "green" : "black")};
    &:hover {
        color: ${(props) => (props.p === 1 ? "black" : "green")};
    }
`;
const UserInfo = styled.div`
    font-size: 20px;
    white-space: nowrap;
    letter-spacing: -0.5px;
    @media all and (max-width: 560px) {
        display: none;
    }
    cursor: pointer;
    transition: all 0.2s linear;
    color: ${(props) => (props.p === 2 ? "green" : "black")};
    &:hover {
        color: ${(props) => (props.p === 2 ? "black" : "green")};
    }
`;
const ShortUserInfo = styled.div`
    font-size: 20px;
    white-space: nowrap;
    letter-spacing: -0.5px;
    display: none;
    @media all and (max-width: 560px) {
        display: block;
    }
    cursor: pointer;
    transition: all 0.2s linear;
    color: ${(props) => (props.p === 2 ? "green" : "black")};
    &:hover {
        color: ${(props) => (props.p === 2 ? "black" : "green")};
    }
`;
const FakeHeader = styled.div`
    width: 100%;
    height: 45px;
`;
const FakeLeft = styled.div`
    width: 60px;
    height: 47px;
    position: fixed;
    z-index: 11;
    top: 0px;
    left: max(calc(50% - 830px), -60px);
    background-color: white;
`;
const FakeRight = styled.div`
    width: 60px;
    height: 47px;
    position: fixed;
    z-index: 11;
    top: 0px;
    left: min(calc(50% + 770px), 100%);
    background-color: white;
`;
const NoticePopUpWrapper = styled(FlexCol)`
    position: fixed;
    top: 50px;
    left: min(calc(100% - 203px), calc(50% + 570px));
    background-color: #e3e3e3;
    width: 200px;
    height: 250px;
    border: 2px solid #a1a1a1;
    border-radius: 20px;
    justify-content: center;
    z-index: 10;
`;
const AccountPopUpWrapper = styled(FlexCol)`
    position: fixed;
    top: 50px;
    left: min(calc(100% - 203px), calc(50% + 570px));
    background-color: #e3e3e3;
    width: 200px;
    height: 100px;
    border: 2px solid #a1a1a1;
    border-radius: 20px;
    justify-content: center;
    padding: 10px 15px;
    z-index: 10;
`;
const AccountPopUpUsername = styled.div`
    width: 100%;
    font-size: 18px;
    margin-bottom: 10px;
    font-weight: 700;
`;
const AccountPopUpNickname = styled.div`
    width: 100%;
    font-size: 15px;
    margin-bottom: 5px;
`;
const AccountPopUpLogout = styled.div`
    width: 100%;
    font-size: 22px;
    text-align: right;
    cursor: pointer;
    transition: all 0.1s linear;
    &:hover {
        color: #ff4444;
    }
`;

const Header = () => {
    const user = useSelector((state) => state.account.user);
    const [popUp, setPopUp] = useState(0);
    const dispatch = useDispatch();
    const location = useLocation();
    useEffect(() => {
        setPopUp(0);
    }, [location]);

    if (user) {
        return (
            <>
                <Wrapper>
                    <Link to="/" style={{ height: "45px" }}>
                        <LoginTitleWrapper>
                            <TitleIcon src="/images/titleIcon.png" />
                            <TitleText>TodoCampus</TitleText>
                        </LoginTitleWrapper>
                    </Link>
                    <CategoryWrapper>
                        <CategoryItem
                            to="/timetable"
                            style={{ marginTop: "1px" }}
                        >
                            시간표
                        </CategoryItem>
                        <CategoryItem to="/todo" style={{ marginTop: "-5px" }}>
                            할일
                        </CategoryItem>
                        <CategoryItem to="/memo" style={{ marginTop: "5px" }}>
                            메모
                        </CategoryItem>
                        <CategoryItem
                            to="/community"
                            style={{ marginTop: "3px" }}
                        >
                            게시판
                        </CategoryItem>
                    </CategoryWrapper>
                    <ShortCategoryWrapper>
                        <Link to="/timetable">
                            <BiTable
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    marginTop: "15px",
                                }}
                            />
                        </Link>
                        <Link to="/todo">
                            <AiOutlineCheckSquare
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    marginTop: "15px",
                                }}
                            />
                        </Link>
                        <Link to="/memo">
                            <BsStickies
                                style={{
                                    width: "24px",
                                    height: "24px",
                                    marginTop: "15px",
                                }}
                            />
                        </Link>
                        <Link to="/community">
                            <GoMortarBoard
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    marginTop: "15px",
                                }}
                            />
                        </Link>
                    </ShortCategoryWrapper>
                    <UserWrapper>
                        {/* <UserNoticeIcon
                            p={popUp}
                            onClick={() => setPopUp(popUp === 1 ? 0 : 1)}
                        /> */}
                        <UserInfo
                            p={popUp}
                            onClick={() => setPopUp(popUp === 2 ? 0 : 2)}
                        >
                            {user.nickname}
                        </UserInfo>
                        <ShortUserInfo
                            p={popUp}
                            onClick={() => setPopUp(popUp === 2 ? 0 : 2)}
                        >
                            {user.nickname.substring(0, 3) +
                                (user.nickname.length > 3 ? ".." : "")}
                        </ShortUserInfo>
                    </UserWrapper>
                </Wrapper>
                <FakeHeader />
                <FakeLeft />
                <FakeRight />
                {/* {popUp === 1 && (
                    <NoticePopUpWrapper>
                        알림이 없습니다. (미구현)
                    </NoticePopUpWrapper>
                )} */}
                {popUp === 2 && (
                    <AccountPopUpWrapper>
                        <AccountPopUpUsername>
                            {user.username}
                        </AccountPopUpUsername>
                        <AccountPopUpNickname>
                            {user.nickname}
                        </AccountPopUpNickname>
                        <AccountPopUpLogout
                            onClick={() => {
                                if (window.confirm("로그아웃 하시겠습니까?")) {
                                    dispatch(logout());
                                }
                            }}
                        >
                            Logout
                        </AccountPopUpLogout>
                    </AccountPopUpWrapper>
                )}
            </>
        );
    } else {
        return (
            <>
                <Wrapper>
                    <Link to="/" style={{ height: "45px" }}>
                        <TitleWrapper>
                            <TitleIcon src="/images/titleIcon.png" />
                            <TitleText>TodoCampus</TitleText>
                        </TitleWrapper>
                    </Link>
                    <UserWrapper>
                        <Link to="/login">
                            <UserInfo style={{ display: "block" }}>
                                Login
                            </UserInfo>
                        </Link>
                    </UserWrapper>
                </Wrapper>
                <FakeHeader />
                <FakeLeft />
                <FakeRight />
            </>
        );
    }
};
export default Header;
