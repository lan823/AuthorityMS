/**
 * Created by ecarx on 2017/8/18.
 */
import request from '../utils/request';

export function createOperation(values) {
  return request('ecarx_operation/insert', {
    method: 'POST',
    data: values
  });
}
export function enableOperation(id) {
  return request(`ecarx_operation/enable/${id}`, {
    method: 'POST'
  });
}
export function disableOperation(id) {
  return request(`ecarx_operation/disable/${id}`, {
    method: 'POST'
  });
}
export function updateOperation(values) {
  return request('ecarx_operation/update', {
    method: 'POST',
    data:values
  });
}
export function queryOperation() {
  return request(`ecarx_operation/${id}`, {
    method: 'GET'
  });
}
export function queryOperationList(values) {
  return request(`ecarx_operations`, {
    method: 'POST',
    data:values
  });
}
