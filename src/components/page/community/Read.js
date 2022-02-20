import {
    addCommentPost,
    initAddCommentPostError,
    initReadPostError,
    initRemovePostError,
    readPost,
    removePost,
} from "modules/post";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import styled from "styled-components";
import {
    BsFillPersonFill,
    BsFillReplyFill,
    BsPencilSquare,
    BsArrowReturnRight,
} from "react-icons/bs";
import {
    AiOutlineLike,
    AiOutlineComment,
    AiOutlineDelete,
} from "react-icons/ai";
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
    width: 100%;
    max-width: 800px;
    height: 100%;
    padding: 50px 20px;
    justify-content: flex-start;
    align-items: center;
    @media all and (max-width: 720px) {
        padding: 35px 10px;
    }
    @media all and (max-width: 400px) {
        padding: 20px 3px;
    }
`;
const TopPaperWrapper = styled(FlexRow)`
    justify-content: flex-end;
    background-color: #e5e5e5;
    width: 100%;
    height: 25px;
`;
const Tri = styled.div`
    width: 0px;
    height: 0px;
    border-top: 12.5px solid white;
    border-bottom: 12.5px solid grey;
    border-right: 12.5px solid white;
    border-left: 12.5px solid grey;
`;
const TitleWrapper = styled.div`
    background-color: #e5e5e5;
    border: 0;
    height: 60px;
    padding: 15px;
    width: 100%;
    font-size: 22px;
    border-bottom: 2px solid lightgrey;
    font-weight: 700;
`;
const UserWrapper = styled.div`
    background-color: #e5e5e5;
    border: 0;
    padding: 15px;
    width: 100%;
    font-size: 16px;
    font-weight: 700;
    svg {
        margin: 0 5px -2.4px 0;
    }
`;
const DateWrapper = styled.div`
    background-color: #e5e5e5;
    border: 0;
    padding: 15px;
    padding-top: 0;
    width: 100%;
    font-size: 16px;
    border-bottom: 2px solid lightgrey;
    color: #3c3c3c;
    margin svg {
        margin: 0 5px -2.4px 0;
    }
`;
const BodyWrapper = styled.div`
    background-color: #e5e5e5;
    border: 0;
    height: 100%;
    min-height: 500px;
    padding: 15px;
    width: 100%;
    font-size: 16px;
    font-family: "Nanum Gothic", sans-serif;
    border-bottom: 2px solid lightgrey;
    white-space: pre-wrap;
    line-height: 20px;
`;
const ImageWrapper = styled.div`
    background-color: #e5e5e5;
    border: 0;
    height: 178px;
    padding: 15px;
    width: 100%;
    font-size: 16px;
    border-bottom: 2px solid lightgrey;
`;
const ImageContainer = styled(FlexRow)`
    width: 100%;
    height: 148px;
    justify-content: flex-start;
    overflow-x: auto;
    &::-webkit-scrollbar {
        height: 10px;
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
const Image = styled.img`
    width: 130px;
    height: 130px;
    object-fit: cover;
    margin-left: 15px;
    background-color: #00000011;
    border-radius: 20px;
    transition: all 0.2s linear;
    cursor: pointer;
    &:hover {
        filter: opacity(0.5) drop-shadow(0 0 0 grey);
    }
`;
const TagWrapper = styled(FlexCol)`
    background-color: #e5e5e5;
    border: 0;
    height: 60px;
    padding: 15px;
    width: 100%;
    font-size: 16px;
    align-items: flex-start;
    border-bottom: 2px solid lightgrey;
`;
const TagContainer = styled(FlexRow)`
    width: 100%;
    height: 36px;
    justify-content: flex-start;
    overflow-x: auto;
    overflow-y: hidden;
    &::-webkit-scrollbar {
        height: 7px;
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
const Tag = styled(Link)`
    margin-left: 9px;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.1s linear;
    color: grey;
    &:hover {
        color: black;
    }
`;
const PopupBackground = styled(FlexRow)`
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 250;
    background-color: #000000ca;
    cursor: pointer;
    justify-content: center;
`;
const PopupImage = styled.img`
    max-width: 80vmin;
    max-height: 80vmin;
    z-index: 251;
`;
const ControlWrapper = styled(FlexRow)`
    background-color: #e5e5e5;
    border: 0;
    height: 52px;
    padding: 15px;
    width: 100%;
    font-size: 16px;
    align-items: center;
    border-bottom: 2px solid lightgrey;
`;
const ControlButton = styled(FlexRow)`
    border: 2px solid
        ${(props) => (props.color === "black" ? "grey" : props.color)};
    div {
        color: ${(props) => (props.color === "black" ? "black" : "blue")};
    }
    padding-right: 6px;
    width: 70px;
    height: 40px;
    border-radius: 10px;
    svg {
        margin-left: 5px;
    }
    margin-left: 5px;
    cursor: pointer;
    transition: all 0.15s linear;
    &:hover {
        background-color: lightgrey;
    }
`;
const CommentWrapper = styled.form`
    display: flex;
    align-items: center;
    background-color: #e5e5e5;
    border: 0;
    height: 46px;
    padding: 5px 15px;
    width: 100%;
    font-size: 16px;
    align-items: center;
    border-bottom: 2px solid lightgrey;
    svg {
        width: 25px;
        height: 25px;
        margin-left: 15px;
        cursor: pointer;
        color: grey;
        transition: all 0.15s linear;
        &:hover {
            color: black;
        }
    }
`;
const TextSmallTitle = styled.div`
    width: 100%;
    height: 30px;
    color: #727272;
`;
const CommentInput = styled.input`
    border: 0;
    height: 36px;
    width: 100%;
    padding: 0 7.5px;
`;
const CommentListWrapper = styled(FlexCol)`
    background-color: #e5e5e5;
    border: 0;
    height: 100%;
    padding: 15px;
    width: 100%;
    font-size: 16px;
    align-items: flex-start;
    border-bottom: 2px solid lightgrey;
`;
const CommentItemWrapper = styled(FlexCol)`
    width: 100%;
    padding: 7.5px 0;
    border-top: 1px solid lightgrey;
`;
const CommentItemTitleWrapper = styled.div`
    width: 100%;
    height: 24px;
`;
const CommentItemBodyWrapper = styled.div`
    width: 100%;
    height: 100%;
    font-size: 15px;
    line-height: 17px;
    color: #5e5e5e;
    margin-bottom: 10px;
`;
const CommentItemInfoWrapper = styled(FlexRow)`
    width: 100%;
    height: 18px;
    font-size: 14px;
`;
const CommentItemDate = styled.div`
    width: 100%;
    height: 18px;
    font-size: 14px;
`;
const CommentItemEdit = styled.div`
    width: 40px;
    height: 18px;
    font-size: 14px;
    color: "#6b6b6b";
    cursor: pointer;
`;
const LikeIcon = styled(AiOutlineLike)`
    cursor: pointer;
`;

const Read = () => {
    const {
        post,
        readError,
        removeLoading,
        removeError,
        addCommentLoading,
        addCommentError,
        username,
        nickname,
    } = useSelector(({ post, loading, account }) => ({
        post: post.post,
        readError: post.readError,
        removeLoading: loading["post/REMOVE_POST"],
        removeError: post.removeError,
        addCommentLoading: loading["post/ADDCOMMENT_POST"],
        addCommentError: post.addCommentError,
        username: account.user.username,
        nickname: account.user.nickname,
    }));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { num } = useParams();
    useEffect(() => {
        dispatch(initRemovePostError());
        dispatch(initAddCommentPostError());
        dispatch(readPost(num));
        return () => {
            dispatch(initReadPostError());
            dispatch(initRemovePostError());
            dispatch(initAddCommentPostError());
        };
    }, [dispatch, num]);
    useEffect(() => {
        if (readError) {
            alert(readError.response.data.message);
            navigate("/community");
        } else if (removeError) {
            alert(removeError.response.data.message);
        } else if (removeError === false) {
            navigate("/community");
        } else if (addCommentError) {
            alert(addCommentError.response.data.message);
        } else if (addCommentError === false) {
            dispatch(readPost(num));
        }
        dispatch(initReadPostError());
        dispatch(initRemovePostError());
        dispatch(initAddCommentPostError());
    }, [dispatch, navigate, readError, removeError, addCommentError, num]);
    const [state, setState] = useState(null);
    const [reply, setReply] = useState(null);
    const onClick = (item) => {
        setState(state ? null : item);
    };
    const onSubmitComment = (e) => {
        e.preventDefault();
        const value = document.getElementById(
            "CommentInput_CommunityRead"
        ).value;
        if (value.length > 255) {
            alert("댓글을 255자 이하로 작성해 주세요.");
            return;
        }
        dispatch(
            addCommentPost({
                type: "addComment",
                num: num,
                commentId: "",
                comment: value,
                nickname: nickname,
                username: username,
            })
        );
    };
    const onSubmitReply = (e) => {
        e.preventDefault();
        const value = document.getElementById(
            "CommentInput_CommunityRead" + reply.idx
        ).value;
        if (value.length > 255) {
            alert("답글을 255자 이하로 작성해 주세요.");
            return;
        }
        dispatch(
            addCommentPost({
                type: "addComment",
                num: num,
                commentId: reply.commentId,
                comment: value,
                nickname: nickname,
                username: username,
            })
        );
        setReply(null);
    };
    const DateConvert = (d) => {
        return `${d.substring(0, 4)}년 ${d.substring(5, 7)}월 ${d.substring(
            8,
            10
        )}일 ${d.substring(11, 13)}:${d.substring(14, 16)}`;
    };
    const commentCount = (comment) => {
        var result = 0;
        for (var i = 0; i < comment.length; i++) {
            if (!comment[i].die) result++;
        }
        return result;
    };

    if (post) {
        return (
            <Wrapper>
                <TopPaperWrapper>
                    <Tri />
                </TopPaperWrapper>
                <TitleWrapper>{post.title}</TitleWrapper>
                <UserWrapper>
                    <BsFillPersonFill />
                    {post.nickname}
                </UserWrapper>
                <DateWrapper>
                    {DateConvert(post.publishedDate) +
                        (post.publishedDate === post.lastModifiedDate
                            ? ""
                            : " (수정됨)")}
                </DateWrapper>
                <BodyWrapper>{post.body}</BodyWrapper>
                {post.image.length > 0 && (
                    <ImageWrapper>
                        <ImageContainer>
                            {post.image.map((i) => (
                                <Image
                                    key={i}
                                    src={`${process.env.REACT_APP_API_IMAGEGET}${i}`}
                                    alt="Error"
                                    onClick={() =>
                                        onClick(
                                            `${process.env.REACT_APP_API_IMAGEGET}${i}`
                                        )
                                    }
                                />
                            ))}
                        </ImageContainer>
                    </ImageWrapper>
                )}
                {post.tag.length > 0 && (
                    <TagWrapper>
                        <TagContainer>
                            {post.tag.map((i, idx) => (
                                <Tag key={i} to={`/community?tag=${i}`}>
                                    #{i}
                                </Tag>
                            ))}
                        </TagContainer>
                    </TagWrapper>
                )}
                {state && (
                    <PopupBackground onClick={() => setState(null)}>
                        <PopupImage src={state} alt="PopupImage" />
                    </PopupBackground>
                )}
                <ControlWrapper>
                    <FlexRow>
                        <LikeIcon
                            style={{
                                width: "20px",
                                height: "20px",
                                color: "#ff4d4d",
                            }}
                            onClick={() =>
                                dispatch(
                                    addCommentPost({
                                        type: "like",
                                        num: num,
                                        username: username,
                                    })
                                )
                            }
                        />
                        <div
                            style={{
                                color: "#d53c3c",
                                margin: "0 5px 0 2px",
                            }}
                        >
                            {post.like.length}
                        </div>
                        <AiOutlineComment
                            style={{
                                width: "20px",
                                height: "20px",
                                color: "green",
                            }}
                        />
                        <div
                            style={{
                                color: "green",
                                margin: "0 5px 0 2px",
                            }}
                        >
                            {commentCount(post.comment)}
                        </div>
                    </FlexRow>
                    {username === post.username && (
                        <FlexRow>
                            <Link to={`/community/update/${num}`}>
                                <ControlButton color="#6c6cff">
                                    <BsPencilSquare
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            color: "blue",
                                        }}
                                    />
                                    <div>수정</div>
                                </ControlButton>
                            </Link>
                            <ControlButton
                                color="black"
                                onClick={() => {
                                    if (
                                        window.confirm("정말 삭제하시겠습니까?")
                                    ) {
                                        dispatch(removePost({ num: post.num }));
                                    }
                                }}
                            >
                                <AiOutlineDelete
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        color: "black",
                                    }}
                                />
                                <div>삭제</div>
                            </ControlButton>
                        </FlexRow>
                    )}
                </ControlWrapper>
                {post.comment.length > 0 && (
                    <CommentListWrapper>
                        <TextSmallTitle>댓글</TextSmallTitle>
                        {post.comment.map((i, idx) =>
                            i.die ? (
                                <CommentItemWrapper
                                    key={idx}
                                    style={{ alignItems: "flex-start" }}
                                >
                                    삭제된 댓글입니다.
                                </CommentItemWrapper>
                            ) : (
                                <FlexRow key={idx} style={{ width: "100%" }}>
                                    {i.reply && (
                                        <BsFillReplyFill
                                            style={{
                                                transform: `rotate( 180deg )`,
                                                width: "20px",
                                                height: "20px",
                                                color: "grey",
                                            }}
                                        />
                                    )}
                                    <CommentItemWrapper
                                        key={idx}
                                        style={
                                            i.reply
                                                ? {
                                                      width: "calc(100% - 30px)",
                                                  }
                                                : { width: "100%" }
                                        }
                                    >
                                        <CommentItemTitleWrapper>
                                            {i.nickname}
                                        </CommentItemTitleWrapper>
                                        <CommentItemBodyWrapper>
                                            {i.comment}
                                        </CommentItemBodyWrapper>
                                        <CommentItemInfoWrapper>
                                            <CommentItemDate>
                                                {i.date &&
                                                    i.date.substring(2, 19)}
                                            </CommentItemDate>

                                            <FlexRow>
                                                <CommentItemEdit
                                                    onClick={() => {
                                                        setReply(
                                                            reply
                                                                ? reply.idx ===
                                                                  idx
                                                                    ? null
                                                                    : {
                                                                          idx: idx,
                                                                          commentId:
                                                                              i.commentId,
                                                                      }
                                                                : {
                                                                      idx: idx,
                                                                      commentId:
                                                                          i.commentId,
                                                                  }
                                                        );
                                                    }}
                                                >
                                                    답글
                                                </CommentItemEdit>
                                                {i.username === username && (
                                                    <CommentItemEdit
                                                        onClick={() => {
                                                            if (
                                                                window.confirm(
                                                                    "댓글을 삭제하시겠습니까?"
                                                                )
                                                            ) {
                                                                dispatch(
                                                                    addCommentPost(
                                                                        {
                                                                            type: "removeComment",
                                                                            num: num,
                                                                            commentId:
                                                                                i.commentId,
                                                                        }
                                                                    )
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        삭제
                                                    </CommentItemEdit>
                                                )}
                                            </FlexRow>
                                        </CommentItemInfoWrapper>
                                        {reply && idx === reply.idx && (
                                            <CommentWrapper
                                                onSubmit={onSubmitReply}
                                            >
                                                <CommentInput
                                                    id={
                                                        "CommentInput_CommunityRead" +
                                                        idx
                                                    }
                                                    placeholder="답글을 입력하세요."
                                                />
                                                <BsArrowReturnRight
                                                    onClick={onSubmitReply}
                                                />
                                            </CommentWrapper>
                                        )}
                                    </CommentItemWrapper>
                                </FlexRow>
                            )
                        )}
                    </CommentListWrapper>
                )}
                <CommentWrapper onSubmit={onSubmitComment}>
                    <CommentInput
                        id="CommentInput_CommunityRead"
                        placeholder="댓글을 입력하세요."
                    />
                    <BsArrowReturnRight onClick={onSubmitComment} />
                </CommentWrapper>
            </Wrapper>
        );
    } else {
        return (
            <Wrapper
                style={{
                    height: "calc(100vh - 45px)",
                    justifyContent: "center",
                }}
            >
                <Loading r="100px" />
            </Wrapper>
        );
    }
};

export default Read;
