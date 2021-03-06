/**
 * Created by ecarx on 2017/8/18.
 */
import { routerRedux } from 'dva/router';
import * as registerService from '../services/registerService';
export default {
  namespace: 'register',
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
      const response = yield call(registerService.queryRegisterList, params);
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
      yield call(registerService.updateRegister,values);
      yield put({
        type: 'reload',
        payload: {},
      });
      yield put(routerRedux.push({pathname: '/registerList'}));
    },
    *create({ payload: values }, { call, put }) {
      yield call(registerService.createRegister,values);
      yield put({
        type: 'reload',
        payload: {},
      });
      yield put(routerRedux.push({pathname: '/registerList'}));
    },
    *cancel({ payload: {} }, { put }) {
      yield put({
        type: 'reset',
        payload: {
          currentRow:{}
        },
      });
      yield put(routerRedux.push({pathname: '/registerList'}));
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
      const pageIndex = yield select(state=>state.register.pagination.pageIndex);
      console.log('reload::',pageIndex)
      yield put({ type: 'query', payload: {pageIndex:pageIndex,pageSize:10}});
    },
  },
  subscriptions: {},
};




