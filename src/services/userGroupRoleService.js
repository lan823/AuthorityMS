/**
 * Created by ecarx on 2017/8/28.
 */
import request from '../utils/request';

export function createUserGroupRole(values) {
  return request('ecarx_post_role/insert', {
    method: 'POST',
    data: values
  });
}
export function createUserGroupRoles(values) {
  let keys,postId = values.postId,roleIds = values.roleIds;
  keys= roleIds.map(item=>{
    if(item.indexOf('-')===1){
      return {postId:postId,roleId:item.split('-')[1]};
    }
  });
  return request('ecarx_post_role/insertMany', {
    method: 'POST',
    data: keys
  });
}
export function deleteUserGroupRole(values) {
  return request('ecarx_post_role/delete', {
    method: 'POST',
    data: {id:values}
  });
}
export function deleteUserGroupRoles(values) {
  return request('ecarx_post_role/deleteMany', {
    method: 'POST',
    data: values
  });
}
export function updateUserGroupRole(values) {
  return request('ecarx_post_role/update', {
    method: 'POST',
    data:values
  });
}
export function queryUserGroupRole() {
  return request(`ecarx_post_role/${id}`, {
    method: 'GET'
  });
}
export function queryUserGroupRoleList(values) {
  values.pageSize = 1000;
  return request(`ecarx_post_roles`, {
    method: 'POST',
    data:values
  });
}


