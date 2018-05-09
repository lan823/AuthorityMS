/**
 * Created by wyc on 2017/08/17.
 */
import request from '../utils/request';

export function query(values) {
  values.pageSize = 10;
  return request('/ecarx_system_applications', {
    method: 'POST',
    data: values,
  });
}
export function create(values) {
  return request(`/ecarx_system_application/insert`, {
    method: 'POST',
    data: values,
  });
}
export function update(values) {
  return request('/ecarx_system_application/update', {
    method: 'POST',
    data: values
  });
}
export function patch(id, values) {
  return request(`/ecarx_system_application/${id}`, {
    method: 'GET',
    data: values,
  });
} 
export function enable(values) {
  return request(`/ecarx_system_application/enable/${values.id}`, {
    method: 'POST',
  });
}
export function disable(values) {
  return request(`/ecarx_system_application/disable/${values.id}`, {
    method: 'POST',
  });
}















