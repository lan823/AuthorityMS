/**
 * Created by ecarx on 2017/8/19.
 * 角色授权页面
 */
import React from 'react';
import { connect } from 'dva';
import { Link,routerRedux } from 'dva/router';
import { Table, Input, Button, Select,Popconfirm } from 'antd';
import styles from '../../role/RolePermission.less';


const columns = [{
  title: '用户组编码',
  dataIndex: 'postCode',
  key: 'postCode'
}, {
  title: '用户组名称',
  dataIndex: 'postName',
  key: 'postName'
},{
  title: '用户组层级',
  dataIndex: 'postLevel',
  key: 'postLevel'
}];

class UserChoosePost extends React.PureComponent{
  constructor(props){
    super(props);
    this.state= {
      userId:this.props.user.currentRow.id
    }
  }
  componentDidMount(){
    this.props.dispatch({
      type:'jobTitle/query',
      payload:{
        pageSize:1000,
        status:'Y'
      }
    });
    this.props.dispatch({
      type:'userPost/query',
      payload:{
        pageSize:1000
      }
    })
  }

  render(){
    const relationPrimaryIds = [];
    const rowSelection = {
      selectedRowKeys:this.props.userPost.list.map(item => { relationPrimaryIds.push(item.id); return item.postId;}),
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      //单条新增或删除
      onSelect: (record, selected, selectedRows) => {
        let userId = this.state.userId;
        if(selected){ //选中新增
          this.props.dispatch({
            type:'userPost/create',
            payload:{
              userId:userId,
              postId:record.id //权限ID
            }
          });
        }else{//取消删除
          let row = this.props.userPost.list.filter(item=>{return item.postId===record.id;});
          this.props.dispatch({
            type:'userPost/delete',
            payload:{
              id:row[0].id //关系ID
            }
          });
        }
      },
      //批量新增或删除
      onSelectAll: (selected, selectedRows, changeRows) => {
        let userId = this.state.userId;
        if(selected){//全选选中
          let params = changeRows.map(item=>{
            return { userId:userId,postId:item.id};
          });
          //处理批量插入参数
          this.props.dispatch({
            type:'userPost/createMany',
            payload:params
          });
        }else{//全选删除
          this.props.dispatch({
            type:'userPost/deleteMany',
            payload:{idArr:relationPrimaryIds}
          });
        }
      },
    };

    return (
      <div className={styles.leftRightTable}>
        <div className={styles.textDescription}>用户名 ：{this.props.user.currentRow.userName}</div>
        <div className={styles.tableBlock}>
            <Table rowKey={record=>record.id} columns={columns} rowSelection={rowSelection} dataSource={this.props.jobTitle.list} pagination={false} bordered/>
        </div>
      </div>
    );
  }
}
function mapStateToProps({user,jobTitle,userPost,rolePermission}){
  return {user,jobTitle,userPost,rolePermission};
}
export default connect(mapStateToProps)(UserChoosePost);

