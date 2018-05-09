/**
 * Created by ecarx on 2017/8/17.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { Link,routerRedux } from 'dva/router';
import { Table, Input, Button, Select,Popconfirm } from 'antd';
import AddRoleModal from './../../components/AddRoleModal';
import  * as sysAppService from './../../services/sysAppService';
import styles from './RoleList.less';
const Search = Input.Search;
const Option = Select.Option;

class RoleList extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      currentFilter:'roleName', //默认搜索角色名称
      sysList:[],
    };
  }

  /**
   * 组件渲染后加载数据
   */
  componentDidMount(){
    this._loadData({pageSize:10});
    sysAppService.query({"status":"Y"}).then((res)=>{
      if(res.data){
        this.setState({sysList:res.data});
      }
    });
  }
  componentDidUpdate() {
    ReactDOM.findDOMNode(this.refs.MyRoleList.parentNode).scrollTop=0;
  }

  /**
   * 加载数据函数
   * @param params
   * @private
   */
  _loadData(params){
    params.pageSize=10;
    this.props.dispatch({
      type: 'role/query',
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
    let params = this.props.role.pagination  || {};
    value ? params[this.state.currentFilter] = value : true;
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
  _createRoleHandler=(values) => {
    this.props.dispatch({
      type: 'role/create',
      payload: values,
    });
  };

  /**
   * 列表分页
   * @param pageObject
   * @private
   */
  _onPageChange=(pageObject)=> {
    console.log("@@@@@@@@@@",pageObject);
    this._loadData({pageSize:10,pageIndex:pageObject.current-1});
  };

  /**
   * 修改角色信息
   * @param values
   * @private
   */
  _editHandler=(values)=>{
    delete values['status'];
    this.props.dispatch({
      type: 'role/update',
      payload: values
    });
  };

  _enableStatus(record,e){
    e.stopPropagation();
    this.props.dispatch({
      type: 'role/enable',
      payload: record
    });
  };
  _disableStatus(record,e){
    e.stopPropagation();
    this.props.dispatch({
      type: 'role/disable',
      payload: record
    });
  };
  _updatePermission(record,e){
    e.stopPropagation();
    this.props.dispatch({
      type: 'role/permission',
      payload: record
    });
  };

  render(){
    const selectBefore = (
      <Select defaultValue="roleName" onChange={this._handleSelectChange}>
        <Option value="roleName">角色名称</Option>
        <Option value="sysName">应用名称</Option>
      </Select>
    );
    const columns = [
      {
        title: '角色编码',
        dataIndex: 'roleCode',
        key: 'roleCode',
      },
      {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
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
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <span>
            <AddRoleModal record={record} onOk={this._editHandler} sysList={this.state.sysList || []}>
              <a  style={{marginRight: 10 }}>修改</a>
        </AddRoleModal>
            <a style={{marginRight: 10 }} onClick={(e) => this._updatePermission(record,e)}>授权</a>
                 <Popconfirm title="确定生效?" onConfirm={(e) => this._enableStatus(record,e)}>
            <a style={{marginRight: 10 }}>生效</a>
          </Popconfirm>
             <Popconfirm title="确定禁用?" onConfirm={(e) => this._disableStatus(record,e)}>
            <a style={{marginRight: 10 }}>禁用</a>
          </Popconfirm>
      </span>
        )
      },
    ];
    return (
      <div className={styles.myTable} ref="MyRoleList">
        <div className={styles.operationBtn}>
          <Search
            addonBefore={selectBefore}
            placeholder="请输入搜索内容"
            style={{ width: 300 }}
            onSearch={this._onChange}
          />
          <AddRoleModal record={{}} onOk={this._createRoleHandler} sysList={this.state.sysList || []}>
            <Button type="primary">新增角色</Button>
          </AddRoleModal>
        </div>
        <div>
          <Table
            loading={this.props.loading.global} //this.props.role.loading
            columns={columns}
            bordered
            dataSource={this.props.role.list}
            rowKey={record => record.id}
            onChange={this._onPageChange}
            total={4}
            pagination={this.props.role.pagination}
          />
        </div>
      </div>)
  }
}

/*function mapStateToProps(state) {
  return {
    loading: state.loading.global,
  };
}*/

export default connect((role)=>(role))(RoleList);

