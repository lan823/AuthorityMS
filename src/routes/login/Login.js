/**
 * Created by ecarx on 2017/7/27.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Button, Form, Input, Icon ,Row, Col} from 'antd';
import styles from './Login.less';

const FormItem = Form.Item;
class Login extends React.PureComponent{
  constructor(){
    super();
  }
  componentDidMount(){
   this.getCaptcha();
  };
  getCaptcha = ()=> {
    this.props.dispatch({ type: 'common/captcha'});
  };
  handleOk=()=> {
    this.props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        value.identityId = this.props.common.captchaCode.identityId;
        this.props.dispatch({ type: 'common/login', loginInfo: value });

      }

    });
  };
  render(){
    {/*loading={this.props.common.loginLoading}*/}
    const { getFieldDecorator } = this.props.form;
    const captchaCode = this.props.common.captchaCode.identityCode || '';
    return (
      <div className={styles.login}>
        <div className={styles.login_header}>欢迎登陆用户管理平台 V1.0</div>
        <div className={styles.login_center}>
          <div>
            <div className={styles.login_logo}>用户管理平台</div>
            {/*<img alt={'logo'} src="statics/logo.jpg" />*/}
            <div className={styles.login_span}>-  MANAGEMENT PLATFORM  -</div>
            <Form style={{ maxWidth: 400 }}>
              <FormItem>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: '请输入用户名!' }],
                })(
                  <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />}  placeholder="请输入用户名" />,
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码!' }],
                })(
                  <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password"  placeholder="请输入密码" />,
                )}
              </FormItem>
              <FormItem>
                <Row gutter={10}>
                  <Col span={12}>
                    {getFieldDecorator('identifyingCode', {
                      rules: [{ required:true, message: '请输入验证码!' }],
                    })(
                      <Input size="large" />
                    )}
                  </Col>
                  <Col span={8}>
                    <div className={styles.captcha}>{captchaCode}</div>
                  </Col>
                  <Col span={4}>
                    <Button type="primary" shape="circle" icon="reload" onClick={this.getCaptcha}/>
                  </Col>

                </Row>
              </FormItem>
              <Button style={{ height: 30, width: '100%' }} type="primary" onClick={this.handleOk}>
                登录
              </Button>
            </Form>
          </div>
        </div>
        <div className={styles.login_footer}>版权所有 2017 ecarx.com.cn</div>
      </div>
    );
  }
}
Login.propTypes = {
  form: PropTypes.object.isRequired,
  common: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(({ common }) => ({ common }))(Form.create()(Login));

