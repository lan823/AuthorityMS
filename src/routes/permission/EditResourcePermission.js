/**
 * Created by ecarx on 2017/8/19.
 * 权限编辑功能和资源的页面
 */
import React from 'react';
import { connect } from 'dva';
import { Link,routerRedux } from 'dva/router';
import { Table, Input, Button, Select,Popconfirm } from 'antd';
import styles from '../role/RolePermission.less';


const operationColumns = [{
  title: '系统应用名称',
  dataIndex: 'sysName',
  key: 'sysName'
}, {
  title: '功能操作ID',
  dataIndex: 'id',
  key: 'id'
},{
  title: '功能操作名称',
  dataIndex: 'operationName',
  key: 'operationName'
}];

const menuColumns = [{
  title: '系统应用名称',
  dataIndex: 'sysName',
  key: 'sysName'
}, {
  title: '菜单ID',
  dataIndex: 'id',
  key: 'id'
},{
  title: '菜单名称',
  dataIndex: 'menuName',
  key: 'menuName'
}];

class EditResourcePermission extends React.PureComponent{
  constructor(props){
    super(props);
    this.state= {
      permissionId:this.props.permission.currentRow.id
    }
  }
  componentDidMount(){
    let sysId = this.props.permission.currentRow.sysId;
    this.props.dispatch({
      type:'menu/query',
      payload:{
        pageSize:1000,
        sysId:sysId,
        status:'Y'
      }
    });
    this.props.dispatch({
    	type:'operation/query',
    	payload:{
    		pageSize:1000,
        sysId:sysId,
        status:'Y'
    	}
    });
    this.props.dispatch({
    	type:'permissionMenu/query',
    	payload:{
    		pageSize:1000
    	}
    })
    this.props.dispatch({
      type:'permissionOperation/query',
      payload:{
        pageSize:1000
      }
    })
  }

  render(){
    const relationOperationIds = [];
    const relationMenuIds = [];
  	//权限功能操作集合
    const operationSelection = {
      selectedRowKeys:this.props.permissionOperation.list.map(item => { relationOperationIds.push(item.id); return item.operationId;}),
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      //单条新增或删除
      onSelect: (record, selected, selectedRows) => {
        let permissionId = this.state.permissionId || this.props.permission.currentRow.id;
        if(selected){ //选中新增
          this.props.dispatch({
            type:'permissionOperation/create',
            payload:{
              permissionId:permissionId,
              operationId:record.id //权限ID
            }
          });
        }else{//取消删除
          let row = this.props.permissionOperation.list.filter(item=>{return item.operationId===record.id;});
          this.props.dispatch({
            type:'permissionOperation/delete',
            payload:{
              id:row[0].id //关系ID
            }
          });
        }
      },
      //批量新增或删除
      onSelectAll: (selected, selectedRows, changeRows) => {
        let permissionId = this.state.permissionId || this.props.permission.currentRow.id;
        if(selected){//全选选中
          let params = changeRows.map(item=>{
            return { permissionId:permissionId,operationId:item.id};
          });
          //处理批量插入参数
          this.props.dispatch({
            type:'permissionOperation/createMany',
            payload:params
          });
        }else{//全选删除
          this.props.dispatch({
            type:'permissionOperation/deleteMany',
            payload:{idArr:relationOperationIds}
          });
        }
    }
    };
  	//权限菜单操作集合
    const menuSelection = {
      selectedRowKeys:this.props.permissionMenu.list.map(item => { relationMenuIds.push(item.id); return item.menuId;}),
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      //单条新增或删除
      onSelect: (record, selected, selectedRows) => {
        let permissionId = this.state.permissionId || this.props.permission.currentRow.id;
        if(selected){ //选中新增
          this.props.dispatch({
            type:'permissionMenu/create',
            payload:{
              permissionId:permissionId,
              menuId:record.id //权限ID
            }
          });
        }else{//取消删除
          let row = this.props.permissionMenu.list.filter(item=>{return item.menuId===record.id;});
          this.props.dispatch({
            type:'permissionMenu/delete',
            payload:{
              id:row[0].id //关系ID
            }
          });
        }
      },
      //批量新增或删除
      onSelectAll: (selected, selectedRows, changeRows) => {
        let permissionId = this.state.permissionId || this.props.permission.currentRow.id;
        if(selected){
          let params = changeRows.map(item=>{
            return { permissionId:permissionId,menuId:item.id};
          });
          //处理批量插入参数
          this.props.dispatch({
            type:'permissionMenu/createMany',
            payload:params
          });
        }else{
          this.props.dispatch({
            type:'permissionMenu/deleteMany',
            payload:{idArr:relationMenuIds}
          });
        }
    }};

    return (
      <div className={styles.leftRightTable}>
        <div className={styles.textDescription}>{this.props.permission.currentRow.roleName || '暂无'} ：{this.props.permission.currentRow.permissionName}</div>
        <div className={styles.tableBlock}>
            <div style={{marginRight:50}}>
            	<h3>功能操作选择：</h3>
            	<Table rowKey={record=>record.id} columns={operationColumns} rowSelection={operationSelection} dataSource={this.props.operation.list} pagination={false} bordered/>
            </div>
            <div>
            	<h3>菜单选择：</h3>
	            <Table rowKey={record=>record.id} columns={menuColumns} rowSelection={menuSelection} dataSource={this.props.menu.list} pagination={false} bordered/>
            </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps({permission,menu,operation,permissionMenu,permissionOperation}){
  return {permission,menu,operation,permissionMenu,permissionOperation};
}
export default connect(mapStateToProps)(EditResourcePermission);

