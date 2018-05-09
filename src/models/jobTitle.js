/**
 * Created by ecarx on 2017/8/19.
 */
import { routerRedux } from 'dva/router';
import * as jobTitleService from '../services/jobTitleService';
export default {
  namespace: 'jobTitle',
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
      const response = yield call(jobTitleService.queryPostList, params);
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
      yield call(jobTitleService.updatePost,values);
      yield put({
        type: 'reload',
        payload: {},
      });
      yield put(routerRedux.push({pathname: '/postList'}));
    },
    *enable({ payload: values}, { call, put }) {
      yield call(jobTitleService.enablePost,values.id);
      yield put({
        type: 'reload',
        payload: {},
      });
    },
    *disable({ payload: values}, { call, put }) {
      yield call(jobTitleService.disablePost,values.id);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *create({ payload: values }, { call, put }) {
      yield call(jobTitleService.createPost,values);
      console.log('create');

      yield put({
        type: 'reload',
        payload: {},
      });
    },
    *cancel({ payload: {} }, { put }) {
      yield put({
        type: 'reset',
        payload: {
          currentRow:{}
        },
      });
      yield put(routerRedux.push({pathname: '/postList'}));
    },
    *edit({payload:record},{put}){
      yield put({
        type: 'goEdit',
        payload: {
          currentRow:record
        },
      });
      yield put(routerRedux.push({pathname: '/editPost'}));
    },
    *editRole({payload:record},{put}){
      yield put({
        type: 'goEdit',
        payload: {
          currentRow:record
        },
      });
      yield put(routerRedux.push({pathname: '/editUserGroupRole'}));
    },
    *reload(action, { put, select }) {
      const pageIndex = yield select(state=>state.jobTitle.pagination.pageIndex);
      yield put({ type: 'query', payload: {pageIndex:pageIndex}});
    },
  },
  subscriptions: {},
};
