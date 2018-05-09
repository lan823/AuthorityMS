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
      inputShow:false
    };
  }
  componentWillMount(){
  	if(this.props.record.id){
  		this.setState({
  			inputShow:true
  		})
  	}else{
  		this.setState({
  			inputShow:false
  		})
  	}
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
    const {id,appCode,appName,remarks,status} = this.props.record;
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
          title="app详情"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="app编码"
            >
              {
                getFieldDecorator('appCode', {
                  initialValue: appCode,
                  rules: [{ required: true,  message: '请输入app编码',whitespace: true }],
                })(<Input  disabled={this.state.inputShow}/>)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="app名称"
            >
              {
                getFieldDecorator('appName', {
                  initialValue: appName,
                  rules: [{ required: true, message: '请输入app名称', whitespace: true }],
                })(<Input />)
              }
            </FormItem>
			<FormItem
              {...formItemLayout}
              label="app描述"
            >
              {
                getFieldDecorator('remarks', {
                  initialValue: remarks,
                  rules: [{ required: true, message: '请输入app描述', whitespace: true }],
                })(<Input />)
              }
            </FormItem>
          </Form>
        </Modal>
      </span>
      );
  }
}

export default Form.create()(AddPostModal);










