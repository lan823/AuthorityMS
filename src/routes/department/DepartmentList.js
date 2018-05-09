/**
 * Created by ecarx on 2017/8/18.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { Link,routerRedux } from 'dva/router';
import { Table, Input, Button, Select,Popconfirm} from 'antd';
import util from './../../utils/util';
import styles from './../role/RoleList.less';
const Search = Input.Search;
const Option = Select.Option;

class DepartmentList extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      currentFilter:'depName' //默认搜索名称
    };
  }

  /**
   * 组件渲染后加载数据
   */
  componentDidMount(){
    this._loadData(this.props.department.pagination  || {});
  }
  componentDidUpdate() {
    ReactDOM.findDOMNode(this.refs.MyDepartmentList.parentNode).scrollTop=0;
  }
  /**
   * 加载数据函数
   * @param params
   * @private
   */
  _loadData(params){
    this.props.dispatch({
      type: 'department/query',
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
  _createDepartmentHandler=({}) => {
    this.props.dispatch({
      type: 'department/edit',
      payload: {},
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

  /**
   * 修改软件信息
   * @param values
   * @private
   */
  _editHandler=(values)=>{
    this.props.dispatch({ 
      type: 'department/update',
      payload: values
    });
  };
  _enableDepartmentStatus(record,e){
    e.stopPropagation();
    this.props.dispatch({
      type: 'department/enable',
      payload: record
    });
  };
  _disableDepartmentStatus(record,e){
    e.stopPropagation();
    this.props.dispatch({
      type: 'department/disable',
      payload: record
    });
  };
  _editDepartment(record){
    this.props.dispatch({
      type: 'department/edit',
      payload:record
    });
  }
  _showUsers(record){
   this.props.dispatch(routerRedux.push({pathname: '/userList',query:{id:record.id}}));
  }

  render(){
    const selectBefore = (
      <Select defaultValue="depName" onChange={this._handleSelectChange}>
        <Option value="depName">部门名称</Option>
      </Select>
    );
    const columns = [
      {
        title: '部门编码',
        dataIndex: 'depCode',
        key: 'depCode',
      },
      {
        title: '部门名称',
        dataIndex: 'depName',
        key: 'depName',
      },
      {
        title: '上级部门编码',
        dataIndex: 'parentDepCode',
        key: 'parentDepCode',
      },
      {
        title: '上级部门名称',
        dataIndex: 'parentDepName',
        key: 'parentDepName',
      },
      {
        title: '部门层级',
        dataIndex: 'depLevel',
        key: 'depLevel',
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
        key: 'department',
        render: (text, record) => ( 
          <span>
             <a onClick={() => this._showUsers(record)} style={{marginRight: 10 }}>用户</a>
             <a onClick={() => this._editDepartment(record)} style={{marginRight: 10 }}>修改</a>
              <Popconfirm title="确定生效?" onConfirm={(e) => this._enableDepartmentStatus(record,e)}>
                <a style={{marginRight: 10 }}>生效</a>
              </Popconfirm>
                 <Popconfirm title="确定禁用?" onConfirm={(e) => this._disableDepartmentStatus(record,e)}>
                <a style={{marginRight: 10 }}>禁用</a>
              </Popconfirm>
         </span>
        )
      },
    ];
    return (
      <div className={styles.myTable} ref="MyDepartmentList">
        <div className={styles.operationBtn}>
            <Search
              addonBefore={selectBefore}
              placeholder="请输入搜索内容"
              style={{ width: 300 }}
              onSearch={this._onChange}
            />
          <Button type="primary" onClick={this._createDepartmentHandler}>新增部门</Button>
        </div>
        <div>
          <Table
            loading={this.props.department.loading}
            columns={columns}
            bordered
            dataSource={this.props.department.list}
            rowKey={record => record.id}
            onChange={this._onPageChange}
            pagination={this.props.department.pagination}
          />
        </div>
      </div>)
  }
}

export default connect((department)=>(department))(DepartmentList);
