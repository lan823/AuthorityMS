/**
 * Created by ecarx on 2017/8/21.
 */
import { routerRedux } from 'dva/router';
import * as permissionOperationService from '../services/permissionOperationService';
export default {
  namespace: 'permissionOperation',
  state: {
    list: [],
    pagination:{},
    loading:true,    totalPageCount: 0,

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
      const { id } = yield select(state=>state.permission.currentRow);
      params.permissionId = id;
      const response = yield call(permissionOperationService.queryPermissionOperationList, params);
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
      yield call(permissionOperationService.updatePermissionOperation,values);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *create({ payload: values }, { call, put }) {
      yield call(permissionOperationService.createPermissionOperation, values);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *createMany({ payload: values }, { call, put }) {
      yield call(permissionOperationService.createPermissionOperations, values);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *'delete'({ payload: values }, { call, put }) {
      yield call(permissionOperationService.deletePermissionOperation, values);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *deleteMany({ payload: values }, { call, put }) {
      yield call(permissionOperationService.deletePermissionOperations, values);
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
    *reload(action, { put, select }) {
      const pageIndex = yield select(state=>state.permissionOperation.pagination.pageIndex);
      yield put({ type: 'query', payload: {pageIndex:pageIndex}});
    },
  },
  subscriptions: {},
};
