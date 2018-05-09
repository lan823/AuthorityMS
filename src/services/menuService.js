/**
 * Created by ecarx on 2017/8/18.
 */
import request from '../utils/request';

export function createMenu(values) {
  return request('ecarx_menu/insert', {
    method: 'POST',
    data: values
  });
}
export function enableMenu(id) {
  return request(`ecarx_menu/enable/${id}`, {
    method: 'POST'
  });
}
export function disableMenu(id) {
  return request(`ecarx_menu/disable/${id}`, {
    method: 'POST'
  });
}
export function updateMenu(values) {
  return request('ecarx_menu/update', {
    method: 'POST',
    data:values
  });
}
export function queryMenu() {
  return request(`ecarx_menu/${id}`, {
    method: 'GET'
  });
}
export function queryMenuList(values) {
  values.pageSize =  values.pageSize || 10;
  return request(`ecarx_menus`, {
    method: 'POST',
    data:values
  });
}

