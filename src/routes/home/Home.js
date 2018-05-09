/**
 * Created by ecarx on 2017/7/26.
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Layout, Menu, Icon, Avatar, Button, Dropdown} from 'antd';
import CustomBreadcrumb from './../../components/BreadCrumb';
import styles from './Home.less';
const { Header, Content, Sider, Footer } = Layout;
const SubMenu = Menu.SubMenu;
const menuList = [
  { key: '1', name: '管理首页', link: '/managerHome', icon: 'home' },
  { key: '2', name: '用户管理', link: '/userList', icon: 'user' },
  { key: '3', name: '用户组管理', link: '/postList', icon: 'solution' },
  { key: '4', name: '角色管理', link: '/roleList', icon: 'contacts' },
  { key: '5', name: '权限管理', link: '/permissionList', icon: 'book' },
  { key: '6', name: '系统应用管理', link: '/sysAppList', icon: 'appstore-o' },
  { key: '7', name: '部门管理', link: '/departmentList', icon: 'pie-chart' },
  { key: '8', name: '菜单管理', link: '/menuList', icon: 'credit-card' },
  { key: '9', name: '功能操作管理', link: '/operationList', icon: 'paper-clip' },
  {key:'10',name:'注册app管理',link:'/registerList',icon:'book'},
];

class Home extends React.Component {
  constructor(props) {
    super(props);
 /*   this.state={current: '1',};*/
  }
  handleClick=(e) =>{
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };
  handleMenuClick=(e)=>{
   const _dispatch = this.props.dispatch;
    if(e.key==="2"){//退出登录
      _dispatch({
        type:'common/logout'
      });
    }
};
  render() {
    const menu = (
      <Menu onClick={this.handleMenuClick} className={styles.userLink}>
        <Menu.Item key="1">
          <Link to="/changePassword">
            <i className={`${styles.menuIcon} iconfont icon-xiugaimima`}/>
            <span>修改密码</span>
          </Link></Menu.Item>
        <Menu.Item key="2">
          <a>
            <i className={`${styles.menuIcon} iconfont icon-anquantuichu`}/>
            <span>安全退出</span>
          </a>
        </Menu.Item>
      </Menu>
    );
    return (
      <Layout className={styles.container}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
        >
          <div className={styles.logo}>
            <i className={`iconfont icon-LOGO`}></i>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            selectedKeys={[this.props.bread.current]}
          >
            {
              menuList.map((item, index) =>
                <Menu.Item key={item.key}>
                  <Link to={item.link}>
                    <Icon className={`${styles.menuIcon}`} type={item.icon} /><span>{item.name}</span>
                  </Link>
                </Menu.Item>
              )
            }
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <div className={styles.user}>
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              <Dropdown overlay={menu}>
                <div style={{ paddingLeft: 10 }}>{localStorage.username}</div>
             </Dropdown>
            </div>
          </Header>
          <Content style={{ margin: '24px 16px 0',display:'flex',flexDirection: 'column' }}>
            <CustomBreadcrumb data={this.props.bread.breadcrumb} />
            <div className={styles.content}>
              {this.props.children || '待开发'}
            </div>
          </Content>
            <Footer style={{ textAlign: 'center' }}>
              版权所有 2017 ecarx.com.cn
            </Footer>
        </Layout>
      </Layout>
    );
  }
}


function mapStateToProps({common,bread}){
  return {common,bread};
}
export default connect(mapStateToProps)(Home);

// export default connect(({ bread }) => ({ bread }))(Home);
