/**
 * Created by ecarx on 2017/8/22.
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Layout, Form, Input, Button} from 'antd';
import styles from '../permission/EditForm.less'
const { Content} = Layout;
const FormItem = Form.Item;

class ChangePassword extends React.PureComponent {
  constructor(){
    super();
    this.state = {
      confirmDirty: false
    };
  }
  _okHandler = () => {
    const that = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        delete values['reNewPasswd'];
        that.props.dispatch({
          type: 'common/changePassword',
          payload: values
        })
      }
    });
  };
  _cancelBtn=()=>{
     this.props.dispatch(routerRedux.goBack());
  };
  _handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
  _checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPasswd')) {
      callback('两次密码输入不一致!');
    } else {
      callback();
    }
  };
  _checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['reNewPasswd'], { force: true });
    }
    callback();
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 7 },
    };

    return (
      <Layout className={styles.editForm}>
        <Content>
          <Form>
            <FormItem
              {...formItemLayout}
              label="旧密码"
            >
              {getFieldDecorator('oldPasswd', {
                rules: [{ 
                  required: true, message: '请输入旧密码', whitespace: true }],
                })(
                  <Input type="password" placeholder="请输入旧密码" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="新密码"
              hasFeedback
            >
              {getFieldDecorator('newPasswd', {
                rules: [{ 
                  required: true, message: '请输入新密码'
                },{
                  validator: this._checkConfirm,
                }],
              })(
                <Input type="password" placeholder="请输入新密码" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="新密码"
              hasFeedback
            >
              {getFieldDecorator('reNewPasswd', {
                rules: [{ 
                  required: true, message: '请再次输入新密码'
                },{
                  validator: this._checkPassword,
                }],
              })(
                <Input type="password" placeholder="请再次输入新密码" onBlur={this._handleConfirmBlur} />
              )}
            </FormItem>
            <FormItem
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 16, offset: 3 },
              }} 
              className={styles.updateFooter}>
              <Button style={{marginRight:40}} onClick={this._cancelBtn}>取消</Button>
              <Button type="primary"   onClick={this._okHandler}>保存</Button>
            </FormItem>
          </Form>
        </Content>
      </Layout>
    );
  }
}

export default connect((common)=>(common))(Form.create()(ChangePassword));

