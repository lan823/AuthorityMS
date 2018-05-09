/**
 * Created by ecarx on 2017/8/17.
 */
import request from '../utils/request';

export function createManyRole(values) {
  return request('ecarx_role_permission/insertMany', {
    method: 'POST',
    data: values
  });
}
export function createRole(values) {
  return request('ecarx_role_permission/insert', {
    method: 'POST',
    data: values
  });
}
export function deleteRole() {
  return request('ecarx_role_permission/delete', {
    method: 'GET'
  });
}
export function updateRole() {
  return request('ecarx_role_permission/update', {
    method: 'POST'
  });
}
export function queryRole() {
  return request(`ecarx_role_permission/${id}`, {
    method: 'GET'
  });
}
export function queryRoleList() {
  return request(`ecarx_role_permissions`, {
    method: 'POST'
  });
}
