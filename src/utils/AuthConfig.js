import NotFound from '../routes/notFound/NotFound';// noMatch页面
import ManagerHome from '../routes/managerHome/ManagerHome'; // 管理首页
import { RoleList, RolePermission} from '../routes/role'; //{角色列表}

import OperationList from '../routes/operation/OperationList'; //{功能操作列表}
import RegisterList from '../routes/registerList/registerList';//{注册app管理}
import { MenuList, EditMenu} from '../routes/menu'; //{菜单列表}
import { DepartmentList, EditDepartment} from '../routes/department'; //{部门列表}

import { JobTitleList,EditUserGroupRole} from '../routes/jobTitle'; //{用户组列表}
import { PermissionList, EditPermission,EditResourcePermission } from '../routes/permission'; //{权限}
import { UserList, EditUser, ChoosePost, ChooseRole } from '../routes/user' //{用户列表,新增/修改用户信息,用户组编辑,角色编辑}
// 系统管理
import {sysAppList,emitApply} from '../routes/systemsApplycation' //{用户列表,新增/修改用户信息,岗位编辑,角色编辑}
import ChangePassword from '../routes/login/changePassword' //修改密码

// 系统应用管理

const AuthConfig = {
  admin: [
    { path: '/notFound',
      component: NotFound,
      name:'待定'
    },
    { path: '/changePassword',
      component: ChangePassword,
      name:'修改密码',
      root:true
    },
    { path:'/managerHome',
      component:ManagerHome,
      name:'管理首页',
      current:'1',
      root:true
    },
    //用户管理
    { path:'/userList',
      component:UserList,
      name:'用户管理',
      current:'2',
      root:true
    },
    { path:'/editUser',
      component:EditUser,
      name:'新增/修改用户'
    },
    { path:'/choosePost',
      component:ChoosePost,
      name:'用户组编辑'
    },
    { path:'/chooseRole',
      component:ChooseRole,
      name:'角色编辑'
    },
    //用户组管理
    { path:'/postList',
      component:JobTitleList,
      name:'用户组管理',
      current:'3',
      root:true
    },
    { path:'/editPost',
      component:NotFound,
      name:'新增/修改用户组'
    },
    { path:'/editUserGroupRole',
      component:EditUserGroupRole,
      name:'编辑角色'
    },
    //角色管理
    { path:'/roleList',
      component:RoleList,
      name:'角色管理',
      current:'4',
      root:true
    },
    { path:'/editRole',
      component:NotFound,
      name:'新增/修改角色'
    },
    { path:'/choosePower',
      component:RolePermission,
      name:'编辑权限'
    },
    //权限管理
    { path:'/permissionList',
      component:PermissionList,
      name:'权限管理',
      current:'5',
      root:true
    },
    { path:'/editPermission',
      component:EditPermission,
      name:'新增/修改权限'
    },
    { path:'/editResourcePermission',
      component:EditResourcePermission,
      name:'添加资源'
    },
    //系统应用管理
    { path:'/sysAppList',
      component:sysAppList,
      name:'系统应用管理',
      current:'6',
      root:true
    },
    { path:'/emitApply',
      component:emitApply,
      name:'新增/修改系统应用'
    },
    //部门管理
    { path:'/departmentList',
      component:DepartmentList,
      name:'部门管理',
      current:'7',
      root:true
    },
    { path:'/editDepartment',
      component:EditDepartment,
      name:'新增/修改部门'
    },
    //菜单管理
    { path:'/menuList',
      component:MenuList,
      name:'菜单管理',
      current:'8',
      root:true
    },
    { path:'/editMenu',
      component:EditMenu,
      name:'新增/修改菜单'
    },
    //功能操作管理
    { path:'/operationList',
      component:OperationList,
      name:'功能操作管理',
      current:'9',
      root:true
    },
    {
      path:'/registerList',
      component:RegisterList,
      name:'注册app管理',
      current:'10',
      root:true
    },
    { path:'/editFunction',
      component:NotFound,
      name:'新增/修改功能操作'
    }
  ],
  user: [
    { path: '/notFound',
      component: NotFound,
    }
  ] };
export default AuthConfig;
