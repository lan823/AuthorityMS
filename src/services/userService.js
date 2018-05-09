/**
 * Created by man on 2017/08/15.
 */
import request from '../utils/request';

export function query(values) {
  values.pageSize =  values.pageSize || 10;
  return request('/ecarx_users', {
    method: 'POST',
    data: values,
  });
}
export function create(values) {
  return request(`/ecarx_user/insert`, {
    method: 'POST',
    data: values,
  });
}
export function update(values) {
  return request('/ecarx_user/update', {
    method: 'POST',
    data: values,
  });
}
export function patch(id, values) {
  return request(`/ecarx_user/${id}`, {
    method: 'GET',
    data: values,
  });
}
export function enable(values) {
  return request(`/ecarx_user/enable/${values.id}`, {
    method: 'POST',
  });
}
export function disable(values) {
  return request(`/ecarx_user/disable/${values.id}`, {
    method: 'POST',
  });
}
// export function chooseRole(values) {
//   return request(`/ecarx_user_post/insertMany`, {
//     method: 'POST',
//     data: values,
//   });
// }
export function chooseDepartment(values) {
  return request(`/ecarx_user_deparment/insertMany`, {
    method: 'POST',
    data: values,
  });
}
export function getUserRole(values) {
  return request(`ecarx_user_roles`, {
    method: 'POST',
    data: values,
  });
}
export function createUserRoles(values) {
  return request(`ecarx_user_role/insertMany`, {
    method: 'POST',
    data: values,
  });
}
export function createUserRole(values) {
  return request(`ecarx_user_role/insert`, {
    method: 'POST',
    data: values,
  });
}
export function deleteUserRole(values) {
  return request(`ecarx_user_role/delete`, {
    method: 'POST',
    data: values,
  });
}
export function deleteUserRoles(values) {
  return request(`ecarx_user_role/deleteMany`, {
    method: 'POST',
    data: values,
  });
}










