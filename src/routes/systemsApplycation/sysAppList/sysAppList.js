/**
 * Created by ecarx on 2017/8/7.
 */
import React from 'react';
import { connect } from 'dva';
import { Link,routerRedux } from 'dva/router';
import { Table, Input, Button, Select,Popconfirm} from 'antd';
import util from '../../../utils/util.js';
import ReactDOM from 'react-dom';
// import AddSoftwareModal from '../../components/AddSoftwareModal';
import styles from './sysAppList.less';
const Search = Input.Search;
const Option = Select.Option;
class SysAppList extends React.PureComponent {

  constructor(props){
    super(props);
    this.state = {
      currentFilter:'sysName' //默认搜索软件名称 
    };
  }

  /**
   * 组件渲染后加载数据
   */
  componentDidMount(){
    this._loadData(this.props.sysManage.pagination  || {});
  }

  componentDidUpdate() {
    ReactDOM.findDOMNode(this.refs.MySysList.parentNode).scrollTop=0;
  }
  /**
   * 加载数据函数
   * @param params
   * @private
   */ 
  _loadData(params){
    this.props.dispatch({
      type: 'sysManage/query',
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
      type: 'sysManage/create',
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
   * 修改软件信息
   * @param values
   * @private
   */
   _enableSysAppListStatus(record,e){
    e.stopPropagation();
      console.log("record",record)
    this.props.dispatch({
      type: 'sysManage/enable',
      payload: record
    });
  };
  _disableSysAppListStatus(record,e){
    e.stopPropagation();
    console.log("record",record)
    this.props.dispatch({
      type: 'sysManage/disable',
      payload: record
    });
  };
  _editsysManage(record){
    this.props.dispatch({
      type: 'sysManage/edit',
      payload:record
    });
  }
  _editHandler=(values)=>{
    this.props.dispatch({
      type: 'sysManage/update',
      payload: values
    });
  };
  _editSysAppList(record){
    this.props.dispatch({
      type: 'sysManage/edit',
      payload:record
    });
  }

  /**
   * 获取记录详情
   * @param record
   * @private
   */
  _goDetail=(record)=>{
 /*   onRowClick={this._goDetail}*/
    this.props.dispatch()
  };

  /**进入升级包列表
   *
   * @param record
   * @private
   */
  _goUpdatePackage(record,e){
    e.stopPropagation();
    this.props.dispatch(
      routerRedux.push({pathname: '/updatePackageList',query: {'id': record.id}}));
  };

  render(){
    const selectBefore = (
      <Select defaultValue="sysName" onChange={this._handleSelectChange}>
        <Option value="sysName">应用名称</Option>
      </Select>
    );
    const columns = [
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
        title: '系统应用域名',
        dataIndex: 'sysDomain',
        key: 'sysDomain',
        render: (text) => (text && <a href={text} target="_blank">{text}</a> || '--')
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
        title: '最后修改人',
        dataIndex: 'lastUser',
        key: 'lastUser',
        render: (text) => text || '--'
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
          <Link to={{pathname:'/emitApply',query:{id:record.id}}} style={{marginRight: 10 }}>修改</Link>
          <Popconfirm title="确定生效?" onConfirm={(e) => this._enableSysAppListStatus(record,e)}>
            <a style={{marginRight: 10 }}>生效</a>
          </Popconfirm>
             <Popconfirm title="确定禁用?" onConfirm={(e) => this._disableSysAppListStatus(record,e)}>
            <a style={{marginRight: 10 }}>禁用</a>
          </Popconfirm>

      </span>
        )
      },
    ];
    return (
      <div className={styles.myTable} ref="MySysList">
        <div className={styles.operationBtn}>
          <Search
            addonBefore={selectBefore}
            placeholder="请输入搜索内容"
            style={{ width: 300 }}
            onSearch={this._onChange}
          />
          <Link to={{pathname:'/emitApply'}}><Button type="primary">新增应用</Button></Link>
        </div>

        <div>
          <Table
            loading={this.props.sysManage.loading}
            columns={columns}
            bordered
            dataSource={this.props.sysManage.list}
            rowKey={record => record.id}
            onChange={this._onPageChange}
            pagination={this.props.sysManage.pagination}
          />
        </div>
      </div>)
  }
}

function mapStateToProps({sysManage}){
  return { sysManage };
}
export default connect(mapStateToProps)(SysAppList);

