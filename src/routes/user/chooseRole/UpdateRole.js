/**
 * Created by ecarx on 2017/8/22.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link,routerRedux } from 'dva/router';
import { Layout, Form, Button, Table} from 'antd';
import * as sysAppService from '../../../services/sysAppService.js'
import styles from './chooseRole.less';
import { Select } from 'antd';
const Option = Select.Option;

const delay = (ms) => new Promise(resolve =>
  setTimeout(resolve, ms)
);

class chooseRole extends React.Component {
  constructor(props){
    super(props);
    this.state={
      sysList : [],
      defaultOption:{},
      currentUserId:this.props.location.query.id
    };
  }

  componentDidMount(){
    sysAppService.query({"status":"Y"}).then((res)=>{
      if(res.data){
        this.setState({sysList:res.data,defaultOption:res.data[0]});
        this.getRoleListBySysId(res.data[0].id);
        this.getUserRole();
      }
    });
  }
  componentWillUnmount(){
    this.props.dispatch(
      {
        type:'userRole/clear',
        payload:{
          list:[],
          userId:null
        }
      }
    );
  }
  //获取当前应用下的角色列表
  getRoleListBySysId(id){
    this.props.dispatch({
      type:'role/query',
      payload:{
        sysId:id,
        pageSize:1000,
        status:'Y'
      }
    })
  };
  //获取当前用户的已有角色
  getUserRole(){
    this.props.dispatch({
      type:'userRole/query',
      payload:{
        userId:this.props.location.query.id,
        pageSize:1000
      }
    })
  };

  handleChange=(index)=> {
    let defaultOption = this.state.sysList[index];
    this.setState({defaultOption});
    this.getRoleListBySysId(defaultOption.id);
  };

  render(){
    const columns = [{
      title: '角色编码',
      dataIndex: 'roleCode',
      key: 'roleCode'
    }, {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName'
    },{
      title: '角色状态',
      dataIndex: 'status',
      key: 'status'
    }];
    const relationPrimaryIds = [];
    const rowSelection = {
      selectedRowKeys:this.props.userRole.list.map(item => { relationPrimaryIds.push(item.id); return item.roleId;}),
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      //单条新增或删除
      onSelect: (record, selected, selectedRows) => {
        let userId = this.state.currentUserId;
        if(selected){ //选中,新增
          this.props.dispatch({
            type:'userRole/create',
            payload:{
              roleId:record.id,
              userId: userId//权限ID
            }
          });
        }else{//取消,删除
          let row = this.props.userRole.list.filter(item=>{return item.roleId===record.id;});
          this.props.dispatch({
            type:'userRole/delete',
            payload:{
              id:row[0].id, //关系ID
            }
          });
        }
      },
      //批量新增或删除
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log("changeRows:::::",changeRows);
        let userId = this.state.currentUserId;
        if(selected){
          let params = changeRows.map(item=>{
            return { roleId:item.id,userId:userId};
          });
          //处理批量插入参数
          this.props.dispatch({
            type:'userRole/createMany',
            payload:params
          });
        }else{
          //批量删除
          this.props.dispatch({
            type:'userRole/deleteMany',
            payload:{idArr:relationPrimaryIds}
          });
        }
      },
    };
    const sysAppOptions = this.state.sysList.map((sysItem,index) => <Option key={index}>{sysItem.sysName}</Option>);
    return (
      <div>
        <Select
          showSearch
          value={this.state.defaultOption.sysName}
          style={{ width: 200 }}
          placeholder="选择应用"
          optionFilterProp="sysName"
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
        >
          { sysAppOptions }
        </Select>
        <div style={{marginTop:20,width:'30%'}}>
          <Table
            rowKey={record=>record.id}
            columns={columns}
            rowSelection={rowSelection}
            dataSource={this.props.role.list}
            pagination={false}
            bordered/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  let {sysApp,role,userRole} = state;
  return {
    sysApp,
    role,
    userRole
  }
}
export default connect(mapStateToProps)(Form.create()(chooseRole));
