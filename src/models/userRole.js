/**
 * Created by ecarx on 2017/8/23.
 */
import { routerRedux } from 'dva/router';
import * as userService from '../services/userService';
export default {
  namespace: 'userRole',
  state: {
    list: [],
    pagination:{},
    totalPageCount: 0,
    loading:true,
    userId:null
  },
  reducers: {
    save(state, { payload: { data: list,totalPageCount,loading,pagination,userId } }) {
      return { ...state, list, totalPageCount,loading,pagination,userId };
    },
    clear(state,{payload:{list:list,userId}}){
      return { ...state, list,userId};
    }
  },
  effects: {
    *query({ payload: params }, { call, put }) {
      const response = yield call(userService.getUserRole, params);
      yield put({
        type: 'save',
        payload: {
          userId:params.userId,
          data:response.data || [],
          totalPageCount:response.totalPageCount,
          pagination:{
            current:response.pageIndex+1,
            pageIndex:response.pageIndex,
            // pageSize: response.pageSize,
            showQuickJumper: response.totalPageCount>1,
            total: response.record
          },
          loading:false
        },
      });
    },
    *create({ payload: values }, { call, put }) {
      yield call(userService.createUserRole, values);
      yield put({
        type: 'reload',
      });
    },
    *createMany({ payload: values }, { call, put }) {
      yield call(userService.createUserRoles, values);
      yield put({
        type: 'reload',
      });
    },
    *'delete'({ payload: values }, { call, put }) {
      yield call(userService.deleteUserRole, values);
      yield put({
        type: 'reload'
      });
    },
    *deleteMany({ payload: values }, { call, put }) {
      yield call(userService.deleteUserRoles, values);
      yield put({
        type: 'reload'
      });
    },
    *reload(action, { put, select }) {
      const userId = yield select(state=>state.userRole.userId);
      yield put({ type: 'query', payload: { userId:userId,pageSize:1000} });
    },
  },
  subscriptions: {},
};
