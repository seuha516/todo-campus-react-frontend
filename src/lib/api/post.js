import client from "./client";

export const list = (query) => client.get(`post/list${query}`);
export const read = (num) => client.get(`post/read/${num}`);
export const write = (post) => client.post("post/write/", post);
export const update = (post) => client.post(`post/update/`, post);
export const remove = ({ num }) => client.post(`post/remove/`, { num });
export const addComment = (comment) => client.post(`post/addcomment/`, comment);
