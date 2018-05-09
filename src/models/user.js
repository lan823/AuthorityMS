/**
 * Created by ecarx on 2017/7/25.
 */
import { routerRedux } from 'dva/router';
import * as userService from '../services/userService.js'
export default {
  namespace: 'user',
  state: {
    list: [],
    pagination: {},
    totalPageCount: 0,
    loading: true,
    currentRow: {}
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
    *query({ payload: params },{ call, put ,select}) {
      const response = yield call( userService.query, params);
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
          currentRow:{},
          loading: false
        }
      });
    },
    *update({ payload: value },{ call, put }) {
     // yield put(delete value["password"]);
      const res = yield call( userService.update, value);
      if(res){
        yield put(routerRedux.goBack());
       // yield put({ type: 'reload'});
      }
    },
    *create({ payload: value },{ call, put }) {
      const res = yield call( userService.create, value);
      if(res){
        yield put(routerRedux.push({pathname: '/userList'}));
      }
    },
    *enable({ payload: values },{ call, put }) {
      yield call( userService.enable, values);
      yield put({ type: 'reload'});
    },
    *disable({ payload: values },{ call, put }) {
      yield call( userService.disable, values);
      yield put({ type: 'reload'});
    },
    *reload(action, { put, select }) {
      const pageIndex = yield select(state=>state.user.pagination.pageIndex);
      yield put({ type: 'query', payload: {pageIndex:pageIndex}});
    },
    *edit({payload:record},{put}){
      yield put({
        type: 'goEdit',
        payload: {
          currentRow:record
        },
      });
    },
    *post({payload:record},{put}){
      yield put({
        type: 'goEdit',
        payload: {
          currentRow:record
        },
      });
      yield put(routerRedux.push('/choosePost'));
    },
  },
  subscriptions: {},
};
