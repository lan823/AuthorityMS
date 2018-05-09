/**
 * Created by ecarx on 2017/8/18.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { Link,routerRedux } from 'dva/router';
import { Table, Input, Button, Select,Popconfirm } from 'antd';
import util from './../../utils/util';
import styles from './../role/RoleList.less';
const Search = Input.Search;
const Option = Select.Option;

class PermissionList extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      currentFilter:'permissionName' //默认搜索名称
    };
  }

  /**
   * 组件渲染后加载数据
   */
  componentDidMount(){
    this._loadData(this.props.permission.pagination  || {});
  }

  componentDidUpdate() {
    ReactDOM.findDOMNode(this.refs.MyPermissionList.parentNode).scrollTop=0;
  }
  /**
   * 加载数据函数
   * @param params
   * @private
   */
  _loadData(params){
    this.props.dispatch({
      type: 'permission/query',
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
   * 新增车机
   * @param values
   * @private
   */
  _createSoftwareHandler=(values) => {
    this.props.dispatch({
      type: 'permission/create',
      payload: values,
    });
  };

  /**
   * 列表分页
   * @param pageObject
   * @private
   */
  _onPageChange=(pageObject)=> {
    this._loadData({pageSize:10,pageIndex:pageObject.current-1});
  };

  _editResourceHandler=(values)=>{
    this.props.dispatch({
      type: 'permission/resource',
      payload: values
    });
  };
  _enablePermissionStatus(record,e){
    e.stopPropagation();
    this.props.dispatch({
      type: 'permission/enable',
      payload: record
    });
  };
  _disablePermissionStatus(record,e){
    e.stopPropagation();
    this.props.dispatch({
      type: 'permission/disable',
      payload: record
    });
  };
  _editPermission(record){
    this.props.dispatch({
      type: 'permission/edit',
      payload:record
    });
  }

  render(){
    const selectBefore = (
      <Select defaultValue="permissionName" onChange={this._handleSelectChange}>
        <Option value="permissionName">权限名称</Option>
      </Select>
    );
    const columns = [
      {
        title: '权限编码',
        dataIndex: 'permissionCode',
        key: 'permissionCode',
      },
      {
        title: '权限名称',
        dataIndex: 'permissionName',
        key: 'permissionName',
      },
      {
        title: '权限类型',
        dataIndex: 'permissionType',
        key: 'permissionType',
      },
      {
        title: '系统应用编码',
        dataIndex: 'sysCode',
        key: 'sysCode',
      },
      {
        title: '系统应用名称',
        dataIndex: 'sysName',
        key: 'sysName',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => text==='Y'&&'启用' || text==='N'&&'禁用'
      },
    {
        title: '最后修改人',
        dataIndex: 'lastUser',
        key: 'lastUser'
      },
    {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
        render: (text) => util.dataFormat(text,'yyyy-MM-dd')
      },
    {
        title: '修改时间',
        dataIndex: 'gmtModified',
        key: 'gmtModified',
        render: (text) => util.dataFormat(text,'yyyy-MM-dd')
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <span>
            <a onClick={() => this._editResourceHandler(record)} style={{marginRight: 10 }}>添加资源</a>
            <a onClick={() => this._editPermission(record)} style={{marginRight: 10 }}>修改</a>
                   <Popconfirm title="确定生效?" onConfirm={(e) => this._enablePermissionStatus(record,e)}>
            <a style={{marginRight: 10 }}>生效</a>
          </Popconfirm>
             <Popconfirm title="确定禁用?" onConfirm={(e) => this._disablePermissionStatus(record,e)}>
            <a style={{marginRight: 10 }}>禁用</a>
          </Popconfirm>
      </span>
        )
      },
    ];
    return (
      <div className={styles.myTable} ref="MyPermissionList">
        <div className={styles.operationBtn}>
          <Search
            addonBefore={selectBefore}
            placeholder="请输入搜索内容"
            style={{ width: 300 }}
            onSearch={this._onChange}
          />
          <Link to={{pathname:'/editPermission'}}><Button type="primary">新增权限</Button></Link>
        </div>
        <div>
          <Table
            loading={this.props.permission.loading}
            columns={columns}
            bordered
            dataSource={this.props.permission.list}
            rowKey={record => record.id}
            onChange={this._onPageChange}
            pagination={this.props.permission.pagination}
          />
        </div>
      </div>)
  }
}

export default connect((permission)=>(permission))(PermissionList);

