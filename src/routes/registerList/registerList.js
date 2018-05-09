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
import Addregister from '../../components/Addregister'
import  * as sysAppService from './../../services/sysAppService';
const Search = Input.Search;
const Option = Select.Option;

class registerList extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      currentFilter:'appCode', //默认搜索名称
      sysList:[],
    };
  }

  /**
   * 组件渲染后加载数据
   */
  componentDidMount(){
    this._loadData(this.props.register.pagination  || {});
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
      type: 'register/query',
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
  	console.log('_handleSelectChange::',value)
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
      type: 'register/create',
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
    console.log('_editHandler::',values)
    delete values['status'];
    this.props.dispatch({
      type: 'register/update',
      payload: values
    });
  };
  render(){
    const selectBefore = (
      <Select defaultValue="appCode" onChange={this._handleSelectChange}>
        <Option value="appCode">app编码</Option>
      </Select>
    );
    const columns = [
      {
        title: 'app编码',
        dataIndex: 'appCode',
        key: 'appCode',
      },
      {
        title: 'app名称',
        dataIndex: 'appName',
        key: 'appName',
      },
      {
        title: 'app密钥',
        dataIndex: 'appSecret',
        key: 'appSecret',
      },
      {
        title: '描述',
        dataIndex: 'remarks',
        key: 'remarks',
        render: (text) => text || '--'
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
        render: (text) => util.dataFormat(text,'yyyy-MM-dd')
      },
      {
        title: '最后修改时间',
        dataIndex: 'gmtModified',
        key: 'gmtModified',
        render: (text) => util.dataFormat(text,'yyyy-MM-dd')
      },
      {
        title: '操作',
        key: 'register',
        render: (text, record) => (
          <span>
            <Addregister record={record} onOk={this._editHandler} sysList={this.state.sysList || []}>
              <a  style={{marginRight: 10 }}>修改</a>
            </Addregister>
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
          <Addregister record={{}} onOk={this._createOperationHandler} sysList={this.state.sysList || []}>
            <Button type="primary">新增功能</Button>
          </Addregister>
        </div>
        <div>
          <Table
            loading={this.props.register.loading}
            columns={columns}
            bordered
            dataSource={this.props.register.list}
            rowKey={record => record.id}
            onChange={this._onPageChange}
            pagination={this.props.register.pagination}
          />
        </div>
      </div>)
  }
}

export default connect((register)=>(register))(registerList);

