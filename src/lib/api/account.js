import client from "./client";

export const register = (user) => client.post("account/register/", user);
export const login = (user) => client.post("account/login/", user);
