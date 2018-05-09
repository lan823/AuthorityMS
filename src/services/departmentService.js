/**
 * Created by ecarx on 2017/8/18.
 */
import request from '../utils/request';

export function createDepartment(values) {
  return request('ecarx_deparment/insert', {
    method: 'POST',
    data: values
  });
}
export function enableDepartment(id) {
  return request(`ecarx_deparment/enable/${id}`, {
    method: 'POST'
  });
}
export function disableDepartment(id) {
  return request(`ecarx_deparment/disable/${id}`, {
    method: 'POST'
  });
}
export function updateDepartment(values) {
  return request('ecarx_deparment/update', {
    method: 'POST',
    data:values
  });
}
export function queryDepartment() {
  return request(`ecarx_deparment/${id}`, {
    method: 'GET'
  });
}
export function queryDepartmentList(values) {
  values.pageSize = values.pageSize || 10;
  return request(`ecarx_deparments`, {
    method: 'POST',
    data:values
  });
}

