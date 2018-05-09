import AuthConfig from './../utils/AuthConfig';
export default {
  namespace: 'bread',
  state: {
    current:'1',
    breadcrumb: [
      {
        name: '管理首页',
        path: '/',
      },
    ],
  },
  reducers: {
    changeBreadcrumb(state, { payload: breadcrumb }) {
      return { ...state, ...breadcrumb };
    },
  },
  effects: {
    *changePath({ payload: para },{put,select}){
      const oldBread = yield select(state => state.bread.breadcrumb);
      const breadcrumbData = {
        breadcrumb: oldBread
      };
      if(breadcrumbData.breadcrumb[oldBread.length-1].path!==para.pathname){
        let menuName = "",menuRoot=false,sideMenu;
        AuthConfig.admin.map(item=>{
          if(item.path===para.pathname){
            menuName = item.name;
            sideMenu = item.current || false;
            menuRoot = (item.root===true);
          }
        });
        sideMenu ? breadcrumbData.current = sideMenu : true;
        if(menuName){
           if(menuRoot){
            breadcrumbData.breadcrumb = [{name:menuName,path:para.pathname}];
          }else{
            breadcrumbData.breadcrumb.push({name:menuName,path:para.pathname});
          }
        }

      }
      yield put({ type: 'changeBreadcrumb', payload: breadcrumbData });
    }
  },
  subscriptions: {
      setup({ dispatch, history }) {
     return history.listen((para) => {
       dispatch({
         type: 'changePath',
         payload: para,
       });
     });
     },
  }
};

