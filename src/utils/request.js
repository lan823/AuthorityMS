import axios from 'axios';
import { browserHistory,hashHistory } from 'dva/router';
import { message } from 'antd';
import { refreshToken } from '../services/loginService';
import * as constSet from './constSet';

// console.log('apiroot=', process.env.NODE_ENV)

// axios 配置
axios.defaults.timeout = 10000;    //请求超时时间
axios.defaults.baseURL =  process.env.NODE_ENV == 'production' ? constSet.API_PRO : constSet.API_DEV;
axios.defaults.isLoading = true;
axios.defaults.headers['content-Type'] = 'application/json';
axios.defaults.headers['Accept'] = 'application/json;responseformat=3';
axios.defaults.headers['Accept-Language'] = 'zh-cn';
// axios.defaults.headers['X-ENV-TYPE'] =  process.env.NODE_ENV == 'production' ? 'testing' : 'testing';
axios.defaults.headers['X-ENV-TYPE'] =  window.config&&window.config.x_env_type || 'testing';
// axios.defaults.headers['x-sys-code'] =  'appinfo';
// axios.defaults.headers['x-resource-type'] =  1;


// http request 拦截器
axios.interceptors.request.use(
  config => {
    if(localStorage.accessToken){
      if(config.type === 'noToken'){
        config.headers.Authorization = '';
      }else{
        config.headers.Authorization = localStorage.accessToken;
      }
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });

// http response 拦截器
axios.interceptors.response.use(
  response => {
      const code = response.data.code || response.data.error.code;
    /*  console.log('response',response);*/
    switch(code){
      //获取到数据或数据为空
      case 'success':
      case '5301':
        return response.data;break;
      //Token验证失败
      case '5202':
        if(localStorage.accessToken){
          if(response.config.api == 'refreshToken'){
            hashHistory.push('/login');break;
          }else{
            refreshToken().then((res)=>{
              if(res){
                localStorage.accessToken= res.data.accessToken;
                localStorage.refreshToken= res.data.refreshToken;
                console.log('localStorage.accessToken',localStorage.accessToken);
                location.reload();
              }
            });break;
          }
        }else{
          hashHistory.push('/login');break;
        }
      case '401':
        hashHistory.push('/login');break;
      default:
        message.error(response.data.message);break;
    }
  },
  error => {
    // console.log('error.response',error.response);
    const code = error.response.data.error.code;
    if (error.response) {
      if(error.response.config.api == 'refreshToken'){
          hashHistory.push('/login');
      }else{
        message.error(error.response.data.message);
      }
    }
    else{
      message.error('服务期异常，请稍后重试');
    }
    return Promise.reject(error)
  });

/**
 * Requests a URL, returning a promise.
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "axios"
 * @returns {Object} Promise对象
 */
export default function request(url, options) {
  // console.log('request::request::url::', url);
  // console.log('options',options);
  options.data = JSON.stringify(options.data);
  return new Promise((resolve, reject) => {
    axios({
      url,
      ...options,
    }).then((res)=>{
      resolve(res);
    }).catch((err)=>{
      reject(err);
    });

  })
}
