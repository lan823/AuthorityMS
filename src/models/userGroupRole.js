/**
 * Created by ecarx on 2017/8/28.
 */
import { routerRedux } from 'dva/router';
import * as userGroupRoleService from '../services/userGroupRoleService';
export default {
  namespace: 'userGroupRole',
  state: {
    list: [],
    pagination:{},
    totalPageCount: 0,
    loading:true
  },
  reducers: {
    save(state, { payload: { data: list,totalPageCount,loading,pagination} }) {
      return { ...state, list, totalPageCount,loading,pagination};
    }
  },
  effects: {
    *query({ payload: params }, { call, put,select }) {
      const { id } = yield select(state=>state.jobTitle.currentRow);
      params.permissionId = id;
      const response = yield call(userGroupRoleService.queryUserGroupRoleList, params);
      yield put({
        type: 'save',
        payload: {
          data:response.data || [],
          totalPageCount:response.totalPageCount,
          pagination:{
            current:response.pageIndex+1,
            pageIndex:response.pageIndex,
            // pageSize: response.pageSize,
            showQuickJumper: response.totalPageCount>1,
            total: response.record
          },
          currentRow:{},
          loading:false
        },
      });
    },
    *update({ payload: values}, { call, put }) {
      yield call(userGroupRoleService.updateUserGroupRole,values);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *create({ payload: values }, { call, put }) {
      yield call(userGroupRoleService.createUserGroupRole, values);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *createMany({ payload: values }, { call, put,select }) {
      let params={};
      const { id } = yield select(state=>state.jobTitle.currentRow);
      params.postId = id;
      params.roleIds = values;
      yield call(userGroupRoleService.createUserGroupRoles, params);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *'delete'({ payload: values }, { call, put }) {
      yield call(userGroupRoleService.deleteUserGroupRole, values);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *deleteMany({ payload: values }, { call, put }) {
      yield call(userGroupRoleService.deleteUserGroupRoles, values);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *reload(action, { put, select }) {
      const pageIndex = yield select(state=>state.user.userGroupRole.pageIndex);
      yield put({ type: 'query', payload: {pageIndex:pageIndex}});
    },
  },
  subscriptions: {},
};
