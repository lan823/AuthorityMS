/**
 * Created by ecarx on 2017/8/21.
 */
import { routerRedux } from 'dva/router';
import * as userPostService from '../services/userPostService';
export default {
  namespace: 'userPost',
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
      const { id } = yield select(state=>state.user.currentRow);
      params.userId = id;
      const response = yield call(userPostService.queryUserPostList, params);
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
      yield call(userPostService.updateUserPost,values);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *create({ payload: values }, { call, put }) {
      yield call(userPostService.createUserPost, values);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *createMany({ payload: values }, { call, put }) {
      yield call(userPostService.createUserPosts, values);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *'delete'({ payload: values }, { call, put }) {
      yield call(userPostService.deleteUserPost, values);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *deleteMany({ payload: values }, { call, put }) {
      yield call(userPostService.deleteUserPosts, values);
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
      const pageIndex = yield select(state=>state.userPost.pagination.pageIndex);
      yield put({ type: 'query', payload: {pageIndex:pageIndex}});
    },
  },
  subscriptions: {},
};
