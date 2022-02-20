import React, { useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
    getListCalendar,
    initGetListCalendarError,
    initInsertCalendarError,
    initRemoveCalendarError,
    initUpdateCalendarError,
    insertCalendar,
    removeCalendar,
    updateCalendar,
} from "modules/calendar";
import Loading from "components/etc/Loading";
import {
    AiOutlineClose,
    AiOutlineEdit,
    AiFillDelete,
    AiOutlineRollback,
    AiOutlinePlus,
    AiOutlineLeft,
    AiOutlineRight,
    AiTwotoneCalendar,
} from "react-icons/ai";
import { BsPlusSquareDotted } from "react-icons/bs";

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
    grid-row: 1 / 2;
    grid-column: 3 / 4;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    -ms-user-select: none;
    -moz-user-select: -moz-none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    user-select: none;
    @media all and (max-width: 1050px) {
        border-top: 2px solid grey;
        margin-top: 40px;
        padding-top: 40px;
        height: 882px;
        margin-bottom: 45px;
    }
`;
const ControlPanel = styled(FlexRow)`
    justify-content: center;
    width: 100%;
    max-width: 640px;
    height: 35px;
`;
const AddButton = styled(AiOutlinePlus)`
    width: 25px;
    height: 25px;
    margin-left: calc(50% - 110px);
    color: #646464;
    cursor: pointer;
    transition: all 0.1s linear;
    &:hover {
        color: black;
    }
`;
const LeftButton = styled(AiOutlineLeft)`
    width: 25px;
    height: 25px;
    margin-left: calc(50% - 85px);
    cursor: pointer;
`;
const RightButton = styled(AiOutlineRight)`
    width: 25px;
    height: 25px;
    cursor: pointer;
`;
const Now = styled.div`
    width: 120px;
    font-family: "Supermercado One", cursive;
    font-size: 32px;
    text-align: center;
`;
const CalendarTable = styled.div`
    width: 100%;
    max-width: 640px;
    height: 100%;
`;
const TopLineItem = styled(FlexRow)`
    width: 14.285714%;
    height: 40px;
    justify-content: center;
    font-size: 20px;
    font-family: "Montserrat", sans-serif;
    border-bottom: 1px solid black;
    padding-top: 6px;
    color: ${(props) => props.color};
    font-family: "Dongle", sans-serif;
    font-size: 36px;
`;
const Cell = styled(FlexCol)`
    width: 100%;
    height: 100%;
    border-left: 1px solid grey;
    justify-content: flex-start;
`;
const DateBlock = styled(FlexRow)`
    width: 100%;
    font-size: 18px;
    font-family: "Nanum Gothic", sans-serif;
    margin: 0 0 2px 3.5px;
    color: ${(props) => props.color};
`;
const ScheduleBlock = styled(FlexRow)`
    width: 100%;
    height: 17px;
    font-size: 14px;
    padding: 2px 0;
    font-family: "Nanum Gothic", sans-serif;
    color: white;
    justify-content: center;
    align-items: flex-start;
    background-color: ${(props) => props.color};
    overflow: hidden;
    margin-top: 1px;
    cursor: pointer;
    transition: all 0.1s linear;
    word-break: break-all;
    &:hover {
        box-shadow: 2px 2px 4px ${(props) => props.color};
    }
`;
const MoreScheduleBlock = styled(FlexRow)`
    width: 100%;
    height: 17px;
    font-size: 14px;
    padding: 1px 3px 1px 0;
    font-family: "Nanum Gothic", sans-serif;
    color: black;
    justify-content: flex-end;
    align-items: flex-start;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.15s linear;
    &:hover {
        background-color: lightgrey;
    }
`;

const weekCategory = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const daysOfYear = (y) =>
    y % 400 === 0 ? 366 : y % 100 === 0 ? 365 : y % 4 === 0 ? 366 : 365;
const daysOfMonth = (y, m) =>
    m === 2
        ? daysOfYear(y) - 337
        : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
const dateToNumber = (y, m, d) => {
    var result = 0;
    for (var i = 1; i < y; i++) result += daysOfYear(i);
    for (i = 1; i < m; i++) result += daysOfMonth(y, i);
    return result + d;
};
const NumberToDate = (n) => {
    var y, m;
    for (var i = 1; ; i++) {
        if (n > daysOfYear(i)) {
            n -= daysOfYear(i);
        } else {
            y = i;
            break;
        }
    }
    for (i = 1; ; i++) {
        if (n > daysOfMonth(y, i)) {
            n -= daysOfMonth(y, i);
        } else {
            m = i;
            break;
        }
    }
    return { year: y, month: m, day: n };
};
const makeCalendarBase = (y, m) => {
    var result = [];
    var st = dateToNumber(y, m, 1);
    var mid = (42 - daysOfMonth(y, m)) / 2;
    if (Math.abs(mid - (st % 7)) < Math.abs(mid - (st % 7) - 7)) {
        st -= st % 7;
    } else {
        st -= (st % 7) + 7;
    }
    for (var i = 0; i < 42; i++) {
        result.push(NumberToDate(st + i));
    }
    return result;
};
const addZero = (x) => (x < 10 ? `0${x}` : `${x}`);

const Calendar = () => {
    const { username, list, error } = useSelector(({ account, calendar }) => ({
        username: account.user.username,
        list: calendar.list,
        error: calendar.getListError,
    }));
    const dispatch = useDispatch();
    const [popUp, setPopUp] = useState({ num: 0 });
    const [now, setNow] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    });
    const CalendarInfo = makeCalendarBase(now.year, now.month);
    useEffect(() => {
        dispatch(
            getListCalendar({ username, year: now.year, month: now.month })
        );
        return () => {
            dispatch(initGetListCalendarError());
        };
    }, [dispatch, username, now]);

    if (list) {
        return (
            <Wrapper>
                <ControlPanel>
                    <LeftButton
                        onClick={() =>
                            setNow({
                                year: now.year + (now.month === 1 ? -1 : 0),
                                month: now.month === 1 ? 12 : now.month - 1,
                            })
                        }
                    />
                    <Now>{`${now.year}. ${addZero(now.month)}`}</Now>
                    <RightButton
                        onClick={() =>
                            setNow({
                                year: now.year + (now.month === 12 ? 1 : 0),
                                month: now.month === 12 ? 1 : now.month + 1,
                            })
                        }
                    />
                    <AddButton onClick={() => setPopUp({ num: 1 })} />
                </ControlPanel>
                <CalendarTable>
                    <FlexRow>
                        {weekCategory.map((i) => (
                            <TopLineItem
                                key={i}
                                color={
                                    i === "Sat"
                                        ? "blue"
                                        : i === "Sun"
                                        ? "red"
                                        : "black"
                                }
                            >
                                {i}
                            </TopLineItem>
                        ))}
                    </FlexRow>
                    {[0, 1, 2, 3, 4, 5].map((i, idx) => (
                        <FlexRow
                            key={i}
                            style={{
                                width: "100%",
                                height: "calc(16.6666667% - 6.66666667px)",
                                borderRight: "1px solid grey",
                                borderBottom: "1px solid grey",
                            }}
                        >
                            {weekCategory.map((j, jdx) => (
                                <Cell key={j}>
                                    <DateBlock
                                        color={
                                            (jdx === 0
                                                ? "#ff0000"
                                                : jdx === 6
                                                ? "#0000ff"
                                                : "#000000") +
                                            (CalendarInfo[idx * 7 + jdx]
                                                .month === now.month
                                                ? ""
                                                : "66")
                                        }
                                    >
                                        {CalendarInfo[idx * 7 + jdx].day}
                                    </DateBlock>
                                    {list[idx * 7 + jdx]
                                        .slice(0, 5)
                                        .map((k) => (
                                            <ScheduleBlock
                                                key={k.num}
                                                color={
                                                    k.color +
                                                    (CalendarInfo[idx * 7 + jdx]
                                                        .month === now.month
                                                        ? ""
                                                        : "66")
                                                }
                                                onClick={() =>
                                                    setPopUp({
                                                        num: 2,
                                                        info: k,
                                                    })
                                                }
                                            >
                                                {k.name}
                                            </ScheduleBlock>
                                        ))}
                                    {list[idx * 7 + jdx].length > 5 && (
                                        <MoreScheduleBlock
                                            onClick={() =>
                                                setPopUp({
                                                    num: 5,
                                                    info: list[idx * 7 + jdx],
                                                    date: CalendarInfo[
                                                        idx * 7 + jdx
                                                    ],
                                                })
                                            }
                                        >{`+${
                                            list[idx * 7 + jdx].length - 5
                                        }`}</MoreScheduleBlock>
                                    )}
                                </Cell>
                            ))}
                        </FlexRow>
                    ))}
                </CalendarTable>
                {(popUp.num === 1 || popUp.num === 4) && (
                    <InsertSchedulePopUp
                        popUp={popUp}
                        setPopUp={setPopUp}
                        now={now}
                    />
                )}
                {popUp.num === 2 && (
                    <ReadSchedulePopUp
                        popUp={popUp}
                        setPopUp={setPopUp}
                        now={now}
                    />
                )}
                {(popUp.num === 3 || popUp.num === 6) && (
                    <UpdateSchedulePopUp
                        popUp={popUp}
                        setPopUp={setPopUp}
                        now={now}
                    />
                )}
                {popUp.num === 5 && (
                    <ListSchedulePopUp
                        popUp={popUp}
                        setPopUp={setPopUp}
                        now={now}
                    />
                )}
            </Wrapper>
        );
    } else if (error) {
        return <Wrapper style={{ justifyContent: "center" }}>Error</Wrapper>;
    } else {
        return (
            <Wrapper>
                <ControlPanel>
                    <LeftButton
                        onClick={() =>
                            setNow({
                                year: now.year + (now.month === 1 ? -1 : 0),
                                month: now.month === 1 ? 12 : now.month - 1,
                            })
                        }
                    />
                    <Now>{`${now.year}. ${addZero(now.month)}`}</Now>
                    <RightButton
                        onClick={() =>
                            setNow({
                                year: now.year + (now.month === 12 ? 1 : 0),
                                month: now.month === 12 ? 1 : now.month + 1,
                            })
                        }
                    />
                    <AddButton onClick={() => setPopUp({ num: 1 })} />
                </ControlPanel>
                <CalendarTable>
                    <FlexRow>
                        {weekCategory.map((i) => (
                            <TopLineItem
                                key={i}
                                color={
                                    i === "Sat"
                                        ? "blue"
                                        : i === "Sun"
                                        ? "red"
                                        : "black"
                                }
                            >
                                {i}
                            </TopLineItem>
                        ))}
                    </FlexRow>
                    {[0, 1, 2, 3, 4, 5].map((i, idx) => (
                        <FlexRow
                            key={i}
                            style={{
                                width: "100%",
                                height: "calc(16.6666667% - 6.66666667px)",
                                borderRight: "1px solid grey",
                                borderBottom: "1px solid grey",
                            }}
                        >
                            {weekCategory.map((j, jdx) => (
                                <Cell key={j}>
                                    <DateBlock
                                        color={
                                            (jdx === 0
                                                ? "#ff0000"
                                                : jdx === 6
                                                ? "#0000ff"
                                                : "#000000") +
                                            (CalendarInfo[idx * 7 + jdx]
                                                .month === now.month
                                                ? ""
                                                : "66")
                                        }
                                    >
                                        {CalendarInfo[idx * 7 + jdx].day}
                                    </DateBlock>
                                </Cell>
                            ))}
                        </FlexRow>
                    ))}
                </CalendarTable>
            </Wrapper>
        );
    }
};

export default Calendar;

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
    height: 620px;
    box-shadow: 10px 10px 20px black;
    justify-content: flex-start;
    padding: 50px 15px;
    @media all and (max-height: 660px) {
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
    top: max(calc(50% - 230px), 20px);
    left: max(calc(50% - 300px), 15px);
    background-color: white;
    border-radius: 15px;
    width: calc(100% - 30px);
    max-width: 600px;
    height: 470px;
    box-shadow: 10px 10px 20px black;
    justify-content: flex-start;
    padding: 50px 15px 20px 15px;
    -ms-user-select: text;
    -moz-user-select: -moz-text;
    -webkit-user-select: text;
    -khtml-user-select: text;
    user-select: text;
    @media all and (max-height: 510px) {
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
    font-family: "Hahmlet", serif;
    margin-bottom: 45px;
    max-width: 80%;
    overflow: hidden;
    word-break: break-all;
    line-height: 50px;
    height: 50px;
    min-height: 50px;
    max-height: 50px;
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
const Title2 = styled.div`
    margin-right: 15px;
    font-size: 18px;
    font-family: "Nanum Gothic", sans-serif;
    @media all and (max-width: 320px) {
        margin-right: 5px;
        letter-spacing: -2px;
        font-size: 16px;
    }
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
const DateForm = styled(Form)`
    width: 28.25px;
    text-align: center;
    padding: 0;
    ::placeholder {
        font-size: 13px;
        letter-spacing: -1.5px;
        text-align: center;
    }
`;
const DateForm2 = styled(Form)`
    width: 28.25px;
    text-align: center;
    padding: 0;
    margin-left: 12px;
    ::placeholder {
        font-size: 13px;
        letter-spacing: -1.5px;
        text-align: center;
    }
    @media all and (max-width: 330px) {
        margin: 0;
    }
`;
const DateLine = styled.div`
    font-size: 18px;
    height: 20px;
    border-bottom: 1px solid grey;
`;
const ConfirmButton = styled.div`
    width: 120px;
    height: 40px;
    text-align: center;
    font-size: 30px;
    font-family: "Quicksand", sans-serif;
    margin-top: 40px;
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
const BackPopUpButton = styled(AiOutlineRollback)`
    width: 30px;
    height: 30px;
    cursor: pointer;
`;
const ReadForm = styled.div`
    font-size: 16px;
    font-family: "Nanum Gothic", sans-serif;
    box-shadow: none !important;
    padding: 0 2px;
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
const EditPopUpButtonWrapper = styled.div`
    width: 100%;
    height: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
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
const CalendarIcon = styled(AiTwotoneCalendar)`
    width: 20px;
    height: 20px;
    margin-left: 3px;
    cursor: pointer;
    transition: all 0.15s linear;
    color: grey;
    &:hover {
        color: black;
    }
`;
const ListWrapper = styled(FlexCol)`
    width: 100%;
    height: 100%;
    margin-top: -10px;
    max-height: 445px;
    justify-content: flex-start;
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
    padding-bottom: 20px;
`;
const ListItemWrapper = styled(FlexRow)`
    width: 100%;
    max-width: 400px;
    min-height: 55px;
    font-size: 24px;
    border-radius: 20px;
    margin-top: 15px;
    justify-content: center;
    color: white;
    background-color: ${(props) => props.color};
    transition: all 0.15s linear;
    cursor: pointer;
    &:hover {
        box-shadow: 5px 5px 5px ${(props) => props.color};
    }
`;

const initialState = {
    name: "",
    color: "#000000",
    content: "",
    location: "",
    start: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        hour: "00",
        minute: "00",
    },
    end: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        hour: "23",
        minute: "59",
    },
};
const reducer = (state, action) => {
    var newValue = action.target.value;
    switch (action.name) {
        case "name":
            newValue = newValue.substring(0, 30);
            break;
        case "content":
            newValue = newValue.substring(0, 255);
            break;
        case "color":
            var colorPattern = /[^0-9#A-Fa-f]/g;
            newValue = newValue.replace(colorPattern, "");
            newValue = newValue.substring(0, 7);
            if (newValue === "") newValue = "#";
            break;
        case "startyear":
            return {
                ...state,
                start: {
                    ...state.start,
                    [action.name.substring(5)]: newValue.substring(0, 4),
                },
            };
        case "startmonth":
        case "startday":
        case "starthour":
        case "startminute":
            return {
                ...state,
                start: {
                    ...state.start,
                    [action.name.substring(5)]: newValue.substring(0, 2),
                },
            };
        case "endyear":
            return {
                ...state,
                end: {
                    ...state.end,
                    [action.name.substring(3)]: newValue.substring(0, 4),
                },
            };
        case "endmonth":
        case "endday":
        case "endhour":
        case "endminute":
            return {
                ...state,
                end: {
                    ...state.end,
                    [action.name.substring(3)]: newValue.substring(0, 2),
                },
            };
        case "location":
            newValue = newValue.substring(0, 30);
            break;
        default:
            break;
    }
    return { ...state, [action.name]: newValue };
};
const InsertSchedulePopUp = ({ popUp, setPopUp, now }) => {
    const { username, loading, error } = useSelector(
        ({ account, loading, calendar }) => ({
            username: account.user.username,
            loading: loading["calendar/INSERT_CALENDAR"],
            error: calendar.insertError,
        })
    );
    const dispatch = useDispatch();
    const [state, stateDispatch] = useReducer(reducer, initialState);
    const setStartDate = (x) => {
        stateDispatch({
            name: "startyear",
            target: { value: addZero(String(x.year)) },
        });
        stateDispatch({
            name: "startmonth",
            target: { value: addZero(String(x.month)) },
        });
        stateDispatch({
            name: "startday",
            target: { value: addZero(String(x.day)) },
        });
    };
    const setEndDate = (x) => {
        stateDispatch({
            name: "endyear",
            target: { value: addZero(String(x.year)) },
        });
        stateDispatch({
            name: "endmonth",
            target: { value: addZero(String(x.month)) },
        });
        stateDispatch({
            name: "endday",
            target: { value: addZero(String(x.day)) },
        });
    };
    useEffect(() => {
        dispatch(initInsertCalendarError());
        return () => {
            dispatch(initInsertCalendarError());
        };
    }, [dispatch]);
    useEffect(() => {
        if (error) {
            alert(error.response.data.message);
        } else if (error === false) {
            dispatch(
                getListCalendar({ username, year: now.year, month: now.month })
            );
            setPopUp({ num: 0 });
        }
    }, [dispatch, setPopUp, error, username, now]);
    const onSubmit = () => {
        var submitValue = {
            username: username,
            name: state.name,
            color: state.color,
            content: state.content,
            location: state.location,
            start: new Date(
                state.start.year,
                state.start.month - 1,
                state.start.day,
                state.start.hour,
                state.start.minute
            ),
            end: new Date(
                state.end.year,
                state.end.month - 1,
                state.end.day,
                state.end.hour,
                state.end.minute
            ),
        };
        if (
            state.start.year < 2000 ||
            state.start.year > 2099 ||
            state.start.month < 1 ||
            state.start.month > 12 ||
            state.start.day < 1 ||
            state.start.day >
                daysOfMonth(state.start.year, state.start.month) ||
            state.start.hour < 0 ||
            state.start.hour > 23 ||
            state.start.minute < 0 ||
            state.start.minute > 60 ||
            state.end.year < 2000 ||
            state.end.year > 2099 ||
            state.end.month < 1 ||
            state.end.month > 12 ||
            state.end.day < 1 ||
            state.end.day > daysOfMonth(state.end.year, state.end.month) ||
            state.end.hour < 0 ||
            state.end.hour > 23 ||
            state.end.minute < 0 ||
            state.end.minute > 60
        ) {
            alert("시간이 올바르지 않습니다.");
            return;
        }
        dispatch(insertCalendar(submitValue));
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
                <PopUpTitle>일정 추가</PopUpTitle>
                <ContentWrapper>
                    <Title>이름</Title>
                    <Form
                        style={{ width: "calc(100% - 51px)" }}
                        onChange={(e) => stateDispatch({ ...e, name: "name" })}
                        value={state.name}
                    />
                </ContentWrapper>
                <ContentWrapper>
                    <Title>내용</Title>
                    <Form
                        style={{ width: "calc(100% - 51px)" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "content" })
                        }
                        value={state.content}
                    />
                </ContentWrapper>
                <ContentWrapper>
                    <Title>장소</Title>
                    <Form
                        style={{ width: "calc(100% - 51px)" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "location" })
                        }
                        value={state.location}
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
                <ContentWrapper>
                    <Title2>시작</Title2>
                    <DateForm
                        style={{ width: "40px" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "startyear" })
                        }
                        value={state.start.year}
                    />
                    <DateLine>-</DateLine>
                    <DateForm
                        style={{ width: "24px" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "startmonth" })
                        }
                        value={state.start.month}
                    />
                    <DateLine>-</DateLine>
                    <DateForm
                        style={{ width: "24px" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "startday" })
                        }
                        value={state.start.day}
                    />
                    <CalendarIcon
                        onClick={() =>
                            setPopUp({
                                num: 4,
                                date: state.start,
                                setDate: setStartDate,
                            })
                        }
                    />
                    <DateForm2
                        style={{ width: "30px" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "starthour" })
                        }
                        value={state.start.hour}
                    />
                    <DateLine>:</DateLine>
                    <DateForm
                        style={{ width: "30px" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "startminute" })
                        }
                        value={state.start.minute}
                    />
                </ContentWrapper>
                <ContentWrapper style={{ marginTop: "-10px" }}>
                    <Title2>종료</Title2>
                    <DateForm
                        style={{ width: "40px" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "endyear" })
                        }
                        value={state.end.year}
                    />
                    <DateLine>-</DateLine>
                    <DateForm
                        style={{ width: "24px" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "endmonth" })
                        }
                        value={state.end.month}
                    />
                    <DateLine>-</DateLine>
                    <DateForm
                        style={{ width: "24px" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "endday" })
                        }
                        value={state.end.day}
                    />
                    <CalendarIcon
                        onClick={() =>
                            setPopUp({
                                num: 4,
                                date: state.end,
                                setDate: setEndDate,
                            })
                        }
                    />
                    <DateForm2
                        style={{ width: "30px" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "endhour" })
                        }
                        value={state.end.hour}
                    />
                    <DateLine>:</DateLine>
                    <DateForm
                        style={{ width: "30px" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "endminute" })
                        }
                        value={state.end.minute}
                    />
                </ContentWrapper>
                {popUp.num === 4 && (
                    <CalendarPopUp popUp={popUp} setPopUp={setPopUp} />
                )}
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
const ReadSchedulePopUp = ({ popUp, setPopUp, now }) => {
    const { username, loading, error } = useSelector(
        ({ account, loading, calendar }) => ({
            username: account.user.username,
            loading: loading["calendar/REMOVE_CALENDAR"],
            error: calendar.removeError,
        })
    );
    const dispatch = useDispatch();
    const state = popUp.info;
    useEffect(() => {
        dispatch(initRemoveCalendarError());
        return () => {
            dispatch(initRemoveCalendarError());
        };
    }, [dispatch]);
    useEffect(() => {
        if (error) {
            alert(error.response.data.message);
        } else if (error === false) {
            dispatch(
                getListCalendar({ username, year: now.year, month: now.month })
            );
            setPopUp({ num: 0 });
        }
    }, [dispatch, setPopUp, error, username, now]);
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
                <ClosePopUpButtonWrapper
                    style={popUp.back && { justifyContent: "space-between" }}
                >
                    {popUp.back && (
                        <BackPopUpButton
                            onClick={() => {
                                setPopUp({
                                    num: 5,
                                    info: popUp.back.info,
                                    date: popUp.back.date,
                                });
                            }}
                        />
                    )}
                    <ClosePopUpButton
                        onClick={() => {
                            setPopUp({ num: 0 });
                        }}
                    />
                </ClosePopUpButtonWrapper>
                <PopUpTitle>{state.name}</PopUpTitle>
                <ContentWrapper>
                    <Title
                        style={{
                            height: "100%",
                            display: "flex",
                        }}
                    >
                        내용
                    </Title>
                    <ReadEtcForm style={{ width: "calc(100% - 51px)" }}>
                        {state.content === "" ? "(없음)" : state.content}
                    </ReadEtcForm>
                </ContentWrapper>
                <ContentWrapper>
                    <Title>장소</Title>
                    <ReadForm style={{ width: "calc(100% - 51px)" }}>
                        {state.location === "" ? "(없음)" : state.location}
                    </ReadForm>
                </ContentWrapper>
                <ContentWrapper>
                    <Title>시작</Title>
                    <ReadForm>
                        {state.start &&
                            `${state.start.substring(
                                0,
                                10
                            )} ${state.start.substring(11, 16)}`}
                    </ReadForm>
                </ContentWrapper>
                <ContentWrapper>
                    <Title>종료</Title>
                    <ReadForm>
                        {" "}
                        {state.end &&
                            `${state.end.substring(
                                0,
                                10
                            )} ${state.end.substring(11, 16)}`}
                    </ReadForm>
                </ContentWrapper>
                {loading ? (
                    <EditPopUpButtonWrapper>
                        <Loading r="40px" />
                    </EditPopUpButtonWrapper>
                ) : (
                    <EditPopUpButtonWrapper>
                        <DeletePopUpButton
                            onClick={() => {
                                if (window.confirm("정말 삭제하시겠습니까?")) {
                                    dispatch(
                                        removeCalendar({ num: popUp.info.num })
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
const UpdateSchedulePopUp = ({ popUp, setPopUp, now }) => {
    const { username, updateLoading, updateError, removeLoading, removeError } =
        useSelector(({ account, loading, calendar }) => ({
            username: account.user.username,
            updateLoading: loading["calendar/UPDATE_CALENDAR"],
            updateError: calendar.updateError,
            removeLoading: loading["calendar/REMOVE_CALENDAR"],
            removeError: calendar.removeError,
        }));
    const dispatch = useDispatch();
    const [state, stateDispatch] = useReducer(
        reducer,
        typeof popUp.info.start === "string"
            ? {
                  ...popUp.info,
                  start: {
                      year: popUp.info.start.substring(0, 4),
                      month: popUp.info.start.substring(5, 7),
                      day: popUp.info.start.substring(8, 10),
                      hour: popUp.info.start.substring(11, 13),
                      minute: popUp.info.start.substring(14, 16),
                  },
                  end: {
                      year: popUp.info.end.substring(0, 4),
                      month: popUp.info.end.substring(5, 7),
                      day: popUp.info.end.substring(8, 10),
                      hour: popUp.info.end.substring(11, 13),
                      minute: popUp.info.end.substring(14, 16),
                  },
              }
            : popUp.info
    );
    const setStartDate = (x) => {
        stateDispatch({
            name: "startyear",
            target: { value: addZero(String(x.year)) },
        });
        stateDispatch({
            name: "startmonth",
            target: { value: addZero(String(x.month)) },
        });
        stateDispatch({
            name: "startday",
            target: { value: addZero(String(x.day)) },
        });
    };
    const setEndDate = (x) => {
        stateDispatch({
            name: "endyear",
            target: { value: addZero(String(x.year)) },
        });
        stateDispatch({
            name: "endmonth",
            target: { value: addZero(String(x.month)) },
        });
        stateDispatch({
            name: "endday",
            target: { value: addZero(String(x.day)) },
        });
    };
    useEffect(() => {
        dispatch(initUpdateCalendarError());
        dispatch(initRemoveCalendarError());
        return () => {
            dispatch(initUpdateCalendarError());
            dispatch(initRemoveCalendarError());
        };
    }, [dispatch]);
    useEffect(() => {
        if (updateError) {
            alert(updateError.response.data.message);
        } else if (updateError === false) {
            dispatch(
                getListCalendar({ username, year: now.year, month: now.month })
            );
            setPopUp({ num: 0 });
        } else if (removeError) {
            alert(removeError.response.data.message);
        } else if (removeError === false) {
            dispatch(
                getListCalendar({ username, year: now.year, month: now.month })
            );
            setPopUp({ num: 0 });
        }
        dispatch(initUpdateCalendarError());
        dispatch(initRemoveCalendarError());
    }, [dispatch, setPopUp, updateError, removeError, username, now]);
    const onSubmit = () => {
        var submitValue = {
            num: state.num,
            username: username,
            name: state.name,
            color: state.color,
            content: state.content,
            location: state.location,
            start: new Date(
                state.start.year,
                state.start.month - 1,
                state.start.day,
                state.start.hour,
                state.start.minute
            ),
            end: new Date(
                state.end.year,
                state.end.month - 1,
                state.end.day,
                state.end.hour,
                state.end.minute
            ),
        };
        if (
            state.start.year < 2000 ||
            state.start.year > 2099 ||
            state.start.month < 1 ||
            state.start.month > 12 ||
            state.start.day < 1 ||
            state.start.day >
                daysOfMonth(state.start.year, state.start.month) ||
            state.start.hour < 0 ||
            state.start.hour > 23 ||
            state.start.minute < 0 ||
            state.start.minute > 60 ||
            state.end.year < 2000 ||
            state.end.year > 2099 ||
            state.end.month < 1 ||
            state.end.month > 12 ||
            state.end.day < 1 ||
            state.end.day > daysOfMonth(state.end.year, state.end.month) ||
            state.end.hour < 0 ||
            state.end.hour > 23 ||
            state.end.minute < 0 ||
            state.end.minute > 60
        ) {
            alert("시간이 올바르지 않습니다.");
            return;
        }
        dispatch(updateCalendar(submitValue));
    };
    return (
        <>
            <PopUpBackground
                onClick={() => {
                    if (
                        JSON.stringify({
                            ...popUp.info,
                            start: {
                                year: popUp.info.start.substring(0, 4),
                                month: popUp.info.start.substring(5, 7),
                                day: popUp.info.start.substring(8, 10),
                                hour: popUp.info.start.substring(11, 13),
                                minute: popUp.info.start.substring(14, 16),
                            },
                            end: {
                                year: popUp.info.end.substring(0, 4),
                                month: popUp.info.end.substring(5, 7),
                                day: popUp.info.end.substring(8, 10),
                                hour: popUp.info.end.substring(11, 13),
                                minute: popUp.info.end.substring(14, 16),
                            },
                        }) === JSON.stringify(state)
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
                                JSON.stringify({
                                    ...popUp.info,
                                    start: {
                                        year: popUp.info.start.substring(0, 4),
                                        month: popUp.info.start.substring(5, 7),
                                        day: popUp.info.start.substring(8, 10),
                                        hour: popUp.info.start.substring(
                                            11,
                                            13
                                        ),
                                        minute: popUp.info.start.substring(
                                            14,
                                            16
                                        ),
                                    },
                                    end: {
                                        year: popUp.info.end.substring(0, 4),
                                        month: popUp.info.end.substring(5, 7),
                                        day: popUp.info.end.substring(8, 10),
                                        hour: popUp.info.end.substring(11, 13),
                                        minute: popUp.info.end.substring(
                                            14,
                                            16
                                        ),
                                    },
                                }) === JSON.stringify(state)
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
                <PopUpTitle>일정 수정</PopUpTitle>
                <ContentWrapper>
                    <Title>이름</Title>
                    <Form
                        style={{ width: "calc(100% - 51px)" }}
                        onChange={(e) => stateDispatch({ ...e, name: "name" })}
                        value={state.name}
                    />
                </ContentWrapper>
                <ContentWrapper>
                    <Title>내용</Title>
                    <Form
                        style={{ width: "calc(100% - 51px)" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "content" })
                        }
                        value={state.content}
                    />
                </ContentWrapper>
                <ContentWrapper>
                    <Title>장소</Title>
                    <Form
                        style={{ width: "calc(100% - 51px)" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "location" })
                        }
                        value={state.location}
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
                <ContentWrapper>
                    <Title2>시작</Title2>
                    <DateForm
                        style={{ width: "40px" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "startyear" })
                        }
                        value={state.start.year}
                    />
                    <DateLine>-</DateLine>
                    <DateForm
                        style={{ width: "24px" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "startmonth" })
                        }
                        value={state.start.month}
                    />
                    <DateLine>-</DateLine>
                    <DateForm
                        style={{ width: "24px" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "startday" })
                        }
                        value={state.start.day}
                    />
                    <CalendarIcon
                        onClick={() =>
                            setPopUp({
                                num: 6,
                                info: state,
                                date: state.start,
                                setDate: setStartDate,
                            })
                        }
                    />
                    <DateForm2
                        style={{ width: "30px" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "starthour" })
                        }
                        value={state.start.hour}
                    />
                    <DateLine>:</DateLine>
                    <DateForm
                        style={{ width: "30px" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "startminute" })
                        }
                        value={state.start.minute}
                    />
                </ContentWrapper>
                <ContentWrapper style={{ marginTop: "-10px" }}>
                    <Title2>종료</Title2>
                    <DateForm
                        style={{ width: "40px" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "endyear" })
                        }
                        value={state.end.year}
                    />
                    <DateLine>-</DateLine>
                    <DateForm
                        style={{ width: "24px" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "endmonth" })
                        }
                        value={state.end.month}
                    />
                    <DateLine>-</DateLine>
                    <DateForm
                        style={{ width: "24px" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "endday" })
                        }
                        value={state.end.day}
                    />
                    <CalendarIcon
                        onClick={() =>
                            setPopUp({
                                num: 6,
                                info: state,
                                date: state.end,
                                setDate: setEndDate,
                            })
                        }
                    />
                    <DateForm2
                        style={{ width: "30px" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "endhour" })
                        }
                        value={state.end.hour}
                    />
                    <DateLine>:</DateLine>
                    <DateForm
                        style={{ width: "30px" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "endminute" })
                        }
                        value={state.end.minute}
                    />
                </ContentWrapper>
                {popUp.num === 6 && (
                    <CalendarPopUp popUp={popUp} setPopUp={setPopUp} />
                )}
                {updateLoading || removeLoading ? (
                    <ConfirmButton>
                        <Loading r="40px" />
                    </ConfirmButton>
                ) : (
                    <>
                        <ConfirmButton onClick={onSubmit}>
                            Confirm
                        </ConfirmButton>
                        <EditPopUpButtonWrapper>
                            <DeletePopUpButton
                                onClick={() => {
                                    if (
                                        window.confirm("정말 삭제하시겠습니까?")
                                    ) {
                                        dispatch(
                                            removeCalendar({
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
const ListSchedulePopUp = ({ popUp, setPopUp, now }) => {
    return (
        <>
            <PopUpBackground
                onClick={() => {
                    setPopUp({ num: 0 });
                }}
            />
            <PopUpWrapper>
                <ClosePopUpButtonWrapper>
                    <ClosePopUpButton
                        onClick={() => {
                            setPopUp({ num: 0 });
                        }}
                    />
                </ClosePopUpButtonWrapper>
                <PopUpTitle>{`${popUp.date.year}. ${addZero(
                    popUp.date.month
                )}. ${addZero(popUp.date.day)}`}</PopUpTitle>
                <ListWrapper>
                    {popUp.info.map((i) => (
                        <ListItemWrapper
                            key={i.num}
                            color={i.color}
                            onClick={() =>
                                setPopUp({
                                    num: 2,
                                    info: i,
                                    back: {
                                        info: popUp.info,
                                        date: popUp.date,
                                    },
                                })
                            }
                        >
                            {i.name}
                        </ListItemWrapper>
                    ))}
                </ListWrapper>
            </PopUpWrapper>
        </>
    );
};

const CalendarPopUpWrapper = styled(FlexCol)`
    z-index: 41;
    position: fixed;
    top: max(calc(50% - 100px), 20px);
    left: max(calc(50% - 135px), 7.5px);
    background-color: lightgrey;
    border-radius: 3px;
    width: calc(100% - 15px);
    max-width: 270px;
    height: 200px;
    border: 1px solid black;
    box-shadow: 3px 3px 5px grey;
    justify-content: center;
    padding: 15px 15px;
    -ms-user-select: none;
    -moz-user-select: -moz-none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    user-select: none;
`;
const CalendarPopUpControlWrapper = styled(FlexRow)`
    justify-content: center;
    width: 100%;
    svg {
        width: 22px;
        height: 22px;
        cursor: pointer;
    }
`;
const CalendarPopUpControlInput = styled.input`
    font-size: 22px;
    font-family: "Open Sans", sans-serif;
    background-color: lightgrey;
    border: 0;
    border-bottom: 1px solid black;
    text-align: center;
    height: 24px;
`;
const CalendarPopUpControlLine = styled.div`
    font-size: 22px;
    font-family: "Open Sans", sans-serif;
    margin: 6px 6px 0 2px;
`;
const CalendarPopUpContentWrapper = styled.div`
    margin-top: 5px;
    width: 100%;
    height: 100%;
`;
const CalendarPopUpContentCell = styled(FlexRow)`
    width: 100%;
    height: 100%;
    justify-content: center;
    background-color: ${(props) => props.b};
    color: ${(props) => props.c};
    cursor: pointer;
    &:hover {
        background-color: grey;
    }
`;
const CalendarPopUp = ({ popUp, setPopUp }) => {
    const [state, setState] = useState({
        year: popUp.date.year,
        month: parseInt(popUp.date.month),
    });
    const CalendarInfo = makeCalendarBase(state.year, state.month);
    const onMoveClick = (mode) => {
        var y = parseInt(state.year);
        var m = parseInt(state.month);
        if (!Number.isInteger(y) && !Number.isInteger(m)) {
            setState({
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
            });
        } else if (!Number.isInteger(y)) {
            setState({ ...state, year: new Date().getFullYear() });
        } else if (!Number.isInteger(m)) {
            setState({ ...state, month: new Date().getMonth() + 1 });
        } else {
            m = m + mode;
            y = y + (m < 1 ? -1 : m > 12 ? 1 : 0);
            m = m === 0 ? 12 : m === 13 ? 1 : m;
            if (y < 2000) {
                setState({
                    year: 2000,
                    month: 1,
                });
            } else if (y > 2099) {
                setState({
                    year: 2099,
                    month: 12,
                });
            } else if (m < 1) {
                setState({
                    year: y,
                    month: 12,
                });
            } else if (m > 12) {
                setState({
                    year: y,
                    month: 1,
                });
            } else {
                setState({
                    year: y,
                    month: m,
                });
            }
        }
    };
    return (
        <>
            <PopUpBackground
                onClick={() => {
                    setPopUp({ ...popUp, num: popUp.num - 3 });
                }}
                style={{ zIndex: 40, backgroundColor: "#00000000" }}
            />
            <CalendarPopUpWrapper>
                <CalendarPopUpControlWrapper>
                    <AiOutlineLeft onClick={() => onMoveClick(-1)} />
                    <CalendarPopUpControlInput
                        style={{ width: "54px" }}
                        value={state.year}
                        onChange={(e) =>
                            setState({
                                ...state,
                                year: e.target.value.substring(0, 4),
                            })
                        }
                    />
                    <CalendarPopUpControlLine>. </CalendarPopUpControlLine>
                    <CalendarPopUpControlInput
                        style={{ width: "27px" }}
                        value={state.month}
                        onChange={(e) =>
                            setState({
                                ...state,
                                month: e.target.value.substring(0, 2),
                            })
                        }
                    />
                    <AiOutlineRight onClick={() => onMoveClick(1)} />
                </CalendarPopUpControlWrapper>
                <CalendarPopUpContentWrapper>
                    {[0, 1, 2, 3, 4, 5].map((i, idx) => (
                        <FlexRow
                            key={i}
                            style={{ width: "100%", height: "16.66666667%" }}
                        >
                            {weekCategory.map((j, jdx) => (
                                <CalendarPopUpContentCell
                                    key={j}
                                    b={
                                        (idx * 7 + jdx) % 2 === 0
                                            ? "#bdbdbd"
                                            : "#c7c7c7"
                                    }
                                    c={
                                        (jdx === 6
                                            ? "#0000ff"
                                            : jdx === 0
                                            ? "#ff0000"
                                            : "#000000") +
                                        (CalendarInfo[idx * 7 + jdx].month !==
                                        state.month
                                            ? "55"
                                            : "")
                                    }
                                    onClick={() => {
                                        popUp.setDate(
                                            CalendarInfo[idx * 7 + jdx]
                                        );
                                        setPopUp({
                                            ...popUp,
                                            num: popUp.num - 3,
                                        });
                                    }}
                                >
                                    {CalendarInfo[idx * 7 + jdx].day}
                                </CalendarPopUpContentCell>
                            ))}
                        </FlexRow>
                    ))}
                </CalendarPopUpContentWrapper>
            </CalendarPopUpWrapper>
        </>
    );
};
