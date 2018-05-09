/**
 * Created by ecarx on 2017/8/9.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link,routerRedux } from 'dva/router';
import { Layout, Form, Input,Select,Button, InputNumber, Switch, Radio, Slider, Upload, Icon,Row,Col} from 'antd';
import styles from './emitApply.less';
import { patch } from '../../../services/sysApplyServer.js';

const { Content,Footer } = Layout;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;  
const FormItem = Form.Item;
// const Option = Select.Option;
const { Option, OptGroup } = Select;

class EmitApply extends Component {
   
  constructor(props) {
     super(props);
    this.state={
      currentRecord: {}
    }
  }
  componentDidMount() {
    console.log('props',this.props.location.query);
    if(this.props.location.query.id){
      console.log('data',patch(this.props.location.query.id));
      patch(this.props.location.query.id).then((res)=>{
        this.setState({
          currentRecord: res.data || {}
        })
      })
    }
  }
  _cancelHandler = () => {
    console.log('routerRedux',routerRedux);
     this.props.dispatch(routerRedux.goBack());
  };
  _okHandler = () => {
    let currentRow = this.state.currentRecord;
    console.log("currentRow",currentRow);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(currentRow.hasOwnProperty('id')){
          values.id = currentRow.id;
          delete values['status'];
          this.props.dispatch({
            type: 'sysManage/update',
            payload: values
          })   
        }else{
         console.log("currentRow   create" );
          this.props.dispatch({
            type: 'sysManage/create',
            payload: values
          });
           // this.$router    
        } 
      }
    });
  };
  _cancelBtn=()=>{
    this.props.form.resetFields();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const currentRecord = this.state.currentRecord;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 7 },
    };

    return (
      <Layout className={styles.myUpdatePackage}>
        <Content>
          <Form>
              <FormItem
                {...formItemLayout}
                label="系统应用编码"
              >
                {
                  getFieldDecorator('sysCode', {
                    initialValue: currentRecord.sysCode,
                    rules: [{ required: true, message: '请输入系统应用编码', whitespace: true }],
                  })(<Input />)
                }
              </FormItem>
            <FormItem
              {...formItemLayout}
              label="系统应用名称"
            >
              {
                getFieldDecorator('sysName', {
                  initialValue: currentRecord.sysName,
                  rules: [{ required: false, message: '请输入系统应用名称', whitespace: true }],
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="系统应用域名"
            >
              {
                getFieldDecorator('sysDomain', {
                initialValue: currentRecord.sysDomain
                })(<Input />)
              }
            </FormItem>
            <FormItem
              style={{ 'display':this.state.currentRecord.id? 'none':'block'}}
              {...formItemLayout}  
              label="状态"
            >
              {
                getFieldDecorator('status', {
                initialValue: currentRecord.status || 'Y',
                rules: [{
                 required: true, message: '请选择状态!',
                 }]
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
              <Button type="primary" style={{marginRight:40}} onClick={this._cancelHandler}>取消</Button>
              <Button type="primary" onClick={this._okHandler}>保存</Button>
            </FormItem>
          </Form>
        </Content>
      </Layout>
    );
  }
}

export default connect((sysManage)=>(sysManage))(Form.create()(EmitApply));


