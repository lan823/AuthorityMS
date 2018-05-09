/**
 * Created by ecarx on 2017/8/17.
 */
import request from '../utils/request';

export function query(values) {
  return request('/ecarx_roles', {
    method: 'POST',
    data: values,
  });
}
export function createRole(values) {
  return request('ecarx_role/insert', {
    method: 'POST',
    data: values
  });
}
export function enableRole(id) {
  return request(`ecarx_role/enable/${id}`, {
    method: 'POST'
  });
}
export function disableRole(id) {
  return request(`ecarx_role/disable/${id}`, {
    method: 'POST'
  });
}
export function updateRole(values) {
  return request('ecarx_role/update', {
    method: 'POST',
    data:values
  });
}
export function queryRole() {
  return request(`ecarx_role/${id}`, {
    method: 'GET'
  });
}
export function queryRoleList(values) {
  return request(`ecarx_roles`, {
    method: 'POST',
    data:values
  });
}
