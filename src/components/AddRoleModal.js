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

class AddRoleModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      defaultOption:{},
    };
  }
  componentDidMount(){
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
        values.sysId = this.state.defaultOption.id;
        values.id = key;
        onOk(values);
        this.hideModelHandler();
      }
    });
  };
  handleSelectChange=(index)=> {
    let defaultOption = this.props.sysList[index];
    this.setState({defaultOption});
  };

  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {id,roleCode,roleName,sysId,status,sysName} = this.props.record;
    const sysAppOptions = this.props.sysList.map((sysItem,index) => <Option key={index}>{sysItem.sysName}</Option>);
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
          title="角色详情"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="系统应用"
            >
              {
                getFieldDecorator('sysId', {
                  initialValue: sysName || this.state.defaultOption.sysName,
                  rules: [{ required: true, message: '请选择系统应用'}],
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
              label="角色编码"
            >
              {
                getFieldDecorator('roleCode', {
                  initialValue: roleCode,
                  rules: [{ required: true, whitespace: true }],
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="角色名称"
            >
              {
                getFieldDecorator('roleName', {
                  initialValue: roleName,
                  rules: [{ required: true, message: '请输入角色名称', whitespace: true }],
                })(<Input />)
              }
            </FormItem>
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

export default Form.create()(AddRoleModal);
