/**
 * Created by ecarx on 2017/8/18.
 */
import { routerRedux } from 'dva/router';
import * as sysAppService from '../services/sysAppService';
export default {
  namespace: 'sysApp',
  state: {
    list: [],
    pagination:{},
    totalPageCount: 0,
    loading:true,
  },
  reducers: {
    save(state, { payload: { data: list,totalPageCount,loading,pagination} }) {
      return { ...state, list, totalPageCount,loading,pagination };
    }
  },
  effects: {
    *query({ payload: params }, { call, put,select }) {
      const response = yield call(sysAppService.query, params);
      yield put({
        type: 'save',
        payload: {
          data:response.data,
          totalPageCount:response.totalPageCount,
          loading:false
        },
      });
    },
    *reload(action, { put, select }) {
      const pageIndex = yield select(state=>state.sysApp.pagination.pageIndex);
      yield put({ type: 'query', payload: {pageIndex:pageIndex}});
    },
  },
  subscriptions: {},
};


