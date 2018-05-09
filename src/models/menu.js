/**
 * Created by ecarx on 2017/8/18.
 */
import { routerRedux } from 'dva/router';
import * as menuService from '../services/menuService';
export default {
  namespace: 'menu',
  state: {
    list: [],
    pagination:{},
    totalPageCount: 0,
    loading:true,
    currentRow:{}
  },
  reducers: {
    save(state, { payload: { data: list,totalPageCount,loading,pagination} }) {
      return { ...state, list, totalPageCount,loading,pagination};
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
      const response = yield call(menuService.queryMenuList, params);
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
          loading:false
        },
      });
    },
    *update({ payload: values}, { call, put }) {
      yield call(menuService.updateMenu,values);
      yield put({
        type: 'reset',
        payload: {
          currentRow:{}
        },
      });
      yield put(routerRedux.push({pathname: '/menuList'}));
    },
    *enable({ payload: values}, { call, put }) {
      yield call(menuService.enableMenu,values.id);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *disable({ payload: values}, { call, put }) {
      yield call(menuService.disableMenu,values.id);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *create({ payload: values }, { call, put }) {
      yield call(menuService.createMenu,values);
      yield put({
        type: 'reset',
        payload: {
          currentRow:{}
        },
      });
      yield put(routerRedux.push({pathname: '/menuList'}));
    },
    *cancel({ payload: {} }, { put }) {
      yield put({
        type: 'reset',
        payload: {
          currentRow:{}
        },
      });
      yield put(routerRedux.push({pathname: '/menuList'}));
    },
    *edit({payload:record},{put}){
      yield put({
        type: 'goEdit',
        payload: {
          currentRow:record
        },
      });
      yield put(routerRedux.push({pathname: '/editMenu'}));
    },
    *reload(action, { put, select }) {
      const pageIndex = yield select(state=>state.menu.pagination.pageIndex);
      yield put({ type: 'query', payload: {pageIndex:pageIndex}});
    },
  },
  subscriptions: {},
};
