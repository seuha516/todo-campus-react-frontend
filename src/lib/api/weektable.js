import client from './client';

export const getList = ({ username }) => client.post('weektable/getlist/', { username });
export const insert = (data) => client.post('weektable/insert/', data);
export const update = (data) => client.post('weektable/update/', data);
export const remove = ({ num }) => client.post('weektable/delete/', { num });
