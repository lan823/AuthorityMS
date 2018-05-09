/**
 * Created by ecarx on 2017/8/18.
 */
import request from '../utils/request';

export function create(values) {
  return request('ecarx_permission/insert', {
    method: 'POST',
    data: values
  });
}
export function enablePermission(id) {
  return request(`ecarx_permission/enable/${id}`, {
    method: 'POST'
  });
}
export function disablePermission(id) {
  return request(`ecarx_permission/disable/${id}`, {
    method: 'POST'
  });
}
export function updatePermission(values) {
  return request('ecarx_permission/update', {
    method: 'POST',
    data:values
  });
}
export function queryPermissionList(values) {
  if(!values.pageSize){
    values.pageSize = 10;
  }
  return request(`ecarx_permissions`, {
    method: 'POST',
    data:values
  });
}
