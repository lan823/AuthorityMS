import { routerRedux } from 'dva/router';
import * as loginService from '../services/loginService';
import { message } from 'antd';

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
export default {
  namespace: 'common',
  state: {
    loginLoading: false,
    user:{},
    captchaCode:{} //验证码信息
  },
  reducers: {
    showLoginLoading(state,{}) {
      return { ...state, loginLoading:true};
    },
    hideLoginLoading(state,{ user }) {
      return { ...state, user,loginLoading:false};
    },
    updateCaptcha(state,{payload:{captchaCode:captchaCode}}) {
      return { ...state, captchaCode};
    },
  },
  effects: {
    *login({ loginInfo }, { call, put }) {
      yield put({ type: 'showLoginLoading' });
      const { data } = yield call(loginService.fetch,loginInfo);
      console.log("common::login::data",data);
      yield put({ type: 'hideLoginLoading',user:data });
      localStorage.accessToken= data.accessToken;
      localStorage.refreshToken= data.refreshToken;
      localStorage.username = loginInfo.username;
      console.log("localStorage",localStorage);
      if(window.location.href.split('key=')[1]){//1:OTA 2:GID
        let key = window.location.href.split('key=')[1][0];//管理系统参数
        if(key==='1'){
          window.location.href="http://ms.beta.xchanger.cn/ota";
        }
        if(key==='2'){
          window.location.href="http://ms.beta.xchanger.cn/gid";
        }
      }else{
        yield put(routerRedux.push({pathname: '/managerHome'}));
      }
      // yield put(routerRedux.push({pathname: 'home', query: {'user': data}})); //
    },
    *captcha({},{call,put}){
      const { data } = yield call(loginService.getCode);
      yield put({type:'updateCaptcha',  payload: {
        captchaCode:data
      }});
    },
    *changePassword({ payload: values }, { call, put}) {
      const res = yield call( loginService.changePassword,values );
      if(res){
        message.success('密码修改成功了，请重新登录~');
        yield put(routerRedux.push({pathname: 'login'}));
      }
    },
    *logout({},{ call, put}) {
      const res = yield call( loginService.logout);
      if(res){
        window.localStorage.removeItem("accessToken");
        window.localStorage.removeItem("refreshToken");
        window.localStorage.removeItem("username");
        yield put(routerRedux.replace('login'));
      }
    },
  },
  subscriptions: { setup({ dispatch }) {}
  },
};

