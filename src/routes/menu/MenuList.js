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

class MenuList extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      currentFilter:'menuName' //默认搜索名称
    };
  }

  /**
   * 组件渲染后加载数据
   */
  componentDidMount(){
    this._loadData(this.props.menu.pagination  || {});
  }

  componentDidUpdate() {
    ReactDOM.findDOMNode(this.refs.MyMenuList.parentNode).scrollTop=0;
  }
  /**
   * 加载数据函数
   * @param params
   * @private
   */
  _loadData(params){
    params.pageSize=10;
    this.props.dispatch({
      type: 'menu/query',
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
  _createMenuHandler=({}) => {
    this.props.dispatch({
      type: 'menu/edit',
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
      type: 'menu/update',
      payload: values
    });
  };
  _enableMenuStatus(record,e){
    e.stopPropagation();
    this.props.dispatch({
      type: 'menu/enable',
      payload: record
    });
  };
  _disableMenuStatus(record,e){
    e.stopPropagation();
    this.props.dispatch({
      type: 'menu/disable',
      payload: record
    });
  };
  _editMenu(record){
    this.props.dispatch({
      type: 'menu/edit',
      payload:record
    });
  }

  render(){
    const selectBefore = (
      <Select defaultValue="menuName" onChange={this._handleSelectChange}>
        <Option value="menuName">菜单名称</Option>
      </Select>
    );
    const columns = [
      {
        title: '菜单名称',
        dataIndex: 'menuName',
        key: 'menuName',
      },
      {
        title: '菜单url',
        dataIndex: 'menuUrl',
        key: 'menuType',
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
        key: 'menu',
        render: (text, record) => (
          <span>
         <a onClick={() => this._editMenu(record)} style={{marginRight: 10 }}>修改</a>
               <Popconfirm title="确定生效?" onConfirm={(e) => this._enableMenuStatus(record,e)}>
            <a style={{marginRight: 10 }}>生效</a>
          </Popconfirm>
             <Popconfirm title="确定禁用?" onConfirm={(e) => this._disableMenuStatus(record,e)}>
            <a style={{marginRight: 10 }}>禁用</a>
          </Popconfirm>
      </span>
        )
      },
    ];
    return (
      <div className={styles.myTable} ref="MyMenuList">
        <div className={styles.operationBtn}>
          <Search
            addonBefore={selectBefore}
            placeholder="请输入搜索内容"
            style={{ width: 300 }}
            onSearch={this._onChange}
          />
          <Button type="primary" onClick={this._createMenuHandler}>新增菜单</Button>
        </div>
        <div>
          <Table
            loading={this.props.menu.loading}
            columns={columns}
            bordered
            dataSource={this.props.menu.list}
            rowKey={record => record.id}
            onChange={this._onPageChange}
            pagination={this.props.menu.pagination}
          />
        </div>
      </div>)
  }
}

export default connect((menu)=>(menu))(MenuList);
