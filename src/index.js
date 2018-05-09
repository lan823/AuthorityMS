/* eslint-disable key-spacing */
import "babel-polyfill";
import dva from 'dva';
import { useRouterHistory } from 'dva/router';
import { createHashHistory } from 'history';
import { persistStore, autoRehydrate } from 'redux-persist';
import createLoading from 'dva-loading';
import './index.less';
import { message } from 'antd';

//全局配置提示信息
message.config({
  top:'40%',
  duration:2,
});

// 1. Initialize
const app = dva({
  extraEnhancers: [autoRehydrate()],
/*  history: useRouterHistory(createHashHistory)({ queryKey: false }),*/

  // initialState:{
  //   customers:[
  //     {
  //       id: '1',
  //       name: 'John Brown',
  //       age: 32,
  //       address: 'New York No. 1 Lake Park',
  //     }, {
  //       id: '2',
  //       name: 'Jim Green',
  //       age: 42,
  //       address: 'London No. 1 Lake Park',
  //     }, {
  //       id: '3',
  //       name: 'Joe Black',
  //       age: 32,
  //       address: 'Sidney No. 1 Lake Park',
  //     }],
  // },
  onError(e) {
    // message.error(e.message);
    console.log(e.message);
  }
});

app.use(createLoading({
  effects: true,
}));

// 2. Plugins
// app.use({});
// app.use(createLoading({effects: true}));

// 3. Model
app.model(require('./models/bread'));
app.model(require('./models/user'));
app.model(require('./models/common'));

app.model(require('./models/role'));//角色
app.model(require('./models/permission'));//权限
app.model(require('./models/department'));//部门
app.model(require('./models/menu'));//菜单
app.model(require('./models/operation'));//功能操作
app.model(require('./models/jobTitle'));//岗位
app.model(require('./models/sysManage'));//系统应用
app.model(require('./models/rolePermission'));//角色权限关系
app.model(require('./models/permissionOperation'));//权限功能关系
app.model(require('./models/permissionMenu'));//权限菜单关系
app.model(require('./models/userPost'));//用户用户组关系
app.model(require('./models/sysApp'));//系统应用
app.model(require('./models/userRole'));//用户角色关系
app.model(require('./models/userGroupRole'));//用户组角色关系
app.model(require('./models/register'));//注册app管理

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');

persistStore( app._store,{
  whitelist: ['bread','permission','department','menu'],
});
