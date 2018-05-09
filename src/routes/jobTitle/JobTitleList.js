/**
 * Created by ecarx on 2017/8/19.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { Link,routerRedux } from 'dva/router';
import { Table, Input, Button, Select,Popconfirm } from 'antd';
import util from './../../utils/util';
import AddPostModal from './../../components/AddPostModal';
import styles from './../role/RoleList.less';
const Search = Input.Search;
const Option = Select.Option;

class JobTitleList extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      currentFilter:'postName' //默认搜索名称
    };
  }
  /**
   * 组件渲染后加载数据
   */
  componentDidMount(){
    this._loadData(this.props.jobTitle.pagination  || {});
  }
  componentDidUpdate() {
    ReactDOM.findDOMNode(this.refs.MyJobList.parentNode).scrollTop=0;
  }
  /**
   * 加载数据函数
   * @param params
   */
  _loadData(params){
    this.props.dispatch({
      type: 'jobTitle/query',
      payload: params,
    });
  }
  /**
   * 搜索功能
   * @param value
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
   */
  _handleSelectChange=(value)=> {
    this.setState({
      currentFilter:value
    });
  };

  /**
   * 列表分页
   * @param pageObject
   */
  _onPageChange=(pageObject)=> {
    this._loadData({pageSize:10,pageIndex:pageObject.current-1});
  };

  /**
   * 修改用户组信息
   * @param values
   */
  _editHandler=(values)=>{
    delete values['status'];
    this.props.dispatch({
      type: 'jobTitle/update',
      payload: values
    });
  };
  /**
   * 新增用户组
   * @param values
   */
  _createPostHandler=(values) => {
    console.log('values',values);
    this.props.dispatch({
      type: 'jobTitle/create',
      payload: values,
    });
  };
  _enableJobTitleStatus(record,e){
    e.stopPropagation();
    this.props.dispatch({
      type: 'jobTitle/enable',
      payload: record
    });
  };
  _disableJobTitleStatus(record,e){
    e.stopPropagation();
    this.props.dispatch({
      type: 'jobTitle/disable',
      payload: record
    });
  };

  //修改用户组的角色
  _editRoleHandler=(values)=>{
    this.props.dispatch({
      type: 'jobTitle/editRole',
      payload: values
    });
  };

  render(){
    const selectBefore = (
      <Select defaultValue="postName" onChange={this._handleSelectChange}>
        <Option value="postName">用户组名称</Option>
      </Select>
    );
    const columns = [
      {
        title: '用户组编码',
        dataIndex: 'postCode',
        key: 'postCode',
      },
      {
        title: '用户组名称',
        dataIndex: 'postName',
        key: 'postName',
      },
/*      {
        title: '用户组层级',
        dataIndex: 'postLevel',
        key: 'postLevel',
      },*/
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
        key: 'jobTitle',
        render: (text, record) => (
          <span>
             <a onClick={() => this._editRoleHandler(record)} style={{marginRight: 10 }}>修改角色</a>
              <AddPostModal record={record} onOk={this._editHandler}>
                    <a  style={{marginRight: 10 }}>编辑</a>
              </AddPostModal>
                 <Popconfirm title="确定生效?" onConfirm={(e) => this._enableJobTitleStatus(record,e)}>
                <a style={{marginRight: 10 }}>生效</a>
              </Popconfirm>
                 <Popconfirm title="确定禁用?" onConfirm={(e) => this._disableJobTitleStatus(record,e)}>
                <a style={{marginRight: 10 }}>禁用</a>
              </Popconfirm>
          </span>
        )
      },
    ];
    return (
      <div className={styles.myTable} ref="MyJobList">
        <div className={styles.operationBtn}>
          <Search
            addonBefore={selectBefore}
            placeholder="请输入搜索内容"
            style={{ width: 300 }}
            onSearch={this._onChange}
          />
          <AddPostModal record={{}} onOk={this._createPostHandler}>
            <Button type="primary">新增用户组</Button>
          </AddPostModal>
        </div>
        <div>
          <Table
            loading={this.props.jobTitle.loading}
            columns={columns}
            bordered
            dataSource={this.props.jobTitle.list}
            rowKey={record => record.id}
            onChange={this._onPageChange}
            pagination={this.props.jobTitle.pagination}
          />
        </div>
      </div>)
  }
}

export default connect((jobTitle)=>(jobTitle))(JobTitleList);
