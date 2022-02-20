import React from "react";
import styled from "styled-components";

import WeekTable from "./WeekTable";
import Calendar from "./Calendar";

const Background = styled.div`
    width: 100%;
    max-width: 1540px;
    height: 100%;
    min-height: calc(100vh - 45px);
    margin-left: max(calc(50% - 770px), 0px);
    padding: 20px 20px 30px 20px;
    display: grid;
    grid-template-columns: 1fr 30px 1fr;
    grid-template-rows: 842px;
    justify-content: center;
    align-items: center;
    @media all and (max-width: 1200px) {
        grid-template-columns: 1fr 20px 1fr;
    }
    @media all and (max-width: 1050px) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        max-width: 740px;
        margin-left: max(calc(50% - 370px), 0px);
        padding: 30px 20px 40px 20px;
    }
    @media all and (max-width: 450px) {
        padding: 30px 10px 40px 10px;
    }
    @media all and (max-width: 360px) {
        padding: 30px 2.5px 40px 2.5px;
    }
`;

const TimeTable = () => {
    return (
        <Background>
            <WeekTable />
            <Calendar />
        </Background>
    );
};

export default TimeTable;
