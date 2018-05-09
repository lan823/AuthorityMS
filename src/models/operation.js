/**
 * Created by ecarx on 2017/8/18.
 */
import { routerRedux } from 'dva/router';
import * as operationService from '../services/operationService';
export default {
  namespace: 'operation',
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
      console.log('effects',params);
      const response = yield call(operationService.queryOperationList, params);
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
      yield call(operationService.updateOperation,values);
      yield put({
        type: 'reload',
        payload: {},
      });
      yield put(routerRedux.push({pathname: '/operationList'}));
    },
    *enable({ payload: values}, { call, put }) {
      yield call(operationService.enableOperation,values.id);
      yield put({
        type: 'reload',
        payload: {},
      });
    },
    *disable({ payload: values}, { call, put }) {
      yield call(operationService.disableOperation,values.id);
      yield put({
        type: 'reload',
        payload: {},
      });
    },
    *create({ payload: values }, { call, put }) {
      yield call(operationService.createOperation,values);
      yield put({
        type: 'reload',
        payload: {},
      });
      yield put(routerRedux.push({pathname: '/operationList'}));
    },
    *cancel({ payload: {} }, { put }) {
      yield put({
        type: 'reset',
        payload: {
          currentRow:{}
        },
      });
      yield put(routerRedux.push({pathname: '/operationList'}));
    },
    *edit({payload:record},{put}){
      yield put({
        type: 'goEdit',
        payload: {
          currentRow:record
        },
      });
      yield put(routerRedux.push({pathname: '/editOperation'}));
    },
    *reload(action, { put, select }) {
      const pageIndex = yield select(state=>state.operation.pagination.pageIndex);
      yield put({ type: 'query', payload: {pageIndex:pageIndex,pageSize:10}});
    },
  },
  subscriptions: {},
};

