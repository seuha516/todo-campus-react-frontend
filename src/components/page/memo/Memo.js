import React, { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
    listMemo,
    initListMemoError,
    updateMemo,
    initUpdateMemoError,
    writeMemo,
    initWriteMemoError,
    removeMemo,
    initRemoveMemoError,
} from "modules/memo";
import Loading from "components/etc/Loading";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete, AiOutlineSave, AiOutlineCheck } from "react-icons/ai";
import { UNSAFE_NavigationContext } from "react-router-dom";

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
    height: 100%;
    max-width: 1200px;
    margin-left: max(calc(50% - 600px), 0px);
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
    width: 30%;
    height: 720px;
    border: 2px solid black;
    @media all and (max-width: 720px) {
        width: 100%;
        height: 250px;
    }
`;
const TopWrapper = styled(FlexRow)`
    width: 100%;
    height: 45px;
    padding: 10px;
    border-bottom: 2px solid gray;
    font-family: "Lora", serif;
    svg {
        width: 24px;
        height: 24px;
        margin-left: 10px;
        color: #4c4c4c;
        transition: all 0.1s linear;
        cursor: pointer;
        &:hover {
            color: black;
        }
    }
`;
const TopText = styled.div`
    font-size: 22px;
`;
const ItemContainer = styled(FlexCol)`
    height: calc(100% - 45px);
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
const ItemWrapper = styled(FlexRow)`
    width: 100%;
    height: 80px;
    padding: 18px 10px;
    font-size: 16px;
    line-height: 18px;
    border-bottom: 1px solid grey;
    cursor: pointer;
    transition: all 0.1s linear;
    &:hover {
        background-color: #fffee8;
    }
    background-color: ${(props) => (props.selected ? "#d8d8d8" : "white")};
`;
const ItemBox = styled.div`
    min-height: 54px;
    max-height: 54px;
    text-align: flex-start;
    word-break: break-all;
    overflow: hidden;
`;

const EditorWrapper = styled.div`
    width: 70%;
    height: 720px;
    border: 2px solid black;
    @media all and (max-width: 720px) {
        width: 100%;
        height: 650px;
        margin-top: 10px;
    }
`;
const BodyWrapper = styled.textarea`
    width: 100%;
    height: calc(100% - 45px);
    padding: 15px;
    font-size: 16px;
    font-family: "Nanum Gothic", sans-serif;
    background-color: #ededed;
`;

function useBlocker(blocker, when = true) {
    const { navigator } = useContext(UNSAFE_NavigationContext);

    useEffect(() => {
        if (!when) return;

        const unblock = navigator.block((tx) => {
            const autoUnblockingTx = {
                ...tx,
                retry() {
                    unblock();
                    tx.retry();
                },
            };
            blocker(autoUnblockingTx);
        });
        return unblock;
    }, [navigator, blocker, when]);
}
function usePrompt(message, when = true) {
    const blocker = useCallback(
        (tx) => {
            //   eslint-disable-next-line no-alert
            if (window.confirm(message)) tx.retry();
        },
        [message]
    );
    useBlocker(blocker, when);
}

const Memo = () => {
    const { username, list, listError, updateError, writeError, removeError } =
        useSelector(({ account, memo }) => ({
            username: account.user.username,
            list: memo.list,
            listError: memo.listError,
            updateError: memo.updateError,
            writeError: memo.writeError,
            removeError: memo.removeError,
        }));
    const [state, setState] = useState(null);
    const [index, setIndex] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(listMemo({ username }));
        dispatch(initWriteMemoError());
        dispatch(initUpdateMemoError());
        dispatch(initRemoveMemoError());
        return () => {
            dispatch(initListMemoError());
            dispatch(initWriteMemoError());
            dispatch(initUpdateMemoError());
            dispatch(initRemoveMemoError());
        };
    }, [dispatch, username]);
    useEffect(() => {
        if (listError) {
            alert(listError.response.data.message);
        } else if (listError === false) {
            setState(list);
        } else if (updateError) {
            alert(updateError.response.data.message);
        } else if (updateError === false) {
            dispatch(listMemo({ username }));
        } else if (writeError) {
            alert(writeError.response.data.message);
        } else if (writeError === false) {
            dispatch(listMemo({ username }));
        } else if (removeError) {
            alert(removeError.response.data.message);
        } else if (removeError === false) {
            dispatch(listMemo({ username }));
        }
        dispatch(initListMemoError());
        dispatch(initWriteMemoError());
        dispatch(initUpdateMemoError());
        dispatch(initRemoveMemoError());
    }, [
        listError,
        list,
        updateError,
        writeError,
        removeError,
        dispatch,
        username,
    ]);
    const onSave = () => {
        if (index !== null) {
            dispatch(updateMemo(state[index]));
        }
    };
    const onWrite = () => {
        onSave();
        dispatch(writeMemo({ body: "", username: username }));
        setIndex(0);
    };
    const onRemove = () => {
        if (window.confirm("삭제하시겠습니까?")) {
            dispatch(removeMemo(state[index]));
            setIndex(null);
        }
    };
    usePrompt(
        "페이지를 이탈하시겠습니까?\n현재 문서가 저장되지 않았습니다.",
        index !== null &&
            list &&
            list[index] &&
            state &&
            state[index] &&
            list[index].body !== state[index].body
    );

    if (state) {
        return (
            <Background>
                <ListWrapper>
                    <TopWrapper>
                        <TopText>List</TopText>
                        <BiEdit onClick={onWrite} />
                    </TopWrapper>
                    <ItemContainer>
                        {state.map((i, idx) => (
                            <ItemWrapper
                                key={i.num}
                                onClick={() => {
                                    onSave();
                                    setIndex(idx);
                                }}
                                selected={index === idx}
                            >
                                <ItemBox>
                                    {i.body === ""
                                        ? "New Memo"
                                        : i.body.replace(/(\n|\r\n)/g, " ")}
                                </ItemBox>
                            </ItemWrapper>
                        ))}
                    </ItemContainer>
                </ListWrapper>
                {index !== null && state[index] ? (
                    <EditorWrapper>
                        <TopWrapper>
                            {list &&
                            list[index] &&
                            list[index].body === state[index].body ? (
                                <AiOutlineCheck
                                    style={{
                                        color: "black",
                                        cursor: "default",
                                    }}
                                />
                            ) : (
                                <AiOutlineSave onClick={onSave} />
                            )}
                            <AiOutlineDelete onClick={onRemove} />
                        </TopWrapper>
                        <BodyWrapper
                            value={state[index].body}
                            onChange={(e) =>
                                setState(
                                    state.map((i, idx) =>
                                        idx === index
                                            ? { ...i, body: e.target.value }
                                            : i
                                    )
                                )
                            }
                        />
                    </EditorWrapper>
                ) : (
                    <EditorWrapper>
                        <TopWrapper></TopWrapper>
                        <FlexRow
                            style={{
                                justifyContent: "center",
                                height: "calc(100% - 47px)",
                                backgroundColor: "#ededed",
                            }}
                        >
                            <div>메모를 선택해 주세요!</div>
                        </FlexRow>
                    </EditorWrapper>
                )}
            </Background>
        );
    } else {
        return (
            <Background>
                <Loading r="100px" />
            </Background>
        );
    }
};

export default Memo;
