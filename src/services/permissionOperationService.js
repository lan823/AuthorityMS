/**
 * Created by ecarx on 2017/8/21.
 */
import request from '../utils/request';

export function createPermissionOperation(values) {
  return request('ecarx_operation_permission/insert', {
    method: 'POST',
    data: values
  });
}
export function createPermissionOperations(values) {
  return request('ecarx_operation_permission/insertMany', {
    method: 'POST',
    data: values
  });
}
export function deletePermissionOperation(values) {
  return request('ecarx_operation_permission/delete', {
    method: 'POST',
    data: values
  });
}
export function deletePermissionOperations(values) {
  return request('ecarx_operation_permission/deleteMany', {
    method: 'POST',
    data: values
  });
}
export function updatePermissionOperation(values) {
  return request('ecarx_operation_permission/update', {
    method: 'POST',
    data:values
  });
}
export function queryPermissionOperation() {
  return request(`ecarx_operation_permission/${id}`, {
    method: 'GET'
  });
}
export function queryPermissionOperationList(values) {
  values.pageSize = 1000;
  return request(`ecarx_operation_permissions`, {
    method: 'POST',
    data:values
  });
}

