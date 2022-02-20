import React, { useEffect, useReducer, useState } from "react";
import styled, { css } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
    listTodo,
    writeTodo,
    updateTodo,
    removeTodo,
    initListTodoError,
    initWriteTodoError,
    initUpdateTodoError,
    initRemoveTodoError,
} from "modules/todo";
import Loading from "components/etc/Loading";
import { BiEdit } from "react-icons/bi";
import {
    AiTwotoneCalendar,
    AiOutlineDelete,
    AiOutlineStar,
    AiFillStar,
    AiOutlineClose,
    AiOutlineLeft,
    AiOutlineRight,
} from "react-icons/ai";
import { BsCircle, BsCheckCircle } from "react-icons/bs";

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
const Background = styled.div`
    display: flex;
    width: 100%;
    max-width: 500px;
    margin-left: max(calc(50% - 250px), 0px);
    height: 100%;
    min-height: calc(100vh - 45px);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 50px 20px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    @media all and (max-width: 720px) {
        flex-direction: column;
        padding: 35px 10px;
    }
    @media all and (max-width: 400px) {
        padding: 20px 3px;
    }
`;

const ListWrapper = styled.div`
    width: 100%;
    border: 2px solid black;
`;
const CategoryWrapper = styled(FlexRow)`
    width: 100%;
    height: auto;
    flex-wrap: wrap;
    padding: 3px;
    justify-content: flex-start;
`;
const CategoryItem = styled(FlexRow)`
    width: calc(20% - 2px);
    margin: 1px;
    height: 30px;
    border: 2px solid ${(props) => props.c};
    border-radius: 5px;
    justify-content: center;
    font-family: "Nanum Gothic", sans-serif;
    transition: all 0.15s linear;
    cursor: pointer;
    background-color: ${(props) => (props.selected ? props.b : "white")};
    &:hover {
        background-color: ${(props) => props.b};
    }
    padding: 0 2px;
    div {
        height: 16px;
        overflow: hidden;
        line-height: 16px;
    }
`;
const DefaultCategoryWrapper = styled(FlexRow)`
    width: 100%;
    height: 36px;
    padding: 3px;
    border-bottom: 2px solid gray;
    justify-content: space-around;
    svg {
        width: 25px;
        height: 25px;
        margin: 2.5px;
        color: #6c6c6c;
        transition: all 0.15s linear;
        cursor: pointer;
        &:hover {
            color: black;
        }
    }
    padding-top: 0;
`;
const DefaultCategoryItem = styled(FlexRow)`
    width: calc(33.3333% - 14.5px);
    height: 30px;
    border: 2px solid ${(props) => props.c};
    border-radius: 5px;
    justify-content: center;
    font-weight: 700;
    font-family: "Raleway", sans-serif;
    transition: all 0.15s linear;
    cursor: pointer;
    background-color: ${(props) => (props.selected ? props.b : "white")};
    &:hover {
        background-color: ${(props) => props.b};
    }
`;
const ItemContainer = styled(FlexCol)`
    height: 600px;
    min-height: 600px;
    max-height: 600px;
    overflow-y: auto;
    justify-content: flex-start;
    background-color: grey;
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
const ItemWrapper = styled(FlexCol)`
    width: 100%;
    height: auto;
    padding: 5px 10px;
    font-size: 16px;
    line-height: 18px;
    border-bottom: 1px solid grey;
    align-items: flex-start;
    background-color: ${(props) => (props.b ? "white" : "lightgrey")};
`;
const ItemTopWrapper = styled(FlexRow)`
    width: 100%;
`;
const ItemTitle = styled(FlexRow)`
    width: calc(100% - 50px);
`;
const ItemCheck = styled(FlexRow)`
    width: 18px;
    margin-right: 5px;
    padding-top: 1.5px;
    svg {
        width: 18px;
        height: 18px;
    }
    cursor: pointer;
    transition: all 0.15s linear;
    &:hover {
        color: green;
    }
`;
const ItemStar = styled(FlexRow)`
    width: 25px;
    margin-top: 20.5px;
    margin-bottom: -20.5px;
    margin-left: 7.5px;
    svg {
        width: 22.5px;
        height: 22.5px;
    }
    cursor: pointer;
    transition: all 0.15s linear;
    &:hover {
        color: #977a07;
    }
`;
const ItemRemove = styled(FlexRow)`
    width: 25px;
    margin-top: 20.5px;
    margin-bottom: -20.5px;
    margin-left: 4px;
    svg {
        width: 22.5px;
        height: 22.5px;
    }
    cursor: pointer;
    transition: all 0.15s linear;
    &:hover {
        color: #ff6060;
    }
`;
const ItemDue = styled(FlexRow)`
    width: calc(100% - 50px);
    height: 16px;
    font-size: 14px;
    margin-top: 5px;
    color: ${(props) => props.c};
`;
const ItemCategory = styled(FlexRow)`
    width: calc(100% - 50px);
    height: 16px;
    font-size: 14px;
    margin-top: 5px;
    margin-bottom: -3px;
    color: #4c4c4c;
`;

const DefaultColor = [
    "#ff6262",
    "#ffbebe",
    "#ffa667",
    "#ffcaa5",
    "#90c52a",
    "#d4ff81",
    "#3bdf93",
    "#94ffce",
    "#5ad0e3",
    "#a8f3ff",
    "#4a80e3",
    "#a3c3ff",
    "#9f63ef",
    "#d4b3ff",
    "#dd8bf1",
    "#f6d1ff",
    "#d768aa",
    "#ffb8e2",
    "#9f9f9f",
    "#d7d7d7",
];
const DateConvert = (d) => {
    return `${d.substring(0, 4)}년 ${d.substring(5, 7)}월 ${d.substring(
        8,
        10
    )}일 ${d.substring(11, 13)}:${d.substring(14, 16)}`;
};
const isPast = (d) => {
    const D = new Date(
        d.substring(0, 4),
        d.substring(5, 7) - 1,
        d.substring(8, 10),
        d.substring(11, 13),
        d.substring(14, 16)
    );
    return D < new Date();
};
const Todo = () => {
    const [popUp, setPopUp] = useState({ num: 0, category: "all0000000000" });
    const { username, list, listError, removeError, updateError } = useSelector(
        ({ account, todo }) => ({
            username: account.user.username,
            list: todo.list,
            listError: todo.listError,
            removeError: todo.removeError,
            updateError: todo.updateError,
        })
    );
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(listTodo({ username, category: popUp.category }));
        dispatch(initRemoveTodoError());
        dispatch(initUpdateTodoError());
        return () => {
            dispatch(initListTodoError());
            dispatch(initRemoveTodoError());
            dispatch(initUpdateTodoError());
        };
    }, [dispatch, username, popUp.category]);
    useEffect(() => {
        if (listError) {
            alert(listError.response.data.message);
        } else if (removeError) {
            alert(removeError.response.data.message);
        } else if (removeError === false) {
            dispatch(listTodo({ username, category: popUp.category }));
        } else if (updateError) {
            alert(updateError.response.data.message);
        } else if (updateError === false) {
            dispatch(listTodo({ username, category: popUp.category }));
        }
        dispatch(initListTodoError());
        dispatch(initRemoveTodoError());
        dispatch(initUpdateTodoError());
    }, [
        dispatch,
        listError,
        popUp.category,
        removeError,
        updateError,
        username,
    ]);

    const onUpdate = (num, noted) => {
        dispatch(
            updateTodo({
                num: num,
                noted: noted,
            })
        );
    };
    const onRemove = (num) => {
        dispatch(removeTodo({ num: num }));
    };

    if (list) {
        return (
            <>
                <Background>
                    <ListWrapper>
                        <CategoryWrapper>
                            {list.categoryList.slice(0, 9).map((i, idx) => (
                                <CategoryItem
                                    key={i}
                                    c={DefaultColor[idx * 2]}
                                    b={DefaultColor[idx * 2 + 1]}
                                    selected={popUp.category === i}
                                    onClick={() =>
                                        setPopUp({
                                            ...popUp,
                                            category: i,
                                        })
                                    }
                                >
                                    <div>{i === "" ? "미분류" : i}</div>
                                </CategoryItem>
                            ))}
                            {list.categoryList.length > 9 && (
                                <CategoryItem
                                    c={DefaultColor[18]}
                                    b={DefaultColor[19]}
                                    selected={
                                        list.categoryList

                                            .slice(9)
                                            .indexOf(popUp.category) > -1
                                    }
                                    onClick={() =>
                                        setPopUp({
                                            ...popUp,
                                            num: 9,
                                        })
                                    }
                                >
                                    <div>+</div>
                                </CategoryItem>
                            )}
                        </CategoryWrapper>
                        <DefaultCategoryWrapper>
                            <DefaultCategoryItem
                                c="#03a300"
                                b="#bbffba"
                                selected={popUp.category === "all0000000000"}
                                onClick={() =>
                                    setPopUp({
                                        ...popUp,
                                        category: "all0000000000",
                                    })
                                }
                            >
                                <div>ALL</div>
                            </DefaultCategoryItem>
                            <DefaultCategoryItem
                                c="#c7b700"
                                b="#fff68f"
                                selected={popUp.category === "noted0000000000"}
                                onClick={() =>
                                    setPopUp({
                                        ...popUp,
                                        category: "noted0000000000",
                                    })
                                }
                            >
                                <div>NOTED</div>
                            </DefaultCategoryItem>
                            <DefaultCategoryItem
                                c="#565656"
                                b="#cfcfcf"
                                selected={popUp.category === "done0000000000"}
                                onClick={() =>
                                    setPopUp({
                                        ...popUp,
                                        category: "done0000000000",
                                    })
                                }
                            >
                                <div>DONE</div>
                            </DefaultCategoryItem>
                            <BiEdit
                                onClick={() => setPopUp({ ...popUp, num: 1 })}
                            />
                        </DefaultCategoryWrapper>
                        <ItemContainer>
                            {list.result.map((i) => (
                                <ItemWrapper key={i.num} b={i.noted >= 0}>
                                    <ItemTopWrapper>
                                        <ItemCheck>
                                            {i.noted >= 0 ? (
                                                <BsCircle
                                                    onClick={() =>
                                                        onUpdate(
                                                            i.num,
                                                            i.noted - 2
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <BsCheckCircle
                                                    onClick={() =>
                                                        onUpdate(
                                                            i.num,
                                                            i.noted + 2
                                                        )
                                                    }
                                                />
                                            )}
                                        </ItemCheck>
                                        <ItemTitle>{i.title}</ItemTitle>
                                        <ItemStar>
                                            {i.noted === 0 || i.noted === -2 ? (
                                                <AiOutlineStar
                                                    onClick={() =>
                                                        onUpdate(
                                                            i.num,
                                                            i.noted + 1
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <AiFillStar
                                                    onClick={() =>
                                                        onUpdate(
                                                            i.num,
                                                            i.noted - 1
                                                        )
                                                    }
                                                />
                                            )}
                                        </ItemStar>
                                        <ItemRemove>
                                            <AiOutlineDelete
                                                onClick={() => onRemove(i.num)}
                                            />
                                        </ItemRemove>
                                    </ItemTopWrapper>
                                    <ItemCategory>
                                        {i.category === ""
                                            ? "(카테고리 없음)"
                                            : i.category}
                                    </ItemCategory>
                                    <ItemDue
                                        c={isPast(i.due) ? "#ff2f2f" : "black"}
                                    >
                                        {DateConvert(i.due)}
                                    </ItemDue>
                                </ItemWrapper>
                            ))}
                        </ItemContainer>
                    </ListWrapper>
                </Background>
                {(popUp.num === 1 || popUp.num === 4) && (
                    <WriteTodoPopUp popUp={popUp} setPopUp={setPopUp} />
                )}
                {popUp.num === 9 && (
                    <MoreCategoryPopUp
                        popUp={popUp}
                        setPopUp={setPopUp}
                        list={list.categoryList.slice(9)}
                    />
                )}
            </>
        );
    } else {
        return (
            <Background>
                <Loading r="100px" />
            </Background>
        );
    }
};

export default Todo;

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
    top: max(calc(50% - 215px), 20px);
    left: max(calc(50% - 300px), 15px);
    background-color: white;
    border-radius: 15px;
    width: calc(100% - 30px);
    max-width: 600px;
    height: 430px;
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
const PopUpTitle = styled.div`
    font-size: 45px;
    font-family: "Hahmlet", serif;
    margin-bottom: 50px;
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
const ConfirmButton = styled.div`
    width: 120px;
    height: 40px;
    text-align: center;
    font-size: 30px;
    font-family: "Quicksand", sans-serif;
    margin-top: 15px;
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

const initialState = {
    title: "",
    category: "",
    due: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 2,
        day: 1,
        hour: 12,
        minute: 30,
    },
};
const reducer = (state, action) => {
    var newValue = action.target.value;
    switch (action.name) {
        case "title":
            newValue = newValue.substring(0, 30);
            break;
        case "category":
            newValue = newValue.substring(0, 8);
            break;
        case "dueyear":
            return {
                ...state,
                due: {
                    ...state.due,
                    [action.name.substring(3)]: newValue.substring(0, 4),
                },
            };
        case "duemonth":
        case "dueday":
        case "duehour":
        case "dueminute":
            return {
                ...state,
                due: {
                    ...state.due,
                    [action.name.substring(3)]: newValue.substring(0, 2),
                },
            };
        default:
            break;
    }
    return { ...state, [action.name]: newValue };
};
const addZero = (x) => (x < 10 ? `0${x}` : `${x}`);
const WriteTodoPopUp = ({ popUp, setPopUp }) => {
    const { username, loading, error } = useSelector(
        ({ account, loading, todo }) => ({
            username: account.user.username,
            loading: loading["todo/WRITE_TODO"],
            error: todo.writeError,
        })
    );
    const dispatch = useDispatch();
    const [state, stateDispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        dispatch(initWriteTodoError());
        return () => {
            dispatch(initWriteTodoError());
        };
    }, [dispatch]);
    useEffect(() => {
        if (error) {
            alert(error.response.data.message);
        } else if (error === false) {
            dispatch(listTodo({ username, category: popUp.category }));
            setPopUp({ ...popUp, num: 0 });
        }
    }, [dispatch, error, popUp, setPopUp, username]);
    const onSubmit = () => {
        if (
            isNaN(parseInt(state.due.year)) ||
            isNaN(parseInt(state.due.month)) ||
            isNaN(parseInt(state.due.day)) ||
            isNaN(parseInt(state.due.hour)) ||
            isNaN(parseInt(state.due.minute))
        ) {
            alert("기한이 올바르지 않습니다.");
            return;
        }
        if (
            state.due.year < 2000 ||
            state.due.year > 2099 ||
            state.due.month < 1 ||
            state.due.month > 12 ||
            state.due.day < 1 ||
            state.due.day > daysOfMonth(state.due.year, state.due.month) ||
            state.due.hour < 0 ||
            state.due.hour > 23 ||
            state.due.minute < 0 ||
            state.due.minute > 60
        ) {
            alert("시간이 올바르지 않습니다.");
            return;
        }
        if (state.category === "+") {
            alert("사용할 수 없는 카테고리 이름입니다.");
            return;
        }
        var submitValue = {
            username: username,
            title: state.title,
            category: state.category,
            due: new Date(
                state.due.year,
                state.due.month - 1,
                state.due.day,
                state.due.hour,
                state.due.minute
            ),
        };
        if (state.category === "미분류") {
            submitValue.category = "";
        }
        dispatch(writeTodo(submitValue));
    };
    const setDate = (x) => {
        stateDispatch({
            name: "dueyear",
            target: { value: addZero(String(x.year)) },
        });
        stateDispatch({
            name: "duemonth",
            target: { value: addZero(String(x.month)) },
        });
        stateDispatch({
            name: "dueday",
            target: { value: addZero(String(x.day)) },
        });
    };
    return (
        <>
            <PopUpBackground
                onClick={() => {
                    if (
                        JSON.stringify(initialState) === JSON.stringify(state)
                    ) {
                        setPopUp({ ...popUp, num: 0 });
                    } else {
                        if (window.confirm("취소하시겠습니까?")) {
                            setPopUp({ ...popUp, num: 0 });
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
                                setPopUp({ ...popUp, num: 0 });
                            } else {
                                if (window.confirm("취소하시겠습니까?")) {
                                    setPopUp({ ...popUp, num: 0 });
                                }
                            }
                        }}
                    />
                </ClosePopUpButtonWrapper>
                <PopUpTitle>할일 추가</PopUpTitle>
                <ContentWrapper>
                    <Title>제목</Title>
                    <Form
                        style={{ width: "calc(100% - 51px)" }}
                        onChange={(e) => stateDispatch({ ...e, name: "title" })}
                        value={state.title}
                    />
                </ContentWrapper>
                <ContentWrapper>
                    <Title>카테고리</Title>
                    <Form
                        style={{ width: "calc(100% - 87px)" }}
                        onChange={(e) =>
                            stateDispatch({ ...e, name: "category" })
                        }
                        value={state.category}
                    />
                </ContentWrapper>
                <ContentWrapper>
                    <ContentWrapper>
                        <Title2>기한</Title2>
                        <DateForm
                            style={{ width: "40px" }}
                            onChange={(e) =>
                                stateDispatch({ ...e, name: "dueyear" })
                            }
                            value={state.due.year}
                        />
                        <DateLine>-</DateLine>
                        <DateForm
                            style={{ width: "24px" }}
                            onChange={(e) =>
                                stateDispatch({ ...e, name: "duemonth" })
                            }
                            value={state.due.month}
                        />
                        <DateLine>-</DateLine>
                        <DateForm
                            style={{ width: "24px" }}
                            onChange={(e) =>
                                stateDispatch({ ...e, name: "dueday" })
                            }
                            value={state.due.day}
                        />
                        <CalendarIcon
                            onClick={() =>
                                setPopUp({
                                    ...popUp,
                                    num: 4,
                                    date: state.due,
                                    setDate: setDate,
                                })
                            }
                        />
                        <DateForm2
                            style={{ width: "30px" }}
                            onChange={(e) =>
                                stateDispatch({ ...e, name: "duehour" })
                            }
                            value={state.due.hour}
                        />
                        <DateLine>:</DateLine>
                        <DateForm
                            style={{ width: "30px" }}
                            onChange={(e) =>
                                stateDispatch({ ...e, name: "dueminute" })
                            }
                            value={state.due.minute}
                        />
                    </ContentWrapper>
                </ContentWrapper>
                {loading ? (
                    <ConfirmButton>
                        <Loading r="40px" />
                    </ConfirmButton>
                ) : (
                    <ConfirmButton onClick={onSubmit}>Confirm</ConfirmButton>
                )}
                {popUp.num === 4 && (
                    <CalendarPopUp popUp={popUp} setPopUp={setPopUp} />
                )}
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
const CategoryPopUpWrapper = styled(FlexCol)`
    width: 100%;
    justify-content: flex-start;
    overflow: auto;
    padding: 5px 0;
    &::-webkit-scrollbar {
        width: 7px;
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
const CategoryPopUpItem = styled(FlexRow)`
    margin: 1px;
    width: 150px;
    height: 35px;
    min-height: 35px;
    border: 2px solid black;
    border-radius: 5px;
    justify-content: center;
    font-family: "Nanum Gothic", sans-serif;
    transition: all 0.15s linear;
    cursor: pointer;
    background-color: white;
    &:hover {
        background-color: #f0f0f0;
    }
`;
const MoreCategoryPopUp = ({ popUp, setPopUp, list }) => {
    return (
        <>
            <PopUpBackground
                onClick={() => {
                    setPopUp({ ...popUp, num: 0 });
                }}
                style={{ zIndex: 40, backgroundColor: "#000000bb" }}
            />
            <CalendarPopUpWrapper>
                <CategoryPopUpWrapper>
                    {list.map((i) => (
                        <CategoryPopUpItem
                            key={i}
                            onClick={() =>
                                setPopUp({ ...popUp, num: 0, category: i })
                            }
                        >
                            {i}
                        </CategoryPopUpItem>
                    ))}
                </CategoryPopUpWrapper>
            </CalendarPopUpWrapper>
        </>
    );
};
