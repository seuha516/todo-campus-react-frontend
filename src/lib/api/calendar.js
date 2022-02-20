import client from './client';

export const getList = ({ username, year, month }) => client.post('calendar/getlist/', { username, year, month });
export const insert = (data) => client.post('calendar/insert/', data);
export const update = (data) => client.post('calendar/update/', data);
export const remove = ({ num }) => client.post('calendar/delete/', { num });
