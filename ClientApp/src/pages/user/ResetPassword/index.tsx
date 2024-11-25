import { resetPassword } from '@/services/ant-design-pro/authService'; // API function to handle reset password
import { LockOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
    const code = searchParams.get('code');
    if (!code) {
      message.error('Invalid or missing reset code.');
      return;
    }

    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword({ password: values.password, code });
      if (response.success) {
        message.success('Password reset successfully. You can now log in.');
      } else {
        message.error(response.message || 'Failed to reset password.');
      }
    } catch (error) {
      message.error('An error occurred while resetting your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #f0f0f0',
        borderRadius: 8,
      }}
    >
      <h2 style={{ textAlign: 'center' }}>Reset Password</h2>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="password"
          label="New Password"
          rules={[{ required: true, message: 'Please input your new password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          rules={[{ required: true, message: 'Please confirm your new password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPassword;
