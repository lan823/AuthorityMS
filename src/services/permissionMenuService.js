/**
 * Created by ecarx on 2017/8/21.
 */
import request from '../utils/request';

export function createPermissionMenu(values) {
  return request('ecarx_menu_permission/insert', {
    method: 'POST',
    data: values
  });
}
export function createPermissionMenus(values) {
  return request('ecarx_menu_permission/insertMany', {
    method: 'POST',
    data: values
  });
}
export function deletePermissionMenu(values) {
  return request('ecarx_menu_permission/delete', {
    method: 'POST',
    data: values
  });
}
export function deletePermissionMenus(values) {
  return request('ecarx_menu_permission/deleteMany', {
    method: 'POST',
    data: values
  });
}
export function updatePermissionMenu(values) {
  return request('ecarx_menu_permission/update', {
    method: 'POST',
    data:values
  });
}
export function queryPermissionMenu() {
  return request(`ecarx_menu_permission/${id}`, {
    method: 'GET'
  });
}
export function queryPermissionMenuList(values) {
  values.pageSize = 1000;
  return request(`ecarx_menu_permissions`, {
    method: 'POST',
    data:values
  });
}

