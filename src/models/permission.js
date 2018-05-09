/**
 * Created by ecarx on 2017/8/18.
 */
import { routerRedux } from 'dva/router';
import * as permissionService from '../services/permissionService';
export default {
  namespace: 'permission',
  state: {
    list: [],
    pagination:{},
    totalPageCount: 0,
    loading:true,
    currentRow:{}
  },
  reducers: {
    save(state, { payload: { data: list,totalPageCount,loading,pagination,currentRow } }) {
      return { ...state, list, totalPageCount,loading,pagination,currentRow };
    },
    goEdit(state,{payload:{currentRow:currentRow}}){
      return { ...state, currentRow};
    },
    reset(state,{payload:{currentRow:currentRow}}){
      return { ...state, currentRow};
    }
  },
  effects: {//
    *query({ payload: params }, { call, put,select }) {
      const response = yield call(permissionService.queryPermissionList, params);
      yield put({
        type: 'save',
        payload: {
          data:response.data,
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
      yield call(permissionService.updatePermission,values);
      yield put({
        type: 'reset',
        payload: {
          currentRow:{}
        },
      });
      // yield put(routerRedux.push({pathname: '/permissionList'}));
      yield put(routerRedux.goBack());
    },
    *enable({ payload: values}, { call, put }) {
      yield call(permissionService.enablePermission,values.id);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *disable({ payload: values}, { call, put }) {
      yield call(permissionService.disablePermission,values.id);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *create({ payload: values }, { call, put }) {
      yield call(permissionService.create,values);
      yield put({
        type: 'reset',
        payload: {
          currentRow:{}
        },
      });
      yield put(routerRedux.push({pathname: '/permissionList'}));
    },
    *cancel({ payload: {} }, { put }) {
      yield put({
        type: 'reset',
        payload: {
          currentRow:{}
        },
      });
      yield put(routerRedux.push({pathname: '/permissionList'}));
    },
    *edit({payload:record},{put}){
      yield put({
        type: 'goEdit',
        payload: {
          currentRow:record
        },
      });
      yield put(routerRedux.push({pathname: '/editPermission'}));
    },
    *resource({payload:record},{put}){
      console.log("resource - record:",record);
      yield put({
        type: 'goEdit',
        payload: {
          currentRow:record
        },
      });
      yield put(routerRedux.push({pathname: '/editResourcePermission'}));
    },
    *reload(action, { put, select }) {
      const pageIndex = yield select(state=>state.permission.pagination.pageIndex);
      yield put({ type: 'query', payload: {pageIndex:pageIndex}});
    },
  },
  subscriptions: {},
};


