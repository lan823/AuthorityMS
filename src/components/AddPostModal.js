/**
 * Created by ecarx on 2017/8/18.
 */
/**
 * Created by ecarx on 2017/8/8.
 */
import React, { Component } from 'react';
import { Modal, Form, Input,Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class AddPostModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    let key = this.props.record.id;
    const { onOk } = this.props;
    console.log('okHandler::',this.props);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.id = key;
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {id,postCode,postName,postLevel,status} = this.props.record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
      return (
        <span>
        <span onClick={this.showModelHandler}>
          { children }
        </span>
        <Modal
          title="用户组详情"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="用户组编码"
            >
              {
                getFieldDecorator('postCode', {
                  initialValue: postCode,
                  rules: [{ required: true,  message: '请输入用户组唯一识别码',whitespace: true }],
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="用户组名称"
            >
              {
                getFieldDecorator('postName', {
                  initialValue: postName,
                  rules: [{ required: true, message: '请输入用户组名称', whitespace: true }],
                })(<Input />)
              }
            </FormItem>
{/*            <FormItem
              {...formItemLayout}
              label="用户组层级"
            >
              {
                getFieldDecorator('postLevel', {
                  initialValue: postLevel,
                })(<Input />)
              }
            </FormItem>*/}
            <FormItem
              style={{ 'display':this.props.record.id? 'none':'block'}}
              {...formItemLayout}
              label="状态">
              {
                getFieldDecorator('status', {
                  initialValue: status || 'Y',
                })(<Select>
                  <Option value="Y">启用</Option>
                  <Option value="N">禁用</Option>
                </Select>)
              }
            </FormItem>
          </Form>
        </Modal>
      </span>
      );
  }
}

export default Form.create()(AddPostModal);
