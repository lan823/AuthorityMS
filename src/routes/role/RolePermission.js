/**
 * Created by ecarx on 2017/8/19.
 * 角色授权页面
 */
import React from 'react';
import { connect } from 'dva';
import { Link,routerRedux } from 'dva/router';
import { Table, Input, Button, Select,Popconfirm } from 'antd';
import styles from './RolePermission.less';


const columns = [{
  title: '权限编码',
  dataIndex: 'permissionCode',
  key: 'permissionCode'
}, {
  title: '权限名称',
  dataIndex: 'permissionName',
  key: 'permissionName'
},{
  title: '权限类型',
  dataIndex: 'permissionType',
  key: 'permissionType'
}];

class RolePermission extends React.PureComponent{
  constructor(props){
    super(props);
    this.state= {
      roleId:this.props.role.currentRow.id
    }
  }
  componentDidMount(){
    let sysId = this.props.role.currentRow.sysId;
    this.props.dispatch({
      type:'rolePermission/query',
      payload:{
        pageSize:1000
      }
    });
    this.props.dispatch({
      type:'permission/query',
      payload:{
        pageSize:1000,
        sysId:sysId,
        status:'Y'
      }
    });
  }

  componentWillUnmount(){
    this.props.dispatch(
      {
        type:'rolePermission/clear',
        payload:{
          list:[]
        }
      }
    );
  }
  render(){
    const relationPrimaryIds = [];
    const rowSelection = {
      selectedRowKeys:this.props.rolePermission.list.map(item =>{relationPrimaryIds.push(item.id); return item.permissionId;} ),
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      //单条新增或删除
      onSelect: (record, selected, selectedRows) => {
        let roleId = this.state.roleId;
        if(selected){ //选中新增
          this.props.dispatch({
            type:'rolePermission/create',
            payload:{
              roleId:roleId,
              permissionId:record.id //权限ID
            }
          });
        }else{//取消删除
          let row = this.props.rolePermission.list.filter(item=>{return item.permissionId===record.id;});
          this.props.dispatch({
            type:'rolePermission/delete',
            payload:{
              id:row[0].id //关系ID
            }
          });
        }
      },
      //批量新增或删除
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(changeRows);
        let roleId = this.state.roleId;
        let params = changeRows.map(item=>{
          return { roleId:roleId,permissionId:item.id};
        });
        if(selected){
          //处理批量插入参数
          this.props.dispatch({
            type:'rolePermission/createMany',
            payload:params
          });
        }else{
          //批量删除
          this.props.dispatch({
            type:'rolePermission/deleteMany',
            payload:{idArr:relationPrimaryIds}
          });
        }
      },
    };
    return (
      <div className={styles.leftRightTable}>
        <div className={styles.textDescription}>{this.props.role.currentRow.sysName || '暂无'} ：{this.props.role.currentRow.roleName}</div>
        <div className={styles.tableBlock}>
            <Table
              rowKey={record=>record.id}
              columns={columns}
              rowSelection={rowSelection}
              dataSource={this.props.permission.list}
              pagination={false}
              bordered/>
        </div>
      </div>
    );
  }
}
function mapStateToProps({role,permission,rolePermission}){
  return {role,permission,rolePermission};
}
export default connect(mapStateToProps)(RolePermission);

