import React from "react";
import styled from "styled-components";

const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;
const FlexCol = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;
const Wrapper = styled(FlexCol)`
    background-color: #373737;
    width: 100%;
    max-width: 1540px;
    margin-left: max(calc(50% - 770px), 0px);
    height: 100px;
    padding: 0 20px;
    justify-content: center;
    -ms-user-select: none;
    -moz-user-select: -moz-none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    user-select: none;
    @media all and (max-width: 720px) {
        padding: 10px;
    }
    @media all and (max-width: 400px) {
        padding: 3px;
    }
`;
const TextWrapper = styled(FlexRow)`
    width: 100%;
    color: #a7a7a7;
    margin: 5px 0;
`;

const Footer = () => {
    return (
        <Wrapper>
            <TextWrapper>
                TodoCampus By Jeon SeungHa (seuha516@naver.com)
            </TextWrapper>
            <TextWrapper>1.0.0</TextWrapper>
        </Wrapper>
    );
};

export default Footer;
