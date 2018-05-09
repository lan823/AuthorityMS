/**
 * Created by ecarx on 2017/8/21.
 */
import request from '../utils/request';

export function createRolePermission(values) {
  return request('ecarx_role_permission/insert', {
    method: 'POST',
    data: values
  });
}
export function createRolePermissions(values) {
  return request('ecarx_role_permission/insertMany', {
    method: 'POST',
    data: values
  });
}
export function deleteRolePermission(values) {
  return request('ecarx_role_permission/delete', {
    method: 'POST',
    data: values
  });
}
export function deleteRolePermissions(values) {
  return request('ecarx_role_permission/deleteMany', {
    method: 'POST',
    data: values
  });
}
export function updateRolePermission(values) {
  return request('ecarx_role_permission/update', {
    method: 'POST',
    data:values
  });
}
export function queryRolePermission() {
  return request(`ecarx_role_permission/${id}`, {
    method: 'GET'
  });
}
export function queryRolePermissionList(values) {
  values.pageSize = 1000;
  return request(`ecarx_role_permissions`, {
    method: 'POST',
    data:values
  });
}

