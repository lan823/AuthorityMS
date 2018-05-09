/**
 * Created by ecarx on 2017/8/9.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link,routerRedux } from 'dva/router';
import { Layout, Form, Input,Select,Button, InputNumber, Switch, Radio, Slider, Upload, Icon,Row,Col} from 'antd';
import styles from './editUser.less';
import { patch } from '../../../services/userService';

const { Content,Footer } = Layout;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const FormItem = Form.Item;
const Option = Select.Option;

class EditUser extends Component {

  constructor(props) {
    super(props);
    this.state={
      confirmDirty: false,
      currentRecord: {},
      userGroups:'' //用户组id字符串，以逗号隔开
    }
  }
  componentDidMount() {
    if(this.props.location.query.id){
      patch(this.props.location.query.id).then((res)=>{
        this.setState({
          currentRecord: res.data || {}
        })
      })
    }
    this.props.dispatch({
      type:'jobTitle/query',
      payload:{
        pageSize:1000,
        status:'Y'
      }
    });
    this.props.dispatch({
      type:'department/query',
      payload:{
        pageSize:1000,
        status:'Y'
      }
    });
  }
  _cancelHandler = () => {
    console.log('routerRedux',routerRedux);
     this.props.dispatch(routerRedux.goBack());
  };
  _okHandler = () => {
    let currentRow = this.state.currentRecord;
    this.props.form.validateFields((err, values) => {
      if (!err) {//修改
        delete values['rePasswd'];
        values.depId === currentRow.depName ? values.depId = currentRow.depId : true;
        if(currentRow.hasOwnProperty('id')){
          values.id = currentRow.id;
          this.props.dispatch({
            type: 'user/update',
            payload: values
          })
        }else{//新建
          this.props.dispatch({
            type: 'user/create',
            payload: values
          })
        }
      }
    });
  };
  _cancelBtn=()=>{
    this.props.form.resetFields();
  };
  _handleChange=(value)=>{
  this.setState({userGroups:value});

};
  _handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
  _checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码输入不一致!');
    } else {
      callback();
    }
  };
  _checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['rePasswd'], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const currentRecord = this.state.currentRecord;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 7 },
    };
    const buttonLayout = {
      wrapperCol: { span: 7 ,offset: 3},
    };

    const children = [];
    this.props.jobTitle.list.map(item=>{
      children.push(<Option key={item.id}>{item.postName}</Option>);
    });
    const departmentOption = this.props.department.list.map(department =><Option key={department.id}>{department.depName}</Option>);

    return (
      <Layout className={styles.myUpdatePackage}>
        <Content>
          <Form>
            <FormItem
                {...formItemLayout}
                label="工号"
              >
                {
                  getFieldDecorator('jobNo', {
                    initialValue: currentRecord.jobNo,
                    rules: [{ required: true, message: '请输入工号', whitespace: true }],
                  })(<Input />)
                }
              </FormItem>
            <FormItem
              {...formItemLayout}
              label="部门"
            >
              {
                getFieldDecorator('depId', {
                  initialValue: currentRecord.depName,
                  rules: [{ required: true, message: '请选择所属部门' }],
                })( <Select
                    size="default"
                    placeholder="请选择所属部门"
                    style={{ width: '100%' }}
                  >
                    {departmentOption}
                </Select>)}
                </FormItem>
            <FormItem
              {...formItemLayout}
              label="用户账号"
            >
              {
                getFieldDecorator('userName', {
                  initialValue: currentRecord.userName,
                  rules: [{ required: true, message: '请输入用户账号', whitespace: true }],
                })(<Input/>)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="用户昵称"
            >
              {
                getFieldDecorator('nickName', {
                  initialValue: currentRecord.nickName
                })(<Input />)
              }
            </FormItem>
            {!this.props.location.query.id && <FormItem
              {...formItemLayout}
              label="密码"
            >
              {
                getFieldDecorator('password', {
                  initialValue: currentRecord.password,
                  rules: [{ required: true, message: '请输入密码', whitespace: true }],
                })(<Input type="password"/>)
              }
            </FormItem>}
            {!this.props.location.query.id &&  <FormItem
              {...formItemLayout}
              label="确认密码"
              hasFeedback
            >
              {getFieldDecorator('rePasswd', {
                rules: [{
                  required: true, message: '请再次输入密码'
                },{
                  validator: this._checkPassword,
                }],
              })(
                <Input type="password" placeholder="请再次输入密码" onBlur={this._handleConfirmBlur} />
              )}
            </FormItem>}
            <FormItem
              {...formItemLayout}
              label="真实姓名"
            >
              {
                getFieldDecorator('realName', {
                  initialValue: currentRecord.realName,
                  rules: [{ required: true, message: '请输入真实姓名', whitespace: true }],
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="用户邮箱"
            >
              {
                getFieldDecorator('email', {
                  initialValue: currentRecord.email,
                  rules: [
                    { type: 'email', message: '请输入正确的邮箱!' }],
                })((<Input/>))
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="手机号"
            >
              {
                getFieldDecorator('mobile', {
                  initialValue: currentRecord.mobile,
                  rules: [
                    { pattern:/^1[34578]\d{9}$/, message: '请输入正确的手机号' }],
                })((<Input parser={value => value.replace(/[A-Za-z]/g, '')}/>))
              }
            </FormItem><FormItem
              {...formItemLayout}
              label="固定电话"
            >
              {
                getFieldDecorator('phone', {
                  initialValue: currentRecord.phone,
                  rules: [
                    { pattern: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/, message: '请输入正确的电话号码' }],
                })((<Input parser={value => value.replace(/[A-Za-z]/g, '')}/>))
              }
            </FormItem>
            {!currentRecord.jobNo &&
            <FormItem
              {...formItemLayout}
              label="用户组"
            >
              {
                getFieldDecorator('userGroups', {
                  initialValue: currentRecord.userGroups || [],
                })( <Select
                  mode="multiple"
                  size="default"
                  placeholder="请选择用户组"
                  onChange={this._handleChange}
                  style={{ width: '100%' }}
                >
                  {children}
                </Select>)
              }
            </FormItem>}
            <FormItem {...buttonLayout} className={styles.updateFooter}>
              <Button style={{marginRight:40}} onClick={this._cancelHandler}>取消</Button>
              <Button type="primary" onClick={this._okHandler}>保存</Button>
            </FormItem>
          </Form>
        </Content>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  let { user, jobTitle,department } = state;
  return {
    user,
    jobTitle,
    department
  }

}

export default connect(mapStateToProps)(Form.create()(EditUser));


