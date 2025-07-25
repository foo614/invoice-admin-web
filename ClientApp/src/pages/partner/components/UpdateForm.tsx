import { DrawerForm, ProFormDateTimePicker, ProFormDigit, ProFormSwitch, ProFormText, ProCard, ProFormSelect, ProForm } from '@ant-design/pro-components';
import { Col, Divider, Form, message, Row, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

interface UpdateFormProps {
  visible: boolean;
  onClose: () => void;
  onFinish: (values: API.PartnerListItem) => void;
  initialValues?: API.PartnerListItem | null;
  isViewMode?: boolean;
}

const UpdateForm = ({ visible, onClose, onFinish, initialValues, isViewMode }: UpdateFormProps) => {
  const [form] = Form.useForm();

  return (
    <DrawerForm
      title={
        initialValues
          ? isViewMode
            ? `Partner - ${initialValues.name}`
            : 'Edit Partner'
          : 'Add Partner'
      }
      open={visible}
      initialValues={{
        ...initialValues,
        status: initialValues?.status ?? true,
        licenseKey: {
          ...initialValues?.licenseKey,
          expiryDate: initialValues?.licenseKey?.expiryDate ?? dayjs().add(1, 'year').endOf('day').toISOString(),
        },
      }}
      form={form}
      drawerProps={{
        onClose,
        destroyOnClose: true,
      }}
      width={800}
      onFinish={async (values: API.PartnerListItem) => {
        await onFinish(values);
        message.success(
          initialValues ? 'Partner updated successfully' : 'Partner added successfully',
        );
      }}
      submitter={{
        render: (props, doms) => !isViewMode ? doms : null,
      }}
    >
      <ProCard title="Basic Info" bordered style={{ marginBottom: 16 }} collapsible>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <ProFormText
              name="name"
              label="Partner Name"
              placeholder="Enter partner name"
              readonly={isViewMode}
              rules={[
                { required: true, message: 'Please enter the partner name' },
                { min: 2, message: 'Partner name must be at least 2 characters' },
              ]}
            />
          </Col>
          <Col xs={24} md={12}>
            <ProFormText
              name="companyName"
              label="Company Name"
              placeholder="Enter company name"
              readonly={isViewMode}
              rules={[
                { required: true, message: 'Please enter the company name' },
                { min: 2, message: 'Company name must be at least 2 characters' },
              ]}
            />
          </Col>
          <Col xs={24} md={12}>
            <ProFormText
              name="address1"
              label="Company Address Line 1"
              placeholder="Enter company address line 1"
              readonly={isViewMode}
              rules={[{ required: true, message: 'Please enter the company address line 1' }]}
            />
          </Col>
          <Col xs={24} md={12}>
            <ProFormText
              name="address2"
              label="Company Address Line 2"
              placeholder="Enter company address line 2"
              readonly={isViewMode}
            />
          </Col>
          <Col xs={24} md={12}>
            <ProFormText
              name="address3"
              label="Company Address Line 3"
              placeholder="Enter company address line 3"
              readonly={isViewMode}
            />
          </Col>
          <Col xs={24} md={12}>
            <ProFormText
              name="email"
              label="Company Email"
              placeholder="Enter company email"
              readonly={isViewMode}
              rules={[
                { required: true, message: 'Please enter the company email' },
                { type: 'email', message: 'Please enter a valid email address' },
              ]}
            />
          </Col>
          <Col xs={24} md={12}>
            <ProFormText
              name="phone"
              label="Company Phone"
              placeholder="Enter company phone"
              readonly={isViewMode}
              rules={[
                { required: true, message: 'Please enter the company phone number' },
                { pattern: /^\+?\d{7,15}$/, message: 'Please enter a valid phone number' },
              ]}
            />
          </Col>
          <Col xs={24} md={12}>
            <ProFormSwitch
              name="status"
              label="Status"
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              readonly={isViewMode}
            />
          </Col>
        </Row>
      </ProCard>
      <ProCard
        title="License Info"
        bordered
        collapsible
        extra={
          isViewMode && typeof initialValues?.licenseKey?.status === 'number' && (
            <Tag
              color={
                initialValues.licenseKey.status === 0
                  ? 'green'
                  : initialValues.licenseKey.status === 1
                    ? 'volcano'
                    : initialValues.licenseKey.status === 2
                      ? 'orange'
                      : 'red'
              }
            >
              {['Active', 'Expired', 'Used Up', 'Revoked'][initialValues.licenseKey.status]}
            </Tag>
          )
        }
      >
        {initialValues && (
          <ProFormSwitch
            name={["licenseKey", "generateNewKey"]}
            label="Generate New License Key"
            tooltip="Check this to generate a new license key for this partner and the submission count will be cleared"
            hidden={isViewMode}
          />
        )}
        <ProFormText
          label="License Key"
          name={["licenseKey", "key"]}
          readonly
          hidden={!initialValues}
        />
        <ProFormDigit
          name={["licenseKey", "maxSubmissions"]}
          label="Max Submissions"
          placeholder="Enter maximum submissions"
          min={1}
          readonly={isViewMode}
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
        <ProFormDateTimePicker
          name={["licenseKey", "expiryDate"]}
          label="Expiry Date"
          tooltip="Date the license will expire"
          placeholder="Select expiry date"
          readonly={isViewMode}
          rules={[{ required: true, message: 'Please select expiry date' }]}
        />
        <ProFormSwitch
          name={["licenseKey", "isRevoked"]}
          label="License Revoked"
          checkedChildren="Revoked"
          unCheckedChildren="Active"
          readonly={isViewMode}
        />
      </ProCard>
    </DrawerForm>
  );
};

export default UpdateForm;