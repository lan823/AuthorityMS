import React from 'react';
import { Router, Route, IndexRoute, Redirect } from 'dva/router';
import Home from './routes/home/Home'; // 容器
import Login from './routes/login/Login';// 登录
import ManagerHome from './routes/managerHome/ManagerHome'; // 管理首页
import AuthConfig from './utils/AuthConfig';



function auth(nextState, replace, callback) {
  // let state = store.getState();
  if (window.localStorage.getItem('accessToken')) {
    //do nothing
  }else{
    replace('login');
  }
  callback();
}
// 无状态（stateless）组件，一个简单的容器，pwa-router 会根据 route
// 规则匹配到的组件作为 `props.children` 传入
const Container = (props) => {
  return (
    <div className="root-container">
      {props.children}
    </div>
  );
};

// 渲染一个子路由
const RouteWithSubRoutes = route => (
  <Route
    path={route.path} render={props => (
      <route.component {...props} routes={route.routes} onEnter={auth}/>
  )}
  />  
);

function RouterConfig({ history }) {
 /* const RoleConfig = AuthConfig[this.props.common.user.role];*/
/*  console.log("::RoleConfig",RoleConfig);*/
  return (
    <Router history={history} component={Container}>
      <Route path="login" component={Login} />
      <Route path="/" component={Home} onEnter={auth}>
        <IndexRoute component={ManagerHome} onEnter={auth} />
        {AuthConfig.admin.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </Route>
      <Redirect from="*" to="notFound" />
    </Router>
  );
}
export default RouterConfig;
