/**
 * Created by ecarx on 2017/8/23.
 */
import React from 'react';
import { connect } from 'dva';
import { Layout, Form, Input,Select,Button} from 'antd';
import  * as sysAppService from './../../services/sysAppService';
import styles from './EditMenu.less'
const { Content} = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;

class EditMenu extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state={
      // currentRecord:this.props.menu.currentRow || {},
      sysList:[],
      defaultOption:{},
    }
  }

  componentDidMount(){
    let sysId = this.props.menu.currentRow.sysId;
    sysAppService.query({"status":"Y"}).then((res)=>{
      if(res.data){
        this.setState({sysList:res.data});
        this._loadParentMenu(sysId|| res.data[0].id);
      }
    });
  }

  _loadParentMenu(sysId){
    this.props.dispatch({
      type:'menu/query',
      payload:{
        pageSize:1000,
        sysId:sysId,
        status:'Y'
      }
    });
  }
  //
  _okHandler = () => {
    let currentRow = this.props.menu.currentRow || {};
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.sysId = this.state.defaultOption.id;
        if(currentRow.hasOwnProperty('id')){
          values.id = currentRow.id;
          values.parentId===currentRow.parentMenuName ?  values.parentId = currentRow.parentId : true;
          delete values['status'];
          this.props.dispatch({
            type: 'menu/update',
            payload: values
          })
        }else{
          this.props.dispatch({
            type: 'menu/create',
            payload: values
          })
        }
      }
    });
  };
  _cancelBtn=()=>{
    this.props.dispatch({
      type: 'menu/cancel',
      payload: {}
    })
  };

  _handleChange=(value)=>{
    this.props.dispatch({
      type: 'menu/search',
      payload: {
        name:value
      }
    })
  };
  handleSelectChange=(index)=> {
    let defaultOption = this.state.sysList[index];
    this.setState({defaultOption});
    this._loadParentMenu(defaultOption.id);//更新菜单列表
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const currentRecord = this.props.menu.currentRow || {};
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 7 },
    };
    const sysAppOptions = this.state.sysList.map((sysItem,index) => <Option key={index}>{sysItem.sysName}</Option>);
    const menuOptions = this.props.menu.list.map((item,index) => <Option key={item.id}>{item.menuName}</Option>);
    return (
      <Layout className={styles.editForm}>
        <Content>
          <Form>
            <FormItem
              {...formItemLayout}
              label="系统应用"
            >
              {
                getFieldDecorator('sysId', {
                  initialValue: currentRecord.sysName || this.state.defaultOption.sysName,
                  rules: [{ required: true, message: '请输入选择系统应用'}],
                })(<Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="选择应用"
                  optionFilterProp="sysName"
                  onChange={this.handleSelectChange}
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                  { sysAppOptions }
                </Select>)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="父节点">
              {
                getFieldDecorator('parentId', {
                  initialValue: currentRecord.parentMenuName || '',
                })(<Select
                  showSearch
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="选择父节点"
                  optionFilterProp="menuName"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                  { menuOptions }
                </Select>)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="菜单名称"
            >
              {
                getFieldDecorator('menuName', {
                  initialValue: currentRecord.menuName,
                  rules: [{ required: true, message: '请输入菜单名称', whitespace: true }],
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="菜单url"
            >
              {
                getFieldDecorator('menuUrl', {
                  initialValue: currentRecord.menuUrl,
                  rules: [{ required: true, message: '请输入菜单url', whitespace: true }],
                })(<Input />)
              }
            </FormItem>
            <FormItem
              style={{ 'display':currentRecord.id? 'none':'block'}}
              {...formItemLayout}
              label="状态">
              {
                getFieldDecorator('status', {
                  initialValue: currentRecord.status || 'Y',
                  rules: [{ required: true, message: '请选择部门状态', whitespace: true }],
                })(<Select>
                  <Option value="Y">启用</Option>
                  <Option value="N">禁用</Option>
                </Select>)
              }
            </FormItem>
            <FormItem
              wrapperCol={{
                  xs: { span: 24, offset: 0 },
                  sm: { span: 16, offset: 3 },
                   }}
              className={styles.updateFooter}
             >
              <Button style={{marginRight:40}} onClick={this._cancelBtn}>取消</Button>
              <Button type="primary"   onClick={this._okHandler}>保存</Button>
            </FormItem>
          </Form>
        </Content>
      </Layout>
    );
  }
}

export default connect((menu)=>(menu))(Form.create()(EditMenu));
