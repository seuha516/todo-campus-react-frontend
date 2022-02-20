import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;
const FlexCol = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const Background = styled(FlexCol)`
    width: 100%;
    max-width: 1540px;
    height: 100%;
    min-height: calc(100vh - 45px);
    margin-left: max(calc(50% - 770px), 0px);
    justify-content: flex-start;
    -ms-user-select: none;
    -moz-user-select: -moz-none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    user-select: none;
    overflow-x: hidden;
`;
const FirstBannerWrapper = styled(FlexRow)`
    width: 100%;
    height: 550px;
    padding-top: 80px;
    background-color: #f3f3f3;
    @media all and (max-width: 630px) {
        height: 720px;
        padding-top: 0;
    }
`;
const FirstBanner = styled(FlexCol)`
    width: 100%;
    max-width: 750px;
    height: 100%;
    position: relative;
`;
const ImageWrapper1 = styled.img`
    position: absolute;
    top: 80px;
    left: calc(100% - 320px);
    width: 200px;
    height: auto;
    transform: skew(-10deg, 0);
    box-shadow: 5px 5px 7px black;
    z-index: 6;
    border-radius: 7.5px;
    @media all and (max-width: 630px) {
        top: 350px;
        left: calc(50% - 138px);
    }
`;
const ImageWrapper2 = styled.img`
    position: absolute;
    top: 30px;
    left: calc(100% - 250px);
    width: 200px;
    height: auto;
    transform: skew(-8deg, 0);
    box-shadow: 5px 5px 10px black;
    z-index: 5;
    border-radius: 7.5px;
    @media all and (max-width: 630px) {
        top: 300px;
        left: calc(50% - 78px);
    }
`;
const ImageWrapper3 = styled.img`
    position: absolute;
    top: 240px;
    left: calc(100% - 240px);
    width: 200px;
    height: auto;
    transform: skew(-6deg, 0);
    box-shadow: 3px 3px 7px black;
    z-index: 7;
    border-radius: 7.5px;
    @media all and (max-width: 630px) {
        top: 510px;
        left: calc(50% - 48px);
    }
`;
const TextWrapper1 = styled(FlexCol)`
    position: absolute;
    top: 100px;
    left: 60px;
    align-items: flex-start;
    @media all and (max-width: 765px) {
        left: calc(35% - 200px);
    }
    @media all and (max-width: 630px) {
        left: calc(50% - 128px);
        margin-top: -30px;
        margin-left: -5px;
    }
`;
const Text1 = styled.div`
    font-size: 40px;
    font-family: "Nanum Pen Script", cursive;
    margin-bottom: 12px;
`;
const Text2 = styled.div`
    font-size: 90px;
    font-family: "Staatliches", cursive;
    margin: 0 0 0 40px;
`;
const Text3 = styled.div`
    font-size: 60px;
    font-family: "Staatliches", cursive;
    margin: -20px 0 0 90px;
`;
const Text4 = styled(Link)`
    font-size: 70px;
    font-family: "Caveat", cursive;
    font-weight: 700;
    margin: 400px 0 0 0;
    cursor: pointer;
    color: #737373;
    transition: all 0.2s linear;
    &:hover {
        color: black;
    }
    &:hover + #Text5 {
        background-color: black;
    }
    &:hover ~ #Blocker1 {
        margin-left: 220px;
        width: 0px;
    }
    @media all and (max-width: 630px) {
        margin: 640px 0 0 0;
    }
`;
const Text5 = styled.div`
    width: 220px;
    height: 6px;
    margin-top: 10px;
    background-color: #737373;
    transition: all 0.2s linear;
`;
const Blocker1 = styled.div`
    width: 240px;
    height: 10px;
    background-color: #f3f3f3;
    margin-top: -6px;
    z-index: 1;
    transition: all 0.2s linear;
`;
const SecondBannerWrapper = styled(FlexRow)`
    width: 100%;
    height: 630px;
    padding-top: 30px;
    background-color: #f8f8f8;
    position: relative;
    @media all and (max-width: 630px) {
        height: 870px;
    }
    @media all and (max-width: 400px) {
        height: 850px;
    }
`;
const ImageWrapper4 = styled.img`
    position: absolute;
    top: 85px;
    left: 480px;
    width: 200px;
    height: auto;
    box-shadow: 5px 5px 7px #4c4c4c;
    transform: skew(-3deg, 0);
    z-index: 7;
    border-radius: 7.5px;
    @media all and (max-width: 1500px) {
        left: calc(47% - 200px);
    }
    @media all and (max-width: 630px) {
        left: calc(50% - 55px);
    }
`;
const ImageWrapper5 = styled.img`
    position: absolute;
    top: 100px;
    left: 180px;
    width: 200px;
    height: auto;
    box-shadow: 5px 5px 7px #4c4c4c;
    transform: skew(-3deg, 0);
    z-index: 5;
    border-radius: 7.5px;
    @media all and (max-width: 1500px) {
        left: calc(20.7% - 116px);
    }
    @media all and (max-width: 630px) {
        left: calc(50% - 135px);
    }
`;
const ImageWrapper6 = styled.img`
    position: absolute;
    top: 70px;
    left: 330px;
    width: 200px;
    height: auto;
    box-shadow: 5px 5px 7px #4c4c4c;
    transform: skew(-3deg, 0);
    z-index: 6;
    border-radius: 7.5px;
    @media all and (max-width: 1500px) {
        left: calc(35% - 165px);
    }
    @media all and (max-width: 630px) {
        left: calc(50% - 95px);
    }
`;
const TextWrapper2 = styled(FlexCol)`
    position: absolute;
    top: 180px;
    left: calc(50% + 120px);
    align-items: flex-start;
    font-size: 25px;
    @media all and (max-width: 1500px) {
        top: 183px;
        left: calc(66.7% - 95px);
        font-size: 22.5px;
        letter-spacing: -0.5px;
    }
    @media all and (max-width: 1160px) {
        top: 187.5px;
        left: calc(72.7% - 148px);
        font-size: 20px;
        letter-spacing: -1px;
    }
    @media all and (max-width: 840px) {
        top: 195px;
        left: calc(82% - 185px);
        font-size: 18px;
        letter-spacing: -1.5px;
    }
    @media all and (max-width: 630px) {
        left: calc(50% - 174px);
        top: 570px;
        letter-spacing: 0px;
        font-size: 21px;
    }
    @media all and (max-width: 400px) {
        left: calc(50% - 128px);
        top: 570px;
        letter-spacing: -1.5px;
        font-size: 17px;
    }
`;
const Text6 = styled.div`
    font-family: "Nanum Gothic", sans-serif;
    margin-top: 35px;
`;

const Home = () => {
    return (
        <Background>
            <FirstBannerWrapper>
                <FirstBanner>
                    <ImageWrapper1
                        src="/images/example_weektable.png"
                        alt="error"
                    />
                    <ImageWrapper2
                        src="/images/example_calendar.png"
                        alt="error"
                    />
                    <ImageWrapper3 src="/images/example_memo.png" alt="error" />
                    <TextWrapper1>
                        <Text1>대학 생활을 편리하게</Text1>
                        <Text2>Todo</Text2>
                        <Text3>Campus</Text3>
                    </TextWrapper1>
                </FirstBanner>
            </FirstBannerWrapper>
            <SecondBannerWrapper>
                <ImageWrapper4 src="/images/mobile_weektable.png" alt="error" />
                <ImageWrapper5 src="/images/mobile_todo.png" alt="error" />
                <ImageWrapper6 src="/images/mobile_memo.png" alt="error" />
                <TextWrapper2>
                    <Text6>😄 시간표와 일정표로 스케줄 완벽 관리</Text6>
                    <Text6>📢 할 일은 체크리스트로 꼼꼼하게</Text6>
                    <Text6>📝 중요한 부분은 메모!</Text6>
                    <Text6>💬 정보를 나누고 소통하는 게시판</Text6>
                </TextWrapper2>
            </SecondBannerWrapper>
        </Background>
    );
};

export default Home;
