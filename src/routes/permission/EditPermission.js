/**
 * Created by ecarx on 2017/8/18.
 */
import React from 'react';
import { connect } from 'dva';
import { Layout, Form, Input,Select,Button} from 'antd';
import  * as sysAppService from './../../services/sysAppService';
import styles from './EditForm.less'
const { Content} = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;

class EditPermission extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state={
      currentRecord:this.props.permission.currentRow || {},
      sysList:[],
      enum:[],
      defaultOption:{},
    }
  }

  componentDidMount(){
    this.props.dispatch({
      type: 'permission/search',
      payload: {}
    });
    sysAppService.query({"status":"Y"}).then((res)=>{
      if(res.data){
        this.setState({sysList:res.data});
      }
    });
    sysAppService.queryPermissionEnum().then(
      (res)=>{
        if(res.data){
          this.setState({enum:res.data});
        }
      }
    );
  }
  //
  _okHandler = () => {
    let currentRow = this.props.permission.currentRow || {};
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.sysId = this.state.defaultOption.id;
        if(currentRow.hasOwnProperty('id')){
          values.id = currentRow.id;
          delete values['status'];
          this.props.dispatch({
            type: 'permission/update',
            payload: values
          })
        }else{
          this.props.dispatch({
            type: 'permission/create',
            payload: values
          })
        }
      }
    });
  };
  _cancelBtn=()=>{
    this.props.dispatch({
      type: 'permission/cancel',
      payload: {}
    })
  };

  _handleChange=(value)=>{
    this.props.dispatch({
      type: 'permission/search',
      payload: {
        name:value
      }
    })
  };
  handleSelectChange=(index)=> {
    let defaultOption = this.state.sysList[index];
    this.setState({defaultOption});
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const currentRecord = this.props.permission.currentRow || {};
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 7},
    };
    const sysAppOptions = this.state.sysList.map((sysItem,index) => <Option key={index}>{sysItem.sysName}</Option>);
    const enumOptions = this.state.enum.map((item) => <Option key={item.code}>{item.name}</Option>);
    return (
      <Layout className={styles.editForm}>
        <Content>
          <Form>
            <FormItem
              {...formItemLayout}
              label=  "系统应用"
            >
              {
                getFieldDecorator('sysId', {
                  // initialValue: currentRecord.sysId || '',
                  initialValue: currentRecord.sysName || this.state.defaultOption.sysName,
                  rules: [{ required: true, message: '请输选择系统应用'}],
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
              label="权限类型"
            >
              {
                getFieldDecorator('permissionType', {
                  initialValue: currentRecord.permissionType,
                  rules: [{ required: true, message: '请选择权限类型' }],
                })(<Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="选择权限类型"
                  optionFilterProp="name"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                  { enumOptions }
                </Select>)
              }
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="权限编码"
              >
                {
                  getFieldDecorator('permissionCode', {
                    initialValue: currentRecord.permissionCode || '',
                    rules: [{ required: true, message: '请输入权限编码', whitespace: true }],
                  })(<Input />)
                }
              </FormItem>
            <FormItem
              {...formItemLayout}
              label="权限名称"
            >
              {
                getFieldDecorator('permissionName', {
                  initialValue: currentRecord.permissionName,
                  rules: [{ required: true, message: '请输入权限名称'}],
                })(<Input />)
              }
            </FormItem>
            <FormItem
              style={{ 'display':currentRecord.id? 'none':'block'}}
              {...formItemLayout}
              label="状态"
            >
              {
                getFieldDecorator('status', {
                initialValue: currentRecord.status || 'Y'
                })(<Select
                  style={{ width: '100%' }}
                  placeholder="请选择状态"
                >
                 <Option value={'Y'}>启用</Option>
                 <Option value={'N'}>禁用</Option>
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

export default connect((permission)=>(permission))(Form.create()(EditPermission));

