import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { LockOutlined, UserOutlined} from '@ant-design/icons';
import 'antd/lib/form/style/'

class Login extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{width: 500, margin: '0px auto'}}>
          {/* <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>Remember me</Checkbox>
              )}
              <button className="login-form-forgot" href="#">Forgot password</button>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
              Or <button href="#">register now!</button>
            </Form.Item>
          </Form> */}
      </div>
      
    );
  }
}

// const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);

// export default WrappedNormalLoginForm;
export default Login;
