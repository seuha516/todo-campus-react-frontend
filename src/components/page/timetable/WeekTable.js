import React, { useEffect, useReducer, useState } from "react";
import styled, { css } from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import {
    AiOutlineClose,
    AiOutlineEdit,
    AiFillDelete,
    AiOutlineDelete,
    AiOutlinePlus,
    AiOutlineDownload,
    AiOutlineBook,
} from "react-icons/ai";
import { BsPlusSquareDotted } from "react-icons/bs";
import {
    getListWeekTable,
    insertWeekTable,
    updateWeekTable,
    removeWeekTable,
    initInsertWeekTableError,
    initGetListWeekTableError,
    initUpdateWeekTableError,
    initRemoveWeekTableError,
} from "modules/weektable";
import Loading from "components/etc/Loading";

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
    grid-row: 1 / 4;
    grid-column: 1 / 2;
    width: 100%;
    height: 100%;
    -ms-user-select: none;
    -moz-user-select: -moz-none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    user-select: none;
`;

const WeekTableWrapper = styled.div`
    width: 100%;
    max-width: 640px;
    height: 785px;
    display: grid;
    grid-template-columns: 40px calc(100% - 40px);
    grid-template-rows: 40px calc(100% - 40px);
    @media all and (max-width: 420px) {
        grid-template-columns: 30px calc(100% - 30px);
    }
`;
const TopLine = styled(FlexRow)`
    grid-row: 1 / 2;
    grid-column: 2 / 3;
`;
const TopLineItem = styled(FlexRow)`
    width: 20%;
    height: 100%;
    justify-content: center;
    font-size: 20px;
    font-family: "Montserrat", sans-serif;
`;
const LeftLine = styled(FlexCol)`
    grid-row: 2 / 3;
    grid-column: 1 / 2;
    margin-top: ${(props) => props.t};
    padding-bottom: ${(props) => props.b};
`;
const LeftLineItem = styled(FlexRow)`
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: 600;
    font-family: "Montserrat", sans-serif;
    width: 100%;
    height: ${(props) => props.h};
`;
const Table = styled(FlexRow)`
    position: relative;
    grid-row: 2 / 3;
    grid-column: 2 / 3;
`;
const CellLine = styled.div`
    width: ${(props) => props.w};
    height: 100%;
`;
const Cell = styled.div`
    width: 100%;
    height: ${(props) => props.h};
    ${(props) =>
        props.number > 0
            ? css`
                  border-top: solid 1px #a7a7a7;
              `
            : css`
                  border-top: solid 1px #e5e5e5;
              `}
`;
const Course = styled(FlexCol)`
    width: ${(props) => props.w};
    height: ${(props) => props.h};
    position: absolute;
    top: ${(props) => props.t};
    left: ${(props) => props.l};
    background-color: ${(props) => props.color};
    color: white;
    font-family: "Nanum Gothic", sans-serif;
    overflow: hidden;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    transition: all 0.1s linear;
    &:hover {
        background-color: ${(props) => props.color + "bb"};
    }
`;
const CourseName = styled(FlexRow)`
    margin-bottom: 5px;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    max-height: ${(props) => props.maxH};
    min-height: ${(props) => props.maxH / 2};
    line-height: ${(props) => props.maxH / 2};
    font-size: ${(props) => props.fontSize};
    font-weight: bold;
    overflow: hidden;
    word-break: break-all;
`;
const CourseLocation = styled(FlexRow)`
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    max-height: ${(props) => props.maxH};
    height: ${(props) => props.maxH};
    line-height: ${(props) => props.maxH};
    font-size: ${(props) => props.fontSize};
    word-break: break-all;
    overflow: hidden;
`;
const Menu = styled(FlexRow)`
    width: 100%;
    max-width: 588px;
    height: 57px;
    justify-content: space-between;
`;
const AddButton = styled(AiOutlinePlus)`
    width: 30px;
    height: 30px;
    margin-left: 10px;
    color: #646464;
    cursor: pointer;
    transition: all 0.1s linear;
    &:hover {
        color: black;
    }
`;
// const DownloadButton = styled(AiOutlineDownload)`
//     width: 30px;
//     height: 30px;
//     margin-left: 10px;
//     color: #646464;
//     cursor: pointer;
//     transition: all 0.1s linear;
//     &:hover {
//         color: black;
//     }
// `;
const InfoIcon = styled(AiOutlineBook)`
    width: 25px;
    height: 25px;
    margin-right: 5px;
`;
const InfoText = styled.div`
    font-family: "Noto Sans KR", sans-serif;
    font-size: 16px;
    margin-right: 10px;
`;

const WeekTable = () => {
    const { username, ready, error } = useSelector(
        ({ account, weektable }) => ({
            username: account.user.username,
            ready: weektable.list,
            error: weektable.getListError,
        })
    );
    const dispatch = useDispatch();
    const [popUp, setPopUp] = useState({ num: 0 });
    useEffect(() => {
        dispatch(getListWeekTable({ username }));
        return () => {
            dispatch(initGetListWeekTableError());
        };
    }, [dispatch, username]);

    if (ready) {
        const { list, daysInWeek, minTime, maxTime, courseCount, totalCredit } =
            ready;
        const weekCategory = [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
        ].slice(0, daysInWeek);
        const timeCategory = new Array(2 * (maxTime - minTime))
            .fill(0)
            .map((i, idx) => {
                if (idx % 2 === 0) {
                    return minTime + idx / 2;
                } else {
                    return -1;
                }
            });
        return (
            <Wrapper>
                <WeekTableWrapper>
                    <TopLine>
                        {weekCategory.map((i) => (
                            <TopLineItem key={i}>{i}</TopLineItem>
                        ))}
                    </TopLine>
                    <Table>
                        {weekCategory.map((i) => (
                            <CellLine
                                key={i}
                                w={`${100 / weekCategory.length}%`}
                            >
                                {timeCategory.map((j, idx) => (
                                    <Cell
                                        key={idx}
                                        h={`${745 / timeCategory.length}px`}
                                        number={j}
                                    ></Cell>
                                ))}
                            </CellLine>
                        ))}
                        {list.map((i) => {
                            return i.time.map((j, idx) => (
                                <Course
                                    key={i.name + "_" + idx}
                                    w={`${100 / weekCategory.length + 0.1}%`}
                                    h={`${
                                        (745 * j.time) /
                                            (timeCategory.length * 30) +
                                        1
                                    }px`}
                                    t={`${
                                        ((j.start - minTime * 60) * 745) /
                                        (timeCategory.length * 30)
                                    }px`}
                                    l={`${
                                        (100 *
                                            weekCategory.indexOf(j.whatDay)) /
                                        weekCategory.length
                                    }%`}
                                    color={i.color}
                                    onClick={() =>
                                        setPopUp({ num: 2, info: i })
                                    }
                                >
                                    <CourseName
                                        fontSize={`${
                                            100 / weekCategory.length
                                        }px`}
                                        maxH={`${200 / weekCategory.length}px`}
                                    >
                                        {i.name}
                                    </CourseName>
                                    <CourseLocation
                                        fontSize={`${
                                            75 / weekCategory.length
                                        }px`}
                                        maxH={`${80 / weekCategory.length}px`}
                                    >
                                        {j.location}
                                    </CourseLocation>
                                </Course>
                            ));
                        })}
                    </Table>
                    <LeftLine
                        t={`-${372.5 / timeCategory.length}px`}
                        b={`${372.5 / timeCategory.length}px`}
                    >
                        {timeCategory.map((i, idx) => (
                            <LeftLineItem
                                key={idx}
                                h={`${745 / timeCategory.length}px`}
                            >
                                {i > 0 ? i : ""}
                            </LeftLineItem>
                        ))}
                    </LeftLine>
                </WeekTableWrapper>
                <Menu>
                    <FlexRow>
                        <AddButton onClick={() => setPopUp({ num: 1 })} />
                        {/* <DownloadButton onClick={() => alert('미구현')} /> */}
                    </FlexRow>
                    <FlexRow>
                        <InfoIcon />
                        <InfoText>{`강의 ${courseCount} 개`}</InfoText>
                        <InfoText>{`/`}</InfoText>
                        <InfoText>{`총 ${totalCredit} 학점`}</InfoText>
                    </FlexRow>
                </Menu>
                {popUp.num === 1 && (
                    <InsertCoursePopUp popUp={popUp} setPopUp={setPopUp} />
                )}
                {popUp.num === 2 && (
                    <ReadCoursePopUp popUp={popUp} setPopUp={setPopUp} />
                )}
                {popUp.num === 3 && (
                    <UpdateCoursePopUp popUp={popUp} setPopUp={setPopUp} />
                )}
            </Wrapper>
        );
    } else if (error) {
        return <Wrapper style={{ justifyContent: "center" }}>Error</Wrapper>;
    } else {
        return (
            <Wrapper style={{ height: "842px" }}>
                <Loading r="100px" />
            </Wrapper>
        );
    }
};

const PopUpBackground = styled.div`
    z-index: 20;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000000bb;
`;
const PopUpWrapper = styled(FlexCol)`
    z-index: 30;
    position: fixed;
    top: max(calc(50% - 350px), 20px);
    left: max(calc(50% - 300px), 15px);
    background-color: white;
    border-radius: 15px;
    width: calc(100% - 30px);
    max-width: 600px;
    height: 700px;
    box-shadow: 10px 10px 20px black;
    justify-content: flex-start;
    padding: 50px 15px;
    @media all and (max-height: 740px) {
        top: max(calc(calc(50% - 50vh) + 20px), 20px);
        height: calc(100vh - 40px);
        overflow-y: auto;
        &::-webkit-scrollbar {
            width: 10px;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #2f3542;
            border-radius: 10px;
            background-clip: padding-box;
            border: 2px solid transparent;
        }
        &::-webkit-scrollbar-track {
            background-color: grey;
            border-radius: 10px;
            box-shadow: inset 0px 0px 5px white;
        }
    }
`;
const PopUpReadWrapper = styled(FlexCol)`
    z-index: 30;
    position: fixed;
    top: max(calc(50% - 297.5px), 20px);
    left: max(calc(50% - 300px), 15px);
    background-color: white;
    border-radius: 15px;
    width: calc(100% - 30px);
    max-width: 600px;
    height: 595px;
    box-shadow: 10px 10px 20px black;
    justify-content: flex-start;
    padding: 50px 15px 20px 15px;
    -ms-user-select: text;
    -moz-user-select: -moz-text;
    -webkit-user-select: text;
    -khtml-user-select: text;
    user-select: text;
    @media all and (max-height: 635px) {
        top: max(calc(calc(50% - 50vh) + 20px), 20px);
        height: calc(100vh - 40px);
        overflow-y: auto;
        &::-webkit-scrollbar {
            width: 10px;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #2f3542;
            border-radius: 10px;
            background-clip: padding-box;
            border: 2px solid transparent;
        }
        &::-webkit-scrollbar-track {
            background-color: grey;
            border-radius: 10px;
            box-shadow: inset 0px 0px 5px white;
        }
    }
`;
const PopUpTitle = styled.div`
    font-size: 45px;
    max-width: 80%;
    overflow: hidden;
    word-break: break-all;
    line-height: 50px;
    max-height: 60px;
    font-family: "Hahmlet", serif;
    margin-bottom: 50px;
    padding-bottom: 10px;
`;
const ContentWrapper = styled(FlexRow)`
    width: 100%;
    max-width: 450px;
    justify-content: flex-start;
    margin-bottom: 30px;
    flex-wrap: wrap;
`;
const Title = styled.div`
    margin-right: 15px;
    font-size: 18px;
    font-family: "Nanum Gothic", sans-serif;
`;
const Form = styled.input`
    border: 0;
    border-bottom: 1px solid grey;
    font-size: 16px;
    font-family: "Nanum Gothic", sans-serif;
    box-shadow: none !important;
    padding: 0 2px;
    &:focus {
        outline: none;
    }
`;
const ColorBox = styled.div`
    margin-left: 15px;
    width: 30px;
    height: 30px;
    background-color: ${(props) => props.color};
    color: white;
    padding: 7px;
    font-weight: 700;
    text-align: center;
    font-family: "Nanum Gothic", sans-serif;
`;
const PaletteWrapper = styled(FlexRow)`
    margin-left: 51px;
    width: calc(100% - 51px);
    max-width: 399px;
    justify-content: flex-start;
    margin-top: -20px;
    margin-bottom: 15px;
    min-height: 60px;
    max-height: 60px;
    overflow: hidden;
    flex-wrap: wrap;
`;
const ColorBall = styled.div`
    margin: 0 8.2px 5px 0;
    width: 25px;
    height: 25px;
    border-radius: 25px;
    background-color: ${(props) => props.color};
    cursor: pointer;
    transition: all 0.1s ease-in-out;
    &:hover {
        width: 27px;
        height: 27px;
        margin: 0 7.2px 5px -1px;
    }
`;
const ShortForm1 = styled.select`
    border: 0;
    border-bottom: 1px solid grey;
    font-size: 16px;
    font-family: "Nanum Gothic", sans-serif;
    width: 60px;
    margin-right: 15px;
    @media all and (max-width: 420px) {
        width: 70px;
        margin-right: 15px;
        margin-bottom: 5px;
    }
`;
const ShortForm2 = styled(Form)`
    width: 28.25px;
    margin-right: 15px;
    text-align: center;
    padding: 0;
    @media all and (max-width: 420px) {
        width: calc(50% - 70.25px);
        margin-right: 0px;
        margin-bottom: 5px;
    }
    ::placeholder {
        font-size: 13px;
        letter-spacing: -1.5px;
        text-align: center;
    }
`;
const ShortForm3 = styled(Form)`
    width: 44px;
    text-align: center;
    padding: 0;
    @media all and (max-width: 420px) {
        margin-left: 51px;
        width: calc(50% - 56.5px);
        margin-bottom: 7.5px;
    }
`;
const ShortForm4 = styled(Form)`
    width: calc(100% - 276px);
    @media all and (max-width: 420px) {
        width: calc(50% - 25.5px);
        margin-bottom: 7.5px;
    }
`;
const AddTimeButton = styled(BsPlusSquareDotted)`
    width: 36px;
    height: 24px;
    cursor: pointer;
`;
const DeleteTimeButton = styled(AiOutlineDelete)`
    width: 24px;
    height: 24px;
    padding: 2px;
    margin-left: 9.84px;
    margin-right: 15px;
    color: grey;
    cursor: pointer;
    &:hover {
        color: #ff576c;
    }
`;
const TimeWrapper = styled.div`
    width: 100%;
    max-width: 450px;
    height: 160px;
    overflow-x: hidden;
    overflow-y: auto;
    min-height: 160px;
    &::-webkit-scrollbar {
        width: 10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #2f3542;
        border-radius: 10px;
        background-clip: padding-box;
        border: 2px solid transparent;
    }
    &::-webkit-scrollbar-track {
        background-color: grey;
        border-radius: 10px;
        box-shadow: inset 0px 0px 5px white;
    }
`;
const ConfirmButton = styled.div`
    width: 120px;
    height: 40px;
    text-align: center;
    font-size: 30px;
    font-family: "Quicksand", sans-serif;
    margin-top: 35px;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
    &:hover {
        font-size: 32px;
    }
`;
const ClosePopUpButtonWrapper = styled.div`
    width: 100%;
    height: 35px;
    margin-top: -35px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;
const ClosePopUpButton = styled(AiOutlineClose)`
    width: 30px;
    height: 30px;
    cursor: pointer;
`;
const ReadForm = styled.div`
    font-size: 16px;
    font-family: "Nanum Gothic", sans-serif;
    box-shadow: none !important;
    padding: 0 2px;
    overflow: hidden;
    word-break: break-all;
    line-height: 16px;
    max-height: 16px;
`;
const ReadEtcForm = styled(FlexRow)`
    font-size: 16px;
    line-height: 16px;
    font-family: "Nanum Gothic", sans-serif;
    box-shadow: none !important;
    padding: 0 2px;
    height: 90px;
    align-items: flex-start;
    max-height: 90px;
    overflow-x: hidden;
    overflow-y: auto;
    word-break: break-all;
    margin-bottom: -3px;
    &::-webkit-scrollbar {
        width: 10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #2f3542;
        border-radius: 10px;
        background-clip: padding-box;
        border: 2px solid transparent;
    }
    &::-webkit-scrollbar-track {
        background-color: grey;
        border-radius: 10px;
        box-shadow: inset 0px 0px 5px white;
    }
`;
const ReadForm1 = styled.div`
    width: 40px;
    font-size: 16px;
    font-family: "Nanum Gothic", sans-serif;
    box-shadow: none !important;
    padding: 0 2px;
    @media all and (max-width: 400px) {
        text-align: right;
        width: calc(50% - 65.5px);
        margin-right: 7px;
    }
`;
const ReadForm2 = styled.div`
    width: 120px;
    font-size: 16px;
    font-family: "Nanum Gothic", sans-serif;
    box-shadow: none !important;
    padding: 0 2px;
    @media all and (max-width: 400px) {
        text-align: left;
        width: calc(50% + 7.5px);
    }
`;
const ReadForm3 = styled.div`
    width: calc(100% - 211px);
    max-width: calc(100% - 211px);
    overflow: hidden;
    word-break: break-all;
    line-height: 16px;
    max-height: 16px;
    font-size: 16px;
    text-align: center;
    font-family: "Nanum Gothic", sans-serif;
    box-shadow: none !important;
    padding: 0 2px;
    @media all and (max-width: 400px) {
        width: calc(100% - 51px);
        max-width: calc(100% - 51px);
        margin-left: 51px;
        margin-top: 7.5px;
    }
`;
const EditPopUpButtonWrapper = styled.div`
    width: 100%;
    height: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 50px;
`;
const EditPopUpButton = styled(AiOutlineEdit)`
    width: 30px;
    height: 30px;
    cursor: pointer;
    transition: all 0.1s linear;
    &:hover {
        color: #00ba37;
    }
`;
const DeletePopUpButton = styled(AiFillDelete)`
    width: 30px;
    height: 30px;
    cursor: pointer;
    transition: all 0.1s linear;
    &:hover {
        color: #ff576c;
    }
`;

const addZero = (x) => (x < 10 ? `0${x}` : `${x}`);
const initialState = {
    name: "",
    color: "#000000",
    etc: "",
    credit: "",
    professor: "",
    time: [],
};
const reducer = (state, action) => {
    var newValue = action.target.value;
    switch (action.name) {
        case "name":
            newValue = newValue.substring(0, 30);
            break;
        case "professor":
            newValue = newValue.substring(0, 20);
            break;
        case "credit":
            newValue = newValue.substring(0, 2);
            if (!isNaN(newValue)) {
                newValue = parseInt(newValue);
            }
            if (newValue < 0) {
                newValue = 0;
            }
            break;
        case "etc":
            newValue = newValue.substring(0, 255);
            break;
        case "color":
            var colorPattern = /[^0-9#A-Fa-f]/g;
            newValue = newValue.replace(colorPattern, "");
            newValue = newValue.substring(0, 7);
            if (newValue === "") newValue = "#";
            break;
        default:
            break;
    }
    return { ...state, [action.name]: newValue };
};
const InsertCoursePopUp = ({ popUp, setPopUp }) => {
    const { username, loading, error } = useSelector(
        ({ account, loading, weektable }) => ({
            username: account.user.username,
            loading: loading["weektable/INSERT_WEEKTABLE"],
            error: weektable.insertError,
        })
    );
    const dispatch = useDispatch();
    const [state, stateDispatch] = useReducer(reducer, initialState);
    const [timeState, setTimeState] = useState([
        {
            whatDay: "Mon",
            startHour: "",
            startMinute: "",
            time: "",
            location: "",
        },
    ]);
    useEffect(() => {
        dispatch(initInsertWeekTableError());
        return () => {
            dispatch(initInsertWeekTableError());
        };
    }, [dispatch]);
    useEffect(() => {
        if (error) {
            alert(error.response.data.message);
        } else if (error === false) {
            dispatch(getListWeekTable({ username }));
            setPopUp({ num: 0 });
        }
    }, [dispatch, setPopUp, error, username]);
    const onSubmit = () => {
        var submitValue = {
            username: username,
            name: state.name,
            color: state.color,
            etc: state.etc,
            credit: state.credit,
            professor: state.professor,
            time: [],
        };
        var submitTime = [];
        for (var i = 0; i < timeState.length; i++) {
            var h = parseInt(timeState[i].startHour);
            var m = parseInt(timeState[i].startMinute);
            var t = parseInt(timeState[i].time);
            if (!Number.isInteger(h) || h < 0 || h >= 24) {
                alert("시간이 잘못되었습니다.");
                return;
            } else if (!Number.isInteger(m) || m < 0 || m >= 60) {
                alert("시간이 잘못되었습니다.");
                return;
            } else if (!Number.isInteger(t) || t <= 0 || t >= 24 * 60) {
                alert("시간이 잘못되었습니다.");
                return;
            } else if (h * 60 + m + t >= 24 * 60) {
                alert("시간은 자정을 포함할 수 없습니다.");
                return;
            }
            submitTime.push({
                whatDay: timeState[i].whatDay,
                start: h * 60 + m,
                time: t,
                location: timeState[i].location,
            });
        }
        for (i = 0; i < timeState.length; i++) {
            for (var j = i + 1; j < timeState.length; j++) {
                if (submitTime[i].whatDay === submitTime[j].whatDay) {
                    if (
                        submitTime[i].start <= submitTime[j].start &&
                        submitTime[j].start <
                            submitTime[i].start + submitTime[i].time
                    ) {
                        alert("강의 시간이 서로 겹칩니다.");
                        return;
                    } else if (
                        submitTime[j].start <= submitTime[i].start &&
                        submitTime[i].start <
                            submitTime[j].start + submitTime[j].time
                    ) {
                        alert("강의 시간이 서로 겹칩니다.");
                        return;
                    }
                }
            }
        }
        submitValue.time = submitTime;
        dispatch(insertWeekTable(submitValue));
    };
    return (
        <>
            <PopUpBackground
                onClick={() => {
                    if (
                        JSON.stringify(initialState) === JSON.stringify(state)
                    ) {
                        setPopUp({ num: 0 });
                    } else {
                        if (window.confirm("취소하시겠습니까?")) {
                            setPopUp({ num: 0 });
                        }
                    }
                }}
            />
            <PopUpWrapper>
                <ClosePopUpButtonWrapper>
                    <ClosePopUpButton
                        onClick={() => {
                            if (
                                JSON.stringify(initialState) ===
                                JSON.stringify(state)
                            ) {
                                setPopUp({ num: 0 });
                            } else {
                                if (window.confirm("취소하시겠습니까?")) {
                                    setPopUp({ num: 0 });
                                }
                            }
                        }}
                    />
                </ClosePopUpButtonWrapper>
                <PopUpTitle>강의 추가</PopUpTitle>
                <ContentWrapper>
                    <Title>강의명</Title>
                    <Form
                        style={{ width: "calc(100% - 69px)" }}
                        onChange={(e) => stateDispatch({ ...e, name: "name" })}
                        value={state.name}
                    />
                </ContentWrapper>
                <ContentWrapper>
                    <Title style={{ marginRight: "15px" }}>교수명</Title>
                    <Form
                        style={{ width: "calc(100% - 175px)" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "professor" })
                        }
                        value={state.professor}
                    />
                    <Title style={{ marginLeft: "15px", marginRight: "10px" }}>
                        학점
                    </Title>
                    <Form
                        style={{ width: "45px" }}
                        type="number"
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "credit" })
                        }
                        value={isNaN(state.credit) ? "" : state.credit}
                    />
                </ContentWrapper>
                <ContentWrapper>
                    <Title>비고</Title>
                    <Form
                        style={{ width: "calc(100% - 51px)" }}
                        onChange={(e) => stateDispatch({ ...e, name: "etc" })}
                        value={state.etc}
                    />
                </ContentWrapper>
                <ContentWrapper>
                    <Title>색상</Title>
                    <Form
                        style={{ width: "calc(100% - 96px)" }}
                        onChange={(e) => stateDispatch({ ...e, name: "color" })}
                        value={state.color}
                    />
                    <ColorBox color={state.color}>A</ColorBox>
                </ContentWrapper>
                <PaletteWrapper>
                    {[
                        "#EA364C",
                        "#EA328D",
                        "#EA8436",
                        "#23C520",
                        "#2052C5",
                        "#6720C5",
                        "#4C4C4E",
                        "#4595EC",
                        "#ACB114",
                        "#A08D75",
                        "#18669E",
                        "#9E3618",
                    ].map((i) => (
                        <ColorBall
                            key={i}
                            color={i}
                            onClick={() =>
                                stateDispatch({
                                    name: "color",
                                    target: { value: i },
                                })
                            }
                        />
                    ))}
                </PaletteWrapper>
                <TimeWrapper>
                    {timeState.map((i, idx) => (
                        <ContentWrapper
                            key={idx}
                            style={{ flexWrap: "wrap", marginBottom: "5px" }}
                        >
                            {idx === 0 ? (
                                <Title>시간</Title>
                            ) : (
                                <DeleteTimeButton
                                    onClick={() => {
                                        setTimeState(
                                            timeState.filter((j, jdx) =>
                                                jdx !== idx ? true : false
                                            )
                                        );
                                    }}
                                />
                            )}
                            <ShortForm1
                                key={timeState[idx].whatDay}
                                defaultValue={timeState[idx].whatDay}
                                onChange={(e) =>
                                    setTimeState(
                                        timeState.map((j, jdx) =>
                                            jdx === idx
                                                ? {
                                                      ...j,
                                                      whatDay: e.target.value,
                                                  }
                                                : j
                                        )
                                    )
                                }
                            >
                                {[
                                    "Mon",
                                    "Tue",
                                    "Wed",
                                    "Thu",
                                    "Fri",
                                    "Sat",
                                    "Sun",
                                ].map((i) => (
                                    <option key={i} value={i}>
                                        {i}
                                    </option>
                                ))}
                            </ShortForm1>
                            <ShortForm2
                                style={{ marginRight: "0px" }}
                                placeholder="시작"
                                onChange={(e) =>
                                    setTimeState(
                                        timeState.map((j, jdx) =>
                                            jdx === idx
                                                ? {
                                                      ...j,
                                                      startHour:
                                                          e.target.value.substring(
                                                              0,
                                                              2
                                                          ),
                                                  }
                                                : j
                                        )
                                    )
                                }
                                value={timeState[idx].startHour}
                            />
                            <div>:</div>
                            <ShortForm2
                                placeholder="시간"
                                onChange={(e) =>
                                    setTimeState(
                                        timeState.map((j, jdx) =>
                                            jdx === idx
                                                ? {
                                                      ...j,
                                                      startMinute:
                                                          e.target.value.substring(
                                                              0,
                                                              2
                                                          ),
                                                  }
                                                : j
                                        )
                                    )
                                }
                                value={timeState[idx].startMinute}
                            />
                            <ShortForm3
                                placeholder="길이"
                                onChange={(e) =>
                                    setTimeState(
                                        timeState.map((j, jdx) =>
                                            jdx === idx
                                                ? {
                                                      ...j,
                                                      time: e.target.value.substring(
                                                          0,
                                                          4
                                                      ),
                                                  }
                                                : j
                                        )
                                    )
                                }
                                value={timeState[idx].time}
                            />
                            <div style={{ marginRight: "15px" }}>분</div>
                            <ShortForm4
                                placeholder="장소"
                                onChange={(e) =>
                                    setTimeState(
                                        timeState.map((j, jdx) =>
                                            jdx === idx
                                                ? {
                                                      ...j,
                                                      location:
                                                          e.target.value.substring(
                                                              0,
                                                              30
                                                          ),
                                                  }
                                                : j
                                        )
                                    )
                                }
                                value={timeState[idx].location}
                            />
                        </ContentWrapper>
                    ))}
                    <ContentWrapper style={{ marginBottom: "0px" }}>
                        <AddTimeButton
                            onClick={() =>
                                setTimeState(
                                    timeState.concat({
                                        whatDay: "Mon",
                                        startHour: "",
                                        startMinute: "",
                                        time: "",
                                        location: "",
                                    })
                                )
                            }
                        />
                    </ContentWrapper>
                </TimeWrapper>
                {loading ? (
                    <ConfirmButton>
                        <Loading r="40px" />
                    </ConfirmButton>
                ) : (
                    <ConfirmButton onClick={onSubmit}>Confirm</ConfirmButton>
                )}
            </PopUpWrapper>
        </>
    );
};
const UpdateCoursePopUp = ({ popUp, setPopUp }) => {
    const { username, updateLoading, removeLoading, updateError, removeError } =
        useSelector(({ account, loading, weektable }) => ({
            username: account.user.username,
            updateLoading: loading["weektable/UPDATE_WEEKTABLE"],
            updateError: weektable.updateError,
            removeLoading: loading["weektable/REMOVE_WEEKTABLE"],
            removeError: weektable.removeError,
        }));
    const dispatch = useDispatch();
    const [state, stateDispatch] = useReducer(reducer, popUp.info);
    const [timeState, setTimeState] = useState(
        popUp.info.time.map((i) => ({
            ...i,
            startHour: addZero(Math.floor(i.start / 60)),
            startMinute: addZero(i.start % 60),
        }))
    );
    useEffect(() => {
        dispatch(initUpdateWeekTableError());
        dispatch(initRemoveWeekTableError());
        return () => {
            dispatch(initUpdateWeekTableError());
            dispatch(initRemoveWeekTableError());
        };
    }, [dispatch]);
    useEffect(() => {
        if (updateError) {
            alert(updateError.response.data.message);
        } else if (updateError === false) {
            dispatch(getListWeekTable({ username }));
            setPopUp({ num: 0 });
        } else if (removeError) {
            alert(removeError.response.data.message);
        } else if (removeError === false) {
            dispatch(getListWeekTable({ username }));
            setPopUp({ num: 0 });
        }
        dispatch(initUpdateWeekTableError());
        dispatch(initRemoveWeekTableError());
    }, [dispatch, setPopUp, updateError, removeError, username]);
    const onSubmit = () => {
        var submitValue = {
            num: state.num,
            username: username,
            name: state.name,
            color: state.color,
            etc: state.etc,
            credit: state.credit,
            professor: state.professor,
            time: [],
        };
        var submitTime = [];
        for (var i = 0; i < timeState.length; i++) {
            var h = parseInt(timeState[i].startHour);
            var m = parseInt(timeState[i].startMinute);
            var t = parseInt(timeState[i].time);
            if (!Number.isInteger(h) || h < 0 || h >= 24) {
                alert("시간이 잘못되었습니다.");
                return;
            } else if (!Number.isInteger(m) || m < 0 || m >= 60) {
                alert("시간이 잘못되었습니다.");
                return;
            } else if (!Number.isInteger(t) || t <= 0 || t >= 24 * 60) {
                alert("시간이 잘못되었습니다.");
                return;
            } else if (h * 60 + m + t >= 24 * 60) {
                alert("시간은 자정을 포함할 수 없습니다.");
                return;
            }
            submitTime.push({
                whatDay: timeState[i].whatDay,
                start: h * 60 + m,
                time: t,
                location: timeState[i].location,
            });
        }
        for (i = 0; i < timeState.length; i++) {
            for (var j = i + 1; j < timeState.length; j++) {
                if (submitTime[i].whatDay === submitTime[j].whatDay) {
                    if (
                        submitTime[i].start <= submitTime[j].start &&
                        submitTime[j].start <
                            submitTime[i].start + submitTime[i].time
                    ) {
                        alert("강의 시간이 서로 겹칩니다.");
                        return;
                    } else if (
                        submitTime[j].start <= submitTime[i].start &&
                        submitTime[i].start <
                            submitTime[j].start + submitTime[j].time
                    ) {
                        alert("강의 시간이 서로 겹칩니다.");
                        return;
                    }
                }
            }
        }
        submitValue.time = submitTime;
        dispatch(updateWeekTable(submitValue));
    };
    return (
        <>
            <PopUpBackground
                onClick={() => {
                    if (
                        JSON.stringify(popUp.info) === JSON.stringify(state) &&
                        JSON.stringify(timeState) ===
                            JSON.stringify(
                                popUp.info.time.map((i) => ({
                                    ...i,
                                    startHour: Math.floor(i.start / 60),
                                    startMinute: i.start % 60,
                                }))
                            )
                    ) {
                        setPopUp({ num: 0 });
                    } else {
                        if (window.confirm("취소하시겠습니까?")) {
                            setPopUp({ num: 0 });
                        }
                    }
                }}
            />
            <PopUpWrapper style={{ paddingBottom: "20px" }}>
                <ClosePopUpButtonWrapper>
                    <ClosePopUpButton
                        onClick={() => {
                            if (
                                JSON.stringify(popUp.info) ===
                                    JSON.stringify(state) &&
                                JSON.stringify(timeState) ===
                                    JSON.stringify(
                                        popUp.info.time.map((i) => ({
                                            ...i,
                                            startHour: Math.floor(i.start / 60),
                                            startMinute: i.start % 60,
                                        }))
                                    )
                            ) {
                                setPopUp({ num: 0 });
                            } else {
                                if (window.confirm("취소하시겠습니까?")) {
                                    setPopUp({ num: 0 });
                                }
                            }
                        }}
                    />
                </ClosePopUpButtonWrapper>
                <PopUpTitle>강의 수정</PopUpTitle>
                <ContentWrapper>
                    <Title>강의명</Title>
                    <Form
                        style={{ width: "calc(100% - 69px)" }}
                        onChange={(e) => stateDispatch({ ...e, name: "name" })}
                        value={state.name}
                    />
                </ContentWrapper>
                <ContentWrapper>
                    <Title style={{ marginRight: "15px" }}>교수명</Title>
                    <Form
                        style={{ width: "calc(100% - 175px)" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "professor" })
                        }
                        value={state.professor}
                    />
                    <Title style={{ marginLeft: "15px", marginRight: "10px" }}>
                        학점
                    </Title>
                    <Form
                        style={{ width: "45px" }}
                        type="number"
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "credit" })
                        }
                        value={isNaN(state.credit) ? "" : state.credit}
                    />
                </ContentWrapper>
                <ContentWrapper>
                    <Title>비고</Title>
                    <Form
                        style={{ width: "calc(100% - 51px)" }}
                        onChange={(e) => stateDispatch({ ...e, name: "etc" })}
                        value={state.etc}
                    />
                </ContentWrapper>
                <ContentWrapper>
                    <Title>색상</Title>
                    <Form
                        style={{ width: "calc(100% - 96px)" }}
                        onChange={(e) => stateDispatch({ ...e, name: "color" })}
                        value={state.color}
                    />
                    <ColorBox color={state.color}>A</ColorBox>
                </ContentWrapper>
                <PaletteWrapper>
                    {[
                        "#EA364C",
                        "#EA328D",
                        "#EA8436",
                        "#23C520",
                        "#2052C5",
                        "#6720C5",
                        "#4C4C4E",
                        "#4595EC",
                        "#ACB114",
                        "#A08D75",
                        "#18669E",
                        "#9E3618",
                    ].map((i) => (
                        <ColorBall
                            key={i}
                            color={i}
                            onClick={() =>
                                stateDispatch({
                                    name: "color",
                                    target: { value: i },
                                })
                            }
                        />
                    ))}
                </PaletteWrapper>
                <TimeWrapper>
                    {timeState.map((i, idx) => (
                        <ContentWrapper
                            key={idx}
                            style={{ flexWrap: "wrap", marginBottom: "5px" }}
                        >
                            {idx === 0 ? (
                                <Title>시간</Title>
                            ) : (
                                <DeleteTimeButton
                                    onClick={() => {
                                        setTimeState(
                                            timeState.filter((j, jdx) =>
                                                jdx !== idx ? true : false
                                            )
                                        );
                                    }}
                                />
                            )}
                            <ShortForm1
                                key={timeState[idx].whatDay}
                                defaultValue={timeState[idx].whatDay}
                                onChange={(e) =>
                                    setTimeState(
                                        timeState.map((j, jdx) =>
                                            jdx === idx
                                                ? {
                                                      ...j,
                                                      whatDay: e.target.value,
                                                  }
                                                : j
                                        )
                                    )
                                }
                            >
                                {[
                                    "Mon",
                                    "Tue",
                                    "Wed",
                                    "Thu",
                                    "Fri",
                                    "Sat",
                                    "Sun",
                                ].map((i) => (
                                    <option key={i} value={i}>
                                        {i}
                                    </option>
                                ))}
                            </ShortForm1>
                            <ShortForm2
                                style={{ marginRight: "0px" }}
                                placeholder="시작"
                                onChange={(e) =>
                                    setTimeState(
                                        timeState.map((j, jdx) =>
                                            jdx === idx
                                                ? {
                                                      ...j,
                                                      startHour:
                                                          e.target.value.substring(
                                                              0,
                                                              2
                                                          ),
                                                  }
                                                : j
                                        )
                                    )
                                }
                                value={timeState[idx].startHour}
                            />
                            <div>:</div>
                            <ShortForm2
                                placeholder="시간"
                                onChange={(e) =>
                                    setTimeState(
                                        timeState.map((j, jdx) =>
                                            jdx === idx
                                                ? {
                                                      ...j,
                                                      startMinute:
                                                          e.target.value.substring(
                                                              0,
                                                              2
                                                          ),
                                                  }
                                                : j
                                        )
                                    )
                                }
                                value={timeState[idx].startMinute}
                            />
                            <ShortForm3
                                placeholder="길이"
                                onChange={(e) =>
                                    setTimeState(
                                        timeState.map((j, jdx) =>
                                            jdx === idx
                                                ? {
                                                      ...j,
                                                      time: e.target.value.substring(
                                                          0,
                                                          4
                                                      ),
                                                  }
                                                : j
                                        )
                                    )
                                }
                                value={timeState[idx].time}
                            />
                            <div style={{ marginRight: "15px" }}>분</div>
                            <ShortForm4
                                placeholder="장소"
                                onChange={(e) =>
                                    setTimeState(
                                        timeState.map((j, jdx) =>
                                            jdx === idx
                                                ? {
                                                      ...j,
                                                      location:
                                                          e.target.value.substring(
                                                              0,
                                                              30
                                                          ),
                                                  }
                                                : j
                                        )
                                    )
                                }
                                value={timeState[idx].location}
                            />
                        </ContentWrapper>
                    ))}
                    <ContentWrapper style={{ marginBottom: "0px" }}>
                        <AddTimeButton
                            onClick={() =>
                                setTimeState(
                                    timeState.concat({
                                        whatDay: "Mon",
                                        startHour: "",
                                        startMinute: "",
                                        time: "",
                                        location: "",
                                    })
                                )
                            }
                        />
                    </ContentWrapper>
                </TimeWrapper>
                {updateLoading || removeLoading ? (
                    <ConfirmButton>
                        <Loading r="40px" />
                    </ConfirmButton>
                ) : (
                    <>
                        <ConfirmButton onClick={onSubmit}>
                            Confirm
                        </ConfirmButton>
                        <EditPopUpButtonWrapper style={{ marginTop: "0px" }}>
                            <DeletePopUpButton
                                onClick={() => {
                                    if (
                                        window.confirm("정말 삭제하시겠습니까?")
                                    ) {
                                        dispatch(
                                            removeWeekTable({
                                                num: popUp.info.num,
                                            })
                                        );
                                    }
                                }}
                            />
                        </EditPopUpButtonWrapper>
                    </>
                )}
            </PopUpWrapper>
        </>
    );
};
const ReadCoursePopUp = ({ popUp, setPopUp }) => {
    const { username, loading, error } = useSelector(
        ({ account, loading, weektable }) => ({
            username: account.user.username,
            loading: loading["weektable/REMOVE_WEEKTABLE"],
            error: weektable.removeError,
        })
    );
    const dispatch = useDispatch();
    const state = popUp.info;
    const timeState = popUp.info.time.map((i) => ({
        ...i,
        startHour: Math.floor(i.start / 60),
        startMinute: i.start % 60,
    }));
    useEffect(() => {
        dispatch(initRemoveWeekTableError());
        return () => {
            dispatch(initRemoveWeekTableError());
        };
    }, [dispatch]);
    useEffect(() => {
        if (error) {
            alert(error.response.data.message);
        } else if (error === false) {
            dispatch(getListWeekTable({ username }));
            setPopUp({ num: 0 });
        }
    }, [dispatch, setPopUp, error, username]);
    return (
        <>
            <PopUpBackground
                onClick={() => {
                    setPopUp({ num: 0 });
                }}
            />
            <PopUpReadWrapper
                style={{ border: `4px solid ${state.color + "cc"}` }}
            >
                <ClosePopUpButtonWrapper>
                    <ClosePopUpButton
                        onClick={() => {
                            setPopUp({ num: 0 });
                        }}
                    />
                </ClosePopUpButtonWrapper>
                <PopUpTitle
                    style={{
                        borderBottom: `3px solid ${state.color + "cc"}`,
                        paddingBottom: "15px",
                    }}
                >
                    {state.name}
                </PopUpTitle>
                <ContentWrapper>
                    <Title style={{ marginRight: "15px" }}>교수명</Title>
                    <ReadForm
                        style={{
                            width: "calc(100% - 175px)",
                            maxWidth: 'width: "calc(100% - 175px)"',
                        }}
                    >
                        {state.professor === "" ? "(없음)" : state.professor}
                    </ReadForm>
                    <Title style={{ marginLeft: "15px", marginRight: "10px" }}>
                        학점
                    </Title>
                    <ReadForm style={{ width: "45px" }}>
                        {state.credit}
                    </ReadForm>
                </ContentWrapper>
                <ContentWrapper>
                    <Title
                        style={{
                            height: "100%",
                            display: "flex",
                        }}
                    >
                        비고
                    </Title>
                    <ReadEtcForm style={{ width: "calc(100% - 51px)" }}>
                        {state.etc === "" ? "(없음)" : state.etc}
                    </ReadEtcForm>
                </ContentWrapper>
                <TimeWrapper>
                    {timeState.map((i, idx) => (
                        <ContentWrapper
                            key={idx}
                            style={{ marginBottom: "20px" }}
                        >
                            {idx === 0 ? (
                                <Title>시간</Title>
                            ) : (
                                <div style={{ width: "48.84px" }} />
                            )}
                            <ReadForm1>{i.whatDay}</ReadForm1>
                            <ReadForm2>{`${
                                i.startHour < 10
                                    ? `0${i.startHour}`
                                    : `${i.startHour}`
                            }:${
                                i.startMinute < 10
                                    ? `0${i.startMinute}`
                                    : `${i.startMinute}`
                            } ~ 
              ${
                  i.startHour + Math.floor((i.startMinute + i.time) / 60) < 10
                      ? `0${
                            i.startHour +
                            Math.floor((i.startMinute + i.time) / 60)
                        }`
                      : `${
                            i.startHour +
                            Math.floor((i.startMinute + i.time) / 60)
                        }`
              }:${
                                (i.startMinute + i.time) % 60 < 10
                                    ? `0${(i.startMinute + i.time) % 60}`
                                    : `${(i.startMinute + i.time) % 60}`
                            }`}</ReadForm2>
                            <ReadForm3>{i.location}</ReadForm3>
                        </ContentWrapper>
                    ))}
                </TimeWrapper>
                {loading ? (
                    <EditPopUpButtonWrapper>
                        <Loading r="30px" />
                    </EditPopUpButtonWrapper>
                ) : (
                    <EditPopUpButtonWrapper>
                        <DeletePopUpButton
                            onClick={() => {
                                if (window.confirm("정말 삭제하시겠습니까?")) {
                                    dispatch(
                                        removeWeekTable({ num: popUp.info.num })
                                    );
                                }
                            }}
                        />
                        <EditPopUpButton
                            onClick={() => {
                                setPopUp({ ...popUp, num: 3 });
                            }}
                        />
                    </EditPopUpButtonWrapper>
                )}
            </PopUpReadWrapper>
        </>
    );
};

export default WeekTable;
