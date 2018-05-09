/**
 * Created by ecarx on 2017/8/17.
 */
import request from '../utils/request';
import * as constSet from './../utils/constSet';
export function fetch(values) {
  // return request('http://ucenter.beta.xchanger.cn/auth/login', {
  return request(constSet.API_AUTH+'login', {
    method: 'POST',
    data: values,
    type: 'noToken',
    api:'login'
  });
}
export function getCode() {
  return request(constSet.API_AUTH+'identifying_code', {
    method: 'GET',
    type: 'noToken'
  });
}
export function refreshToken() {
  return request(constSet.API_AUTH+'refresh', {
    method: 'POST',
    type: 'noToken',
    api: 'refreshToken',
    data:{
      accessToken: localStorage.accessToken,
      refreshToken: localStorage.refreshToken
    }
  });
}
export function changePassword(values) {
        console.log('service-values',values);
  return request('/ecarx_user/modify_passwd',{
    method: 'Post',
    data: values
  })
}
export function logout(){
  return request('/ecarx_user/logout',{
    method: 'Post'
  })
}
