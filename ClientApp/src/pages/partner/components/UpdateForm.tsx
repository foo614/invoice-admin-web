import { ModalForm, ProFormDigit, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React from 'react';

const UpdateForm = ({ visible, onClose, onFinish, initialValues }) => {
  const [form] = Form.useForm();

  return (
    <ModalForm
      title={initialValues ? 'Edit Partner' : 'Add Partner'}
      open={visible}
      initialValues={initialValues}
      form={form}
      modalProps={{
        onCancel: onClose,
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        await onFinish(values);
        message.success(
          initialValues ? 'Partner updated successfully' : 'Partner added successfully',
        );
      }}
    >
      <ProFormText
        name="name"
        label="Partner Name"
        placeholder="Enter partner name"
        rules={[
          { required: true, message: 'Please enter the partner name' },
          { min: 2, message: 'Partner name must be at least 2 characters' },
        ]}
      />
      <ProFormText
        name={['companyInfo', 'companyName']}
        label="Company Name"
        placeholder="Enter company name"
        rules={[
          { required: true, message: 'Please enter the company name' },
          { min: 2, message: 'Company name must be at least 2 characters' },
        ]}
      />
      <ProFormText
        name={['companyInfo', 'address']}
        label="Company Address"
        placeholder="Enter company address"
        rules={[{ required: true, message: 'Please enter the company address' }]}
      />
      <ProFormText
        name={['companyInfo', 'email']}
        label="Company Email"
        placeholder="Enter company email"
        rules={[
          { required: true, message: 'Please enter the company email' },
          { type: 'email', message: 'Please enter a valid email address' },
        ]}
      />
      <ProFormText
        name={['companyInfo', 'phone']}
        label="Company Phone"
        placeholder="Enter company phone"
        rules={[
          { required: true, message: 'Please enter the company phone number' },
          { pattern: /^\+?\d{7,15}$/, message: 'Please enter a valid phone number' },
        ]}
      />
      <ProFormSwitch
        name="status"
        label="Status"
        checkedChildren="Active"
        unCheckedChildren="Inactive"
      />
      <ProFormDigit
        name="maxSubmissions"
        label="Max Submissions"
        placeholder="Enter maximum submissions"
        min={1}
        rules={[
          { required: true, message: 'Please enter maximum submissions allowed' },
          {
            validator: async (_, value) => {
              const submissionCount = form.getFieldValue('submissionCount');
              if (value < submissionCount) {
                throw new Error('Max Submissions cannot be less than Submission Count');
              }
            },
          },
        ]}
      />
    </ModalForm>
  );
};

export default UpdateForm;
