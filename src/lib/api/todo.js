import client from "./client";

export const list = (data) => client.post(`todo/list/`, data);
export const write = (todo) => client.post("todo/write/", todo);
export const update = (todo) => client.post(`todo/update/`, todo);
export const remove = ({ num }) => client.post(`todo/remove/`, { num });
