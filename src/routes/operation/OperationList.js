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
import AddOperation from '../../components/AddOperation'
import  * as sysAppService from './../../services/sysAppService';
const Search = Input.Search;
const Option = Select.Option;

class OperationList extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      currentFilter:'operationName', //默认搜索名称
      sysList:[],
    };
  }

  /**
   * 组件渲染后加载数据
   */
  componentDidMount(){
    this._loadData(this.props.operation.pagination  || {});
    sysAppService.query({"status":"Y"}).then((res)=>{
      if(res.data){
        this.setState({sysList:res.data});
      }
    });
  }

  componentDidUpdate() {
    ReactDOM.findDOMNode(this.refs.MyOperationList.parentNode).scrollTop=0;
  }

  /**
   * 加载数据函数
   * @param params
   * @private
   */
  _loadData(params){
    params.pageSize=10;
    this.props.dispatch({
      type: 'operation/query',
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
   * 新增功能操作
   * @param values
   * @private
   */
  _createOperationHandler=(values) => {
    this.props.dispatch({
      type: 'operation/create',
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

  /**
   * 修改信息
   * @param values
   * @private
   */
  _editHandler=(values)=>{
    delete values['status'];
    this.props.dispatch({
      type: 'operation/update',
      payload: values
    });
  };
  _enableOperationStatus(record,e){
    e.stopPropagation();
    this.props.dispatch({
      type: 'operation/enable',
      payload: record
    });
  };
  _disableOperationStatus(record,e){
    e.stopPropagation();
    this.props.dispatch({
      type: 'operation/disable',
      payload: record
    });
  };

  render(){
    const selectBefore = (
      <Select defaultValue="operationName" onChange={this._handleSelectChange}>
        <Option value="operationName">功能操作名称</Option>
        <Option value="operationCode">功能操作编码</Option>
      </Select>
    );
    const columns = [
      {
        title: '功能操作编码',
        dataIndex: 'operationCode',
        key: 'operationCode',
      },
      {
        title: '功能操作名称',
        dataIndex: 'operationName',
        key: 'operationName',
      },
      {
        title: '拦截url前缀',
        dataIndex: 'urlPrefix',
        key: 'urlPrefix',
      },
      {
        title: '系统应用编码',
        dataIndex: 'sysCode',
        key: 'sysCode',
        render: (text) => text || '--'
      },
      {
        title: '系统应用名称',
        dataIndex: 'sysName',
        key: 'sysName',
        render: (text) => text || '--'
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
            <AddOperation record={record} onOk={this._editHandler} sysList={this.state.sysList || []}>
              <a  style={{marginRight: 10 }}>修改</a>
            </AddOperation>
                <Popconfirm title="确定生效?" onConfirm={(e) => this._enableOperationStatus(record,e)}>
            <a style={{marginRight: 10 }}>生效</a>
          </Popconfirm>
             <Popconfirm title="确定禁用?" onConfirm={(e) => this._disableOperationStatus(record,e)}>
            <a style={{marginRight: 10 }}>禁用</a>
          </Popconfirm>
      </span>
        )
      },
    ];
    return (
      <div className={styles.myTable} ref="MyOperationList">
        <div className={styles.operationBtn}>
          <Search
            addonBefore={selectBefore}
            placeholder="请输入搜索内容"
            style={{ width: 300 }}
            onSearch={this._onChange}
          />
          <AddOperation record={{}} onOk={this._createOperationHandler} sysList={this.state.sysList || []}>
            <Button type="primary">新增功能</Button>
          </AddOperation>
        </div>
        <div>
          <Table
            loading={this.props.operation.loading}
            columns={columns}
            bordered
            dataSource={this.props.operation.list}
            rowKey={record => record.id}
            onChange={this._onPageChange}
            pagination={this.props.operation.pagination}
          />
        </div>
      </div>)
  }
}

export default connect((operation)=>(operation))(OperationList);

