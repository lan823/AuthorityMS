/**
 * Created by ecarx on 2017/8/8.
 */
import React, { Component } from 'react';
import { Modal, Form, Input,Select } from 'antd';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;

class StatusModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
	
	/**
   * 显示modal
   */
  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };
	/**
   * 隐藏modal
   */
  hideModelHandler = () => {
    // this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  };
	/**
   * 提交数据
   */
  okHandler = () => {
    const { id } = this.props.record;
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.id = id;
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { status } = this.props.record;
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
          title="选择用户状态"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="用户状态"
            >
              {
                getFieldDecorator('status', {
                  initialValue: status || 'Y',
                  rules: [{ required: true, message: '请选择用户状态', whitespace: true }],
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

export default Form.create()(StatusModal);

