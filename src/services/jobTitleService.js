/**
 * Created by ecarx on 2017/8/19.
 */
import request from '../utils/request';

export function createPost(values) {
  return request('ecarx_post/insert', {
    method: 'POST',
    data: values
  });
}
export function enablePost(id) {
  return request(`ecarx_post/enable/${id}`, {
    method: 'POST'
  });
}
export function disablePost(id) {
  return request(`ecarx_post/disable/${id}`, {
    method: 'POST'
  });
}
export function updatePost(values) {
  return request('ecarx_post/update', {
    method: 'POST',
    data:values
  });
}
export function queryPost() {
  return request(`ecarx_post/${id}`, {
    method: 'GET'
  });
}
export function queryPostList(values) {
  values.pageSize = values.pageSize || 10;
  return request(`ecarx_posts`, {
    method: 'POST',
    data:values
  });
}
