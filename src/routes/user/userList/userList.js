/**
 * Created by ecarx on 2017/8/7.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { Link,routerRedux } from 'dva/router';
import { Table, Input, Button, Select } from 'antd';
import StatusModal from '../../../components/statusModal'
import util from '../../../utils/util.js';
// import AddSoftwareModal from '../../components/AddSoftwareModal';
import styles from './userList.less';
const Search = Input.Search;
const Option = Select.Option;

class UserList extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      currentFilter:'userName', //默认搜索软件名称
    };
  }

  /**
   * 组件渲染后加载数据
   */
  componentDidMount(){
    let deptId = this.props.location.query.id;
    if(deptId){
      this._loadData({depId:deptId});
    }else{
      this._loadData(this.props.user.pagination || {});
    }
  }
  componentDidUpdate() {
    ReactDOM.findDOMNode(this.refs.MyUserList.parentNode).scrollTop=0;
  }
  /**
   * 加载列表数据
   * @param params
   * @private
   */
  _loadData(params){
    this.props.dispatch({
      type: 'user/query',
      payload: params,
    });
  }
  /**
   * 搜索功能
   * onChange={this._onChange}
   * @param value
   * @private
   */
  _onChange = (value) => {
    let params = {};
    value ? params[this.state.currentFilter] = value : params={};
    this._loadData(params);
  };

  /**
   * 获取搜索条件字段
   * currentFilter
   * @param value
   * @private
   */
  _handleSelectChange=(value)=> {
    this.setState({
      currentFilter:value
    });
  };

  /**
   * 列表分页选择
   * @param pageObject
   * @private
   */
  _onPageChange=(pageObject)=> {
    this._loadData({pageSize:10,pageIndex:pageObject.current-1});
  };
  /**
   * 禁用用户-对话框
   * @param record
   * @private
   */
  _changeStatus=(values)=>{
    if(values.status === 'Y'){
      this.props.dispatch({
        type: 'user/enable',
        payload: values
      })
    }else if(values.status === 'N'){
      this.props.dispatch({
        type: 'user/disable',
        payload: values
      })
    }
    // userService.getUserRole({"userId":this.props.location.query.id,"status":"Y"}).then((res) => {
    //   if(res.data.length&&res.data.length>0){
    //     const checkedKeys=[];
    //     res.data.map((item)=>{
    //       checkedKeys.push(`0-${item.roleId}`)
    //     })
    //     console.log(this.state.defaultCheckedKeys);
    //   }
    // })
  };
  //跳转编辑用户组
  _updatePost(record,e){
    e.stopPropagation();
    this.props.dispatch({
      type: 'user/post',
      payload: record
    });
  };
  render(){
    const selectBefore = (
      <Select defaultValue="userName" onChange={this._handleSelectChange}>
        <Option value="userName">用户账号</Option>
        <Option value="jobNo">工 号&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Option>
        <Option value="realName">真实姓名</Option>
        <Option value="depName">部门名称</Option>
      </Select>
    );
    const columns = [
      {
        title: '工号',
        dataIndex: 'jobNo',
        key: 'jobNo',
      },
      {
        title: '用户账号',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '用户昵称',
        dataIndex: 'nickName',
        key: 'nickName',
        render: (text) => text || '--'
      },
      {
        title: '真实姓名',
        dataIndex: 'realName',
        key: 'realName'
      },
      {
        title: '部门编码',
        dataIndex: 'depCode',
        key: 'depCode',
        render:(text) => text || '--'
      },
      {
        title: '部门名称',
        dataIndex: 'depName',
        key: 'depName',
        render:(text) => text || '--'
      },
/*      {
        title: '密码',
        dataIndex: 'password',
        key: 'password'
      },*/
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        render: (text) => text || '--'
      },
      {
        title: '账号状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
          if(text==='Y'){
            return '启用';
          }else if(text==='N'){
            return '禁用';
          }else {
            return '--';
          }
        }
      },
      {
        title: '用户帐号是否被锁',
        dataIndex: 'isAccountNonLocked',
        key: 'isAccountNonLocked',
        render: (text) => {
          if(text==='Y'){
            return '正常';
          }else if(text==='N'){
            return '冻结';
          }else {
            return '--';
          }
        }
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
        render: (text) => util.dataFormat(text,'yyyy-MM-dd')
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <span>
            <StatusModal record={record} onOk={this._changeStatus}>
              <a  style={{marginRight: 10 }}>状态</a>
            </StatusModal>
            <Link to={{pathname:'/editUser',query:{id:record.id}}} style={{marginRight: 10 }}>信息修改</Link>
            <a onClick={(e) => this._updatePost(record,e)} style={{marginRight: 10 }}>用户组编辑</a>
            <Link to={{pathname:'/chooseRole',query:{id:record.id}}}>角色编辑 </Link>
          </span>
        )
      },
    ];
    return (
      <div className={styles.myTable} ref="MyUserList">
        <div className={styles.operationBtn}>
            <Search
              addonBefore={selectBefore}
              placeholder="请输入搜索内容"
              style={{ width: 300 }}
              onSearch={this._onChange}
            />
          <Link to={{pathname:'/editUser'}}><Button type="primary">添加用户</Button></Link>
        </div>
        <div>
          <Table
            loading={this.props.user.loading}
            columns={columns}
            bordered
            dataSource={this.props.user.list}
            rowKey={record => record.id}
            onChange={this._onPageChange}
            pagination={this.props.user.pagination}
          />
        </div>
      </div>)
  }
}

function mapStateToProps({user }) {
  return { user };
}
export default connect(mapStateToProps)(UserList);
