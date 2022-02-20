import React, { useEffect, useReducer, useRef } from "react";
import styled from "styled-components";
import { BsPlus, BsPlusSquareDotted } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { initUpdatePostError, updatePost } from "modules/post";
import { useNavigate, useParams } from "react-router-dom";
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
const TitleWrapper = styled.input`
    background-color: #e5e5e5;
    border: 0;
    height: 50px;
    padding: 15px;
    width: 100%;
    font-size: 18px;
    border-bottom: 2px solid lightgrey;
    font-weight: 700;
`;
const BodyWrapper = styled.textarea`
    background-color: #e5e5e5;
    border: 0;
    height: 500px;
    padding: 15px;
    width: 100%;
    font-size: 16px;
    font-family: "Nanum Gothic", sans-serif;
    border-bottom: 2px solid lightgrey;
`;
const ImageWrapper = styled.div`
    background-color: #e5e5e5;
    border: 0;
    height: 210px;
    padding: 15px;
    width: 100%;
    font-size: 16px;
    border-bottom: 2px solid lightgrey;
`;
const TextSmallTitle = styled.div`
    width: 100%;
    height: 30px;
    color: #727272;
`;
const AddImageButton = styled(FlexRow)`
    width: 130px;
    min-width: 130px;
    height: 130px;
    border: 4px dashed #999999;
    border-radius: 20px;
    justify-content: center;
    transition: all 0.2s linear;
    background-color: #f0f0f0;
    cursor: pointer;
    &:hover {
        border: 4px dashed #6a6a6a;
        background-color: #e1e1e1;
    }
`;
const PlusIcon = styled(BsPlus)`
    width: 40px;
    height: 40px;
    color: #999999;
    transition: all 0.2s linear;
    cursor: pointer;
    &:hover {
        color: #6a6a6a;
    }
`;
const FileInput = styled.input`
    display: none;
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
        filter: opacity(0.5) drop-shadow(0 0 0 red);
    }
`;
const TagWrapper = styled(FlexCol)`
    background-color: #e5e5e5;
    border: 0;
    height: 130px;
    padding: 15px;
    width: 100%;
    font-size: 16px;
    align-items: flex-start;
    border-bottom: 2px solid lightgrey;
`;
const TagForm = styled.form`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
`;
const TagContainer = styled(FlexRow)`
    width: 100%;
    height: 36px;
    justify-content: flex-start;
    margin-top: 2px;
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
const TagSmallText = styled.div`
    font-size: 20px;
    font-weight: 700;
    margin: 0 5px;
`;
const TagInput = styled.input`
    background-color: #e5e5e5;
    border: 0;
    height: 25px;
    padding: 0 5px;
    margin-top: 1px;
    width: 100%;
    max-width: 120px;
    font-size: 16px;
    border-bottom: 2px solid lightgrey;
`;
const TagPlusIcon = styled(BsPlusSquareDotted)`
    margin-left: 7.5px;
    width: 25px;
    height: 25px;
    transition: all 0.2s linear;
    color: #6a6a6a;
    cursor: pointer;
    &:hover {
        color: #2c2c2c;
    }
`;
const Tag = styled.div`
    margin-left: 9px;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.1s linear;
    &:hover {
        color: #ff343d;
    }
`;
const SubmitWrapper = styled(FlexRow)`
    justify-content: center;
    background-color: #e5e5e5;
    border: 0;
    height: 120px;
    padding: 15px;
    width: 100%;
    font-size: 16px;
`;
const SubmitButton = styled.div`
    font-size: 36px;
    font-family: "Caveat", cursive;
    color: #505050;
    transition: all 0.15s linear;
    cursor: pointer;
    &:hover {
        color: black;
    }
`;

const reducer = (state, action) => {
    switch (action.name) {
        case "title":
            return {
                ...state,
                [action.name]: action.target.value.substring(0, 30),
            };
        case "body":
            return {
                ...state,
                [action.name]: action.target.value,
            };
        case "addImage":
            return {
                ...state,
                image: state.image.concat(action.id),
            };
        case "removeImage":
            return {
                ...state,
                image: state.image.filter((i, idx) => idx !== action.idx),
            };
        case "addTag":
            return {
                ...state,
                tag: state.tag.concat(action.tag),
            };
        case "removeTag":
            return {
                ...state,
                tag: state.tag.filter((i, idx) => idx !== action.idx),
            };
        default:
            break;
    }
};
const Update = () => {
    const { username, nickname, updateLoading, updateError, post } =
        useSelector(({ account, loading, post }) => ({
            username: account.user.username,
            nickname: account.user.nickname,
            updateLoading: loading["post/UPDATE_POST"],
            updateError: post.updateError,
            post: post.post,
        }));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { num } = useParams();
    const [state, stateDispatch] = useReducer(reducer, post);
    const imageUploadLoading = useRef(false);
    const imageUpload = async (e) => {
        if (imageUploadLoading.current) {
            alert("이미지를 업로드하는 중입니다.");
            return;
        }
        imageUploadLoading.current = true;
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        await axios
            .post(`${process.env.REACT_APP_API_IMAGEPOST}`, formData, {
                withCredentials: true,
            })
            .then((response) => {
                stateDispatch({ name: "addImage", id: response.data.id });
            })
            .catch((error) => {
                alert("이미지 업로드 실패");
            });
        imageUploadLoading.current = false;
    };
    const imageRemove = (idx) => {
        stateDispatch({ name: "removeImage", idx: idx });
    };
    const addTag = (e) => {
        e.preventDefault();
        const tag = document.getElementById("TagInput_CommunityWrite").value;
        if (tag.length < 2 || tag.length > 8) {
            alert("2~8글자로 입력해 주세요.");
            return;
        } else if (state.tag.indexOf(tag) !== -1) {
            alert("이미 있는 태그입니다.");
            return;
        } else if (state.tag.length >= 5) {
            alert("태그는 5개까지 등록 가능합니다.");
            return;
        }
        document.getElementById("TagInput_CommunityWrite").value = "";
        stateDispatch({ name: "addTag", tag: tag });
    };
    const removeTag = (idx) => {
        stateDispatch({ name: "removeTag", idx: idx });
    };
    useEffect(() => {
        if (!post || post.username !== username) {
            alert("권한이 없습니다.");
            navigate("/community");
        }
        dispatch(initUpdatePostError());
        return () => {
            dispatch(initUpdatePostError());
        };
    }, [dispatch, navigate, post, username]);
    useEffect(() => {
        if (updateError) {
            alert(updateError.response.data.message);
        } else if (updateError === false) {
            navigate(`/community/read/${num}`);
        }
    }, [navigate, nickname, num, updateError]);
    const onSubmit = () => {
        var submitValue = {
            num: num,
            username: username,
            nickname: nickname,
            title: state.title,
            body: state.body,
            image: state.image,
            tag: state.tag,
        };
        dispatch(updatePost(submitValue));
    };

    if (post) {
        return (
            <Wrapper>
                <TopPaperWrapper>
                    <Tri />
                </TopPaperWrapper>
                <TitleWrapper
                    placeholder="제목"
                    onChange={(e) =>
                        stateDispatch({
                            name: "title",
                            target: { value: e.target.value },
                        })
                    }
                    value={state.title}
                />
                <BodyWrapper
                    placeholder="내용"
                    onChange={(e) =>
                        stateDispatch({
                            name: "body",
                            target: { value: e.target.value },
                        })
                    }
                    value={state.body}
                />
                <ImageWrapper>
                    <TextSmallTitle>이미지</TextSmallTitle>
                    <FileInput
                        type="file"
                        id="FileInput_CommunityWrite"
                        onChange={imageUpload}
                        multiple
                    />
                    <ImageContainer>
                        <AddImageButton
                            onClick={() => {
                                if (state.image.length >= 5) {
                                    alert(
                                        "이미지는 5장까지만 업로드 가능합니다."
                                    );
                                } else {
                                    document
                                        .getElementById(
                                            "FileInput_CommunityWrite"
                                        )
                                        .click();
                                }
                            }}
                        >
                            <PlusIcon />
                        </AddImageButton>
                        {state.image.map((i, idx) => (
                            <Image
                                key={i}
                                src={`${process.env.REACT_APP_API_IMAGEGET}${i}`}
                                alt="Error"
                                onClick={() => imageRemove(idx)}
                            />
                        ))}
                    </ImageContainer>
                </ImageWrapper>
                <TagWrapper>
                    <TextSmallTitle>태그</TextSmallTitle>
                    <TagForm onSubmit={addTag}>
                        <TagSmallText>#</TagSmallText>
                        <TagInput
                            id="TagInput_CommunityWrite"
                            placeholder="태그"
                        />
                        <TagPlusIcon onClick={addTag} />
                    </TagForm>
                    {state.tag.length > 0 ? (
                        <TagContainer>
                            {state.tag.map((i, idx) => (
                                <Tag key={i} onClick={() => removeTag(idx)}>
                                    #{i}
                                </Tag>
                            ))}
                        </TagContainer>
                    ) : (
                        <div></div>
                    )}
                </TagWrapper>
                <SubmitWrapper>
                    {updateLoading ? (
                        <Loading r="40px" />
                    ) : (
                        <SubmitButton onClick={onSubmit}>Upload</SubmitButton>
                    )}
                </SubmitWrapper>
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

export default Update;
