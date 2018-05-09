/**
 * Created by ecarx on 2017/8/23.
 */
import React from 'react';
import { connect } from 'dva';
import { Layout, Form, Input,Select,Button} from 'antd';
import styles from './EditDepartment.less'
const { Content} = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;

class EditDepartment extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state={
/*      currentRecord:this.props.department.currentRow || {}*/
    }
  }

  componentDidMount(){
    this.props.dispatch({
      type: 'department/query',
      payload: {
        pageSize:1000,
        status:'Y'
      }
    })
  }
  //
  _okHandler = () => {
    let currentRow = this.props.department.currentRow || {};
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(currentRow.hasOwnProperty('id')){
          values.id = currentRow.id;
          values.parentDepId===currentRow.parentDepName ?  values.parentDepId = currentRow.parentDepId : true;
          delete values['status'];
          this.props.dispatch({
            type: 'department/update',
            payload: values
          })
        }else{
          this.props.dispatch({
            type: 'department/create',
            payload: values
          })
        }
      }
    });
  };
  _cancelBtn=()=>{
    this.props.dispatch({
      type: 'department/cancel',
      payload: {}
    })
  };

  _handleChange=(value)=>{
    this.props.dispatch({
      type: 'department/search',
      payload: {
        name:value
      }
    })
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const currentRecord = this.props.department.currentRow || {};
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 7 },
    };
    const departmentOptions = this.props.department.list.map((item,index) => <Option key={item.id}>{item.depName}</Option>);
    return (
      <Layout className={styles.editForm}>
        <Content>
          <Form>
            <FormItem
              {...formItemLayout}
              label="上级部门"
            >
              {
                getFieldDecorator('parentDepId', {
                  initialValue: currentRecord.parentDepName || '',
                  rules: [{ required: true, message: '请选择上级部门'}],
                })(<Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="选择上级部门"
                  optionFilterProp="depName"
                  onChange={this._handleChange}
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                  { departmentOptions }
                </Select>)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="部门编码"
            >
              {
                getFieldDecorator('depCode', {
                  initialValue: currentRecord.depCode || '',
                  rules: [{ required: true, message: '请输入部门编码', whitespace: true }],
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="部门名称"
            >
              {
                getFieldDecorator('depName', {
                  initialValue: currentRecord.depName,
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

export default connect((department)=>(department))(Form.create()(EditDepartment));
