/**
 * Created by ecarx on 2017/8/18.
 */
import request from '../utils/request';

export function createRegister(values) {
  return request('ecarx_app/insert', {
    method: 'POST',
    data: values
  });
}
export function updateRegister(values) {
  return request('ecarx_app/update', {
    method: 'POST',
    data:values
  });
}
export function queryRegister() {
  return request(`ecarx_Register/${id}`, {
    method: 'GET'
  });
}
export function queryRegisterList(values) {
  return request(`ecarx_apps`, {
    method: 'POST',
    data:values
  });
}
