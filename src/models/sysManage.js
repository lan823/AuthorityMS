/**
 * Created by ecarx on 2017/7/25.
 */
import dva from 'dva';
import { routerRedux } from 'dva/router';
import * as sysApplyService from '../services/sysApplyServer.js'

export default {
  namespace: 'sysManage',
  state: {
    list: [],
    pagination: {},
    totalPageCount: 0,
    loading: true,
    currentRow: {}
  },
  reducers: {
    save(state, { payload: { data:list,totalPageCount,loading,pagination} }){
      return { ...state, list,totalPageCount,loading,pagination};
    }
  },
  effects: {
    *query({ payload: params },{ call, put }) {
      const response = yield call(sysApplyService.query, params);
      yield put({
        type: 'save',
        payload: {
          data: response.data,
          totalPageCount: response.totalPageCount,
          pagination: {
            current:response.pageIndex+1,
            // pageSize: response.pageSize,
            pageIndex: response.pageIndex,
            showQuickJumper: response.totalPageCount>1,
            total: response.record
          },
          loading: false
        }
      });
    },
     *enable({ payload: values}, { call, put }) {
      console.log("values.id",values.id);
      yield call(sysApplyService.enable,values);

      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *disable({ payload: values}, { call, put }) {
      yield call(sysApplyService.disable,values);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *cancel({ payload: {} }, { put }) {
      yield put({
        type: 'reset',
        payload: {
          currentRow:{}
        },
      });
      yield put(routerRedux.push({pathname: '/sysAppList'}));
    },
    *edit({payload:record},{put}){
       console.log("edit",record);
      yield put({
        type: 'goEdit',
        payload: {
          currentRow:record
        },
      });
     yield put(routerRedux.push({pathname: '/emitApply'}));
    },
    *create({ payload: value },{ call, put }) {
      yield call( sysApplyService.create, value);
      yield put({ type: 'reload'});
      yield put(routerRedux.push({pathname: '/sysAppList'}));
    },
    *update({ payload: value },{ call, put }) {
      yield call( sysApplyService.update, value);
      yield put({ type: 'reload'});
      yield put(routerRedux.push({pathname: '/sysAppList'}));
    },
    *reload(action, { put, select }) {
      const pageIndex = yield select(state=>state.sysManage.pagination.pageIndex);
      yield put({ type: 'query', payload: {pageIndex:pageIndex}});
    },
  },
  subscriptions: {},
};
