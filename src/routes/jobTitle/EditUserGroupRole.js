/**
 * Created by ecarx on 2017/8/28.
 */
import React from 'react';
import { connect } from 'dva';
import { Tree } from 'antd';
import  * as sysAppService from './../../services/sysAppService';
import  * as roleService from './../../services/roleService';
import * as userGroupRoleService from './../../services/userGroupRoleService';
const TreeNode = Tree.TreeNode;

//disabled={item.key === '0-0-0'}
class EditUserGroupRole extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state={
      sysList:[],//系统应用列表
      expandedKeys: [],//默认展开的节点
      autoExpandParent: true,
      checkedKeys: [],//默认选中的节点
      selectedKeys: []
    }
  }

  componentDidMount(){
    this._loadRelation();
    sysAppService.query({"status":"Y"}).then((res)=>{
      if(res.data){
        this.setState({sysList:res.data});
      }
    });
  }

  _loadRelation(){//用户组角色关系
    this.props.dispatch({
      type:'userGroupRole/query',
      payload:{ pageSize:1000,postId:this.props.jobTitle.currentRow.id}
    });
  }

  onLoadData = (treeNode) => {//展开应用角色角色
    return new Promise((resolve) => {
      roleService.queryRoleList({sysId:treeNode.props.eventKey, pageSize:1000, "status":"Y"}).then(
        (res)=>{
          const treeData = this.state.sysList;
          const relationList = this.props.userGroupRole.list;
          let childrenList=[];
          let checklist = this.state.checkedKeys; //选中已有的关系
          if(res.data){
              childrenList = res.data.map(child=>{
                let checkState = relationList.filter(function(item){return item.roleId===child.id});
                if(checkState.length>0){//已有关系即选中
                  checklist.push('1-'+child.id);
                  child.primaryId = checkState[0].id;
                }
                child.isLeaf=true;
                return child;});
          }
          const newTreeData = treeData.map(item=>{
            if(item.id+''===treeNode.props.eventKey){
              item.children = childrenList;
            }
            return item;
          });
          this.setState({ sysList:newTreeData,checkedKeys:checklist});
          resolve();
        });
    });
  };
  onExpand = (expandedKeys) => {
    console.log('onExpand', arguments);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  onCheck = (checkedKeys, e) => {
    this.setState({
      checkedKeys
    });
    if(e.checked){
      this.props.dispatch({
        type:'userGroupRole/createMany',
        payload:checkedKeys
      });
    }else{
      if(e.node.props.children){
        let ids = e.node.props.children.map(item=> item.props.primaryId);
        this.props.dispatch({
          type:'userGroupRole/deleteMany',
          payload:{idArr:ids}
        });
      }else{
        this.props.dispatch({
          type:'userGroupRole/delete',
          payload:e.node.props.primaryId
        });
      }
    }
  };
  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys });
  };

/*  render() {
    const loop = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode key={item.key} title={item.sysName} disableCheckbox={item.key === '0-0-0'}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={item.sysName} />;
    });
    return (
      <Tree
        showLine
        checkable
        onExpand={this.onExpand}
        expandedKeys={this.state.expandedKeys}
        autoExpandParent={this.state.autoExpandParent}
        onCheck={this.onCheck}
        checkedKeys={this.state.checkedKeys}
        onSelect={this.onSelect}
        selectedKeys={this.state.selectedKeys}
      >
        {loop(this.state.sysList)}
      </Tree>

    );
  }*/
render(){
  // const checkedKeys = this.props.userGroupRole.list.map(item=>item.sysId);
  const loop = data => data.map((item) => {
    if (item.isLeaf) {//
      return <TreeNode title={item.roleName} key={'1-'+item.id} primaryId={item.primaryId} isLeaf={item.isLeaf} />;
    }else{
      if(item.children){
        return <TreeNode title={item.sysName} key={item.id}>{loop(item.children)}</TreeNode>;
      }else{
        return <TreeNode title={item.sysName} key={item.id} />;
      }
    }
  });
  const treeNodes = loop(this.state.sysList);
  return (
    <Tree
      showLine
      checkable
      onExpand={this.onExpand}
      expandedKeys={this.state.expandedKeys}
      autoExpandParent={this.state.autoExpandParent}
      onCheck={this.onCheck}
      checkedKeys={this.state.checkedKeys}
      onSelect={this.onSelect}
      selectedKeys={this.state.selectedKeys}
      loadData={this.onLoadData}>
      {treeNodes}
    </Tree>
  );
}
}

function mapStateToProps(state){
  const {jobTitle, userGroupRole} = state;

  return {
    jobTitle,userGroupRole
  };
}
export default connect(mapStateToProps)(EditUserGroupRole);
