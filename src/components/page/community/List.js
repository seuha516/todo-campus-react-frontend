import Loading from "components/etc/Loading";
import { initListPostError, listPost } from "modules/post";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { AiOutlineLike, AiOutlineComment } from "react-icons/ai";
import qs from "qs";

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
    -ms-user-select: none;
    -moz-user-select: -moz-none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    user-select: none;
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
const TitleWrapper = styled(FlexRow)`
    background-color: #e5e5e5;
    border: 0;
    height: 60px;
    padding: 15px;
    width: 100%;
    border-bottom: 2px solid lightgrey;
    justify-content: flex-start;
    font-family: "Noto Serif KR", serif;
`;
const TitleTilte = styled(Link)`
    font-size: 22px;
    font-weight: 700;
`;
const TitlePage = styled.div`
    font-size: 16px;
    margin: 6px 0 0 12px;
`;
const TitleTag = styled.div`
    font-size: 16px;
    margin: 6px 0 0 7px;
`;
const PostContainer = styled(FlexCol)`
    width: 100%;
    background-color: #e5e5e5;
    min-height: 635px;
    justify-content: flex-start;
`;
const PostWrapper = styled(Link)`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background-color: #e5e5e5;
    border: 0;
    width: 100%;
    height: 125px;
    padding: 12.5px 10px;
    border-bottom: 2px solid lightgrey;
    align-items: flex-start;
    transition: all 0.15s linear;
    cursor: pointer;
    &:hover {
        background-color: #c1c1c1;
    }
`;
const PostTitle = styled.div`
    width: 100%;
    font-size: 20px;
    line-height: 20px;
    height: 20px;
    overflow: hidden;
`;
const PostBody = styled.div`
    width: 100%;
    font-size: 16px;
    line-height: 18px;
    height: 36px;
    color: #545454;
    overflow: hidden;
    word-break: break-all;
`;
const PostInfo = styled(FlexRow)`
    font-size: 14px;
    line-height: 18px;
    height: 18px;
    color: #242424;
    width: 100%;
`;
const PostNickname = styled.div`
    margin-right: 5px;
`;
const PostPublishedDate = styled.div`
    color: grey;
`;
const PostInfoRight = styled(FlexRow)`
    font-size: 15px;
    svg {
        width: 16px;
        height: 16px;
        margin-right: 2px;
    }
`;
const ControlWrapper = styled(FlexRow)`
    background-color: #e5e5e5;
    width: 100%;
    border: 0;
    height: 60px;
    padding: 15px;
    width: 100%;
    border-bottom: 2px solid lightgrey;
`;
const PageControl = styled(Link)`
    height: 100%;
    font-size: 22px;
    margin-top: 3px;
    font-family: "Noto Serif KR", serif;
    transition: all 0.15s linear;
    color: #5b5b5b;
    &:hover {
        color: black;
    }
`;
const WriteButton = styled(Link)`
    width: 80px;
    height: 100%;
    font-size: 22px;
    margin-top: 3px;
    font-family: "Noto Serif KR", serif;
    transition: all 0.15s linear;
    color: #5b5b5b;
    &:hover {
        color: black;
    }
`;

const List = () => {
    const { list, error } = useSelector(({ post }) => ({
        list: post.list,
        error: post.listError,
    }));
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(listPost(location.search));
        return () => {
            dispatch(initListPostError());
        };
    }, [dispatch, location.search]);
    useEffect(() => {
        if (error) {
            alert(error.response.data.message);
            navigate("/community");
        }
    }, [error, navigate]);
    const DateConvert = (d) => {
        d = new Date(d);
        if (new Date().getFullYear() === d.getFullYear()) {
            return `${d.getMonth() + 1}월 ${d.getDate()}일`;
        } else {
            return `${d.getFullYear()}년 ${
                d.getMonth() + 1
            }월 ${d.getDate()}일`;
        }
    };
    var { page, tag } = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });
    page = page ? parseInt(page) : 1;
    const commentCount = (comment) => {
        var result = 0;
        for (var i = 0; i < comment.length; i++) {
            if (!comment[i].die) result++;
        }
        return result;
    };

    if (list) {
        return (
            <Wrapper>
                <TopPaperWrapper>
                    <Tri />
                </TopPaperWrapper>
                <TitleWrapper>
                    <TitleTilte to="/community">자유게시판</TitleTilte>
                    <TitlePage>{page + " 페이지"}</TitlePage>
                    <TitleTag>{tag ? `#${tag}` : ""}</TitleTag>
                </TitleWrapper>
                <PostContainer>
                    {list.map((i) => (
                        <PostWrapper
                            key={i.num}
                            to={`/community/read/${i.num}`}
                        >
                            <PostTitle>{i.title}</PostTitle>
                            <PostBody>
                                {i.body.replace(/(\n|\r\n)/g, " ")}
                            </PostBody>
                            <PostInfo>
                                <FlexRow>
                                    <PostNickname>{i.nickname}</PostNickname>
                                    <PostPublishedDate>
                                        {DateConvert(i.publishedDate)}
                                    </PostPublishedDate>
                                </FlexRow>
                                <PostInfoRight>
                                    <AiOutlineLike />
                                    {i.like.length}
                                    <AiOutlineComment
                                        style={{ marginLeft: "5px" }}
                                    />
                                    {commentCount(i.comment)}
                                </PostInfoRight>
                            </PostInfo>
                        </PostWrapper>
                    ))}
                </PostContainer>
                <ControlWrapper>
                    {page > 1 ? (
                        <PageControl
                            to={
                                tag
                                    ? `/community?page=${page - 1}&tag=${tag}`
                                    : `/community?page=${page - 1}`
                            }
                        >
                            이전
                        </PageControl>
                    ) : (
                        <div style={{ width: "42.52px" }}></div>
                    )}
                    <WriteButton to="./write">글쓰기</WriteButton>
                    <PageControl
                        to={
                            tag
                                ? `/community?page=${page + 1}&tag=${tag}`
                                : `/community?page=${page + 1}`
                        }
                    >
                        다음
                    </PageControl>
                </ControlWrapper>
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

export default List;
