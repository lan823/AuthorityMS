/**
 * Created by ecarx on 2017/8/9.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link,routerRedux } from 'dva/router';
import { Layout, Form, Button, Tree } from 'antd';
import styles from './chooseRole.less';
import * as sysAppService from '../../../services/sysAppService.js'
import * as roleService from '../../../services/roleService.js'
import * as userService from '../../../services/userService.js'

const { Content,Footer } = Layout;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
let treeList=[];
function getNewTreeData(treeData, sysKey, child){
  treeData.map((item) => {
    if(item.id == sysKey){
      item.children = child;
      return ;
    }
  })
}
class chooseRole extends React.Component {
  state = {
    treeData: [],
    defaultCheckedKeys: [], //已有权限默认选中
    treeLoading:false,//
    expandedKeys:[],
    checkedKeys: []//修改结果
  }
  //应用列表
  getSysList(){
    sysAppService.query({"status":"Y"}).then((res)=>{
      if(res.data){
        if(res.data.length>0){
          res.data.map((item,index)=>{
            item.name = item.sysName;
            item.key = item.id;
            // item.type = 'sys';
            this.getSysRoles(item,item.id,index);
          })
        }
      }
    });
  }
  //用户角色关系表
  getUserRolesList(){
    userService.getUserRole({"userId":this.props.location.query.id}).then((res)=>{
      if(res.data && res.data.length>0){
        const checkedKeys = [];
        res.data.map((item)=>{
          checkedKeys.push(`0-${item.roleId}`);
        })
        this.setState({
          defaultCheckedKeys: checkedKeys,
          treeLoading:true,
          autoExpandParent: true,
          expandedKeys:checkedKeys
        })
      }
    });
  }
  //系统角色列表
  getSysRoles = (itemData, sysId, index)=>{
    roleService.query({status:"Y",sysId:sysId}).then((res)=>{
      if(res.data){
        if(res.data.length>0){
          res.data.map((item)=>{
            item.name = item.roleName;
            item.key = `0-${item.id}`;
            // item.type = 'role';
            item.isLeaf = true;
          })
          itemData.children = res.data;
          treeList.push(itemData);
          this.setState({ treeData: treeList });
          return res.data;
        }
      }
    })
  }
  cancelHandler = () => {
    console.log('routerRedux',routerRedux);
     this.props.dispatch(routerRedux.goBack());
  };
  onSubmit = ()=>{
    const userId = this.props.location.query.id;
    let list = [];
    const checkedKeys = this.state.checkedKeys;
    checkedKeys.map((checkedItem,index)=>{
      this.state.defaultCheckedKeys.map((defaultItem)=>{
        if(checkedItem == defaultItem){
          console.log(checkedItem)
          checkedKeys.splice(index, 1);
        }
      })
      // if(item.indexOf('0-')==0){
      //   list.push({userId,roleId:item.split("-")[1]})
      // }
      // console.log(list);
    })
          console.log(checkedKeys);
    // userService.chooseRole()
  }
  componentDidMount() {
    this.getSysList();
    this.getUserRolesList();

  };
  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys });
  };
  render() {
    console.log('treeNodes',this.state.treeData);
    const loop = data => data.map((item) => {
      if (item.children) {
        return <TreeNode title={item.name} key={item.key}>{loop(item.children)}</TreeNode>;
      }
      return <TreeNode title={item.name} key={item.key} type={item.type} isLeaf={item.isLeaf}/>;
    });
    const treeNodes = loop(this.state.treeData);
    return (
       <Layout className={styles.myUpdatePackage}>
        <Content>
          <Form>
            <FormItem>
              {this.state.treeLoading
                ?  <Tree
                checkable   //节点前添加 Checkbox 复选框
                defaultCheckedKeys={this.state.defaultCheckedKeys}  //（受控）设置选中的树节点
                onCheck={this.onCheck}  //点击复选框触发
                expandedKeys={this.state.expandedKeys}
              >
                {treeNodes}
              </Tree>
                : <p></p>
              }

            </FormItem>
            <FormItem className={styles.updateFooter}>
              <Button type="primary" style={{marginRight:40}} onClick={this.cancelHandler}>取消</Button>
              <Button type="primary" onClick={this.onSubmit}>保存</Button>
            </FormItem>
          </Form>
        </Content>
      </Layout>
    );
  }
}


export default connect((user)=>(user))(Form.create()(chooseRole));
