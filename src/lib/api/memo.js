import client from "./client";

export const list = ({ username }) => client.post("memo/list/", { username });
export const write = (data) => client.post("memo/write/", data);
export const update = (data) => client.post("memo/update/", data);
export const remove = ({ num }) => client.post("memo/remove/", { num });
