/**
 * Created by ecarx on 2017/8/18.
 */
import { routerRedux } from 'dva/router';
import * as departmentService from '../services/departmentService';
export default {
  namespace: 'department',
  state: {
    list: [],
    pagination:{},
    totalPageCount: 0,
    loading:true,
    currentRow:{}
  },
  reducers: {
    save(state, { payload: { data: list,totalPageCount,loading,pagination } }) {
      return { ...state, list, totalPageCount,loading,pagination };
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
      const response = yield call(departmentService.queryDepartmentList, params);
      yield put({
        type: 'save',
        payload: {
          data:response.data,
          totalPageCount:response.totalPageCount,
          pagination:{
            current:response.pageIndex+1,
            pageIndex: response.pageIndex,
            /*pageSize: response.pageSize,*/
            showQuickJumper: response.totalPageCount>1,
            total: response.record
          },
          loading:false
        },
      });
    },
    *update({ payload: values}, { call, put }) {
      yield call(departmentService.updateDepartment,values);
      yield put({
        type: 'reset',
        payload: {
          currentRow:{}
        },
      });
      yield put(routerRedux.push({pathname: '/departmentList'}));
    },
    *enable({ payload: values}, { call, put }) {
      yield call(departmentService.enableDepartment,values.id);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *disable({ payload: values}, { call, put }) {
      yield call(departmentService.disableDepartment,values.id);
      yield put({
        type: 'reload',
        payload: {
          currentRow:{}
        },
      });
    },
    *create({ payload: values }, { call, put }) {
      yield call(departmentService.createDepartment,values);
      yield put({
        type: 'reset',
        payload: {
          currentRow:{}
        },
      });
      yield put(routerRedux.push({pathname: '/departmentList'}));
    },
    *cancel({ payload: {} }, { put }) {
      yield put({
        type: 'reset',
        payload: {
          currentRow:{}
        },
      });
      yield put(routerRedux.push({pathname: '/departmentList'}));
    },
    *edit({payload:record},{put}){
      yield put({
        type: 'goEdit',
        payload: {
          currentRow:record
        },
      });
      yield put(routerRedux.push({pathname: '/editDepartment'}));
    },
    *reload(action, { put, select }) {
      const pageIndex = yield select(state=>state.department.pagination.pageIndex);
      yield put({ type: 'query', payload: {pageIndex:pageIndex}});
    },
  },
  subscriptions: {},
};
