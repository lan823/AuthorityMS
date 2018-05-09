/**
 * Created by ecarx on 2017/8/21.
 */
import request from '../utils/request';

export function createUserPost(values) {
  return request('ecarx_user_post/insert', {
    method: 'POST',
    data: values
  });
}
export function createUserPosts(values) {
  return request('ecarx_user_post/insertMany', {
    method: 'POST',
    data: values
  });
}
export function deleteUserPost(values) {
  return request('ecarx_user_post/delete', {
    method: 'POST',
    data: values
  });
}
export function deleteUserPosts(values) {
  return request('ecarx_user_post/deleteMany', {
    method: 'POST',
    data: values
  });
}
export function updateUserPost(values) {
  return request('ecarx_user_post/update', {
    method: 'POST',
    data:values
  });
}
export function queryUserPost() {
  return request(`ecarx_user_post/${id}`, {
    method: 'GET'
  });
}
export function queryUserPostList(values) {
  return request(`ecarx_user_posts`, {
    method: 'POST',
    data:values
  });
}

