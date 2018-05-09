/**
 * Created by ecarx on 2017/8/17.
 */
import { routerRedux } from 'dva/router';
import * as roleService from '../services/roleService';
export default {
  namespace: 'role',
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
  effects: {
    *query({ payload: params }, { call, put,select }) {
      const response = yield call(roleService.queryRoleList, params);
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
      yield call(roleService.updateRole,values);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *enable({ payload: values}, { call, put }) {
      yield call(roleService.enableRole,values.id);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *disable({ payload: values}, { call, put }) {
      yield call(roleService.disableRole,values.id);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *create({ payload: values }, { call, put }) {
      yield call(roleService.createRole, values);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *edit({payload:record},{put}){
      yield put({
        type: 'goEdit',
        payload: {
          currentRow:record
        },
      });
    },
    *permission({payload:record},{put}){
      yield put({
        type: 'goEdit',
        payload: {
          currentRow:record
        },
      });
      yield put(routerRedux.push('/choosePower'));
    },
    *reload(action, { put, select }) {
      const pageIndex = yield select(state=>state.role.pagination.pageIndex);
      yield put({ type: 'query', payload: {pageIndex:pageIndex,pageSize:10}});
    },
  },
  subscriptions: {},
};


