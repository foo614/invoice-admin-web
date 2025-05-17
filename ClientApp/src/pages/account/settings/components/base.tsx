import { getMsicCodes, getStateCodes } from '@/services/ant-design-pro/invoiceService';
import { getUserProfile, updateUserProfile } from '@/services/ant-design-pro/profileService';
import { EditOutlined } from '@ant-design/icons';
import { ProForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Card, Col, Form, message, Row } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

interface MSICOption {
  code: string;
  description: string;
}

interface StateOption {
  Code: string;
  State: string;
}

const BaseView: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const userEmail = initialState?.currentUser?.email;

  const [form] = Form.useForm();
  const [msicOptions, setMsicOptions] = useState<MSICOption[]>([]);
  const [msicLoading, setMsicLoading] = useState(false);
  const [stateOptions, setStateOptions] = useState<StateOption[]>([]);
  const [stateLoading, setStateLoading] = useState(false);
  const [profileData, setProfileData] = useState<API.ProfileItem>();
  const [profileLoading, setProfileLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchAllData = async () => {
    setMsicLoading(true);
    setStateLoading(true);
    setProfileLoading(true);
    try {
      const [msicRes, stateRes, profileRes] = await Promise.all([
        getMsicCodes(),
        getStateCodes(),
        getUserProfile({ email: userEmail! }),
      ]);
      setMsicOptions(msicRes.data.data);
      setStateOptions(stateRes.data.data);
      setProfileData(profileRes.data.data);
    } catch (error) {
      message.error('Failed to load profile data');
    } finally {
      setMsicLoading(false);
      setStateLoading(false);
      setProfileLoading(false);
    }
  };

  const refreshProfileComplete = async () => {
    if (!userEmail) return false;
    try {
      const response = await getUserProfile({ email: userEmail });
      const profileData = response.data.data;
      const isComplete = !!profileData?.tin;
      setInitialState((prev) => ({ ...prev, isProfileComplete: isComplete }));
      localStorage.setItem('isProfileComplete', JSON.stringify(isComplete));
      return isComplete;
    } catch (error) {
      console.error('Failed to refresh profile status:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleFinish = async (values: any) => {
    setSubmitLoading(true);
    try {
      const response = await updateUserProfile(profileData!.id, values);
      if (response.data?.succeeded) {
        message.success('Successfully updated profile');
        setIsEditMode(false);
        await fetchAllData();
        await refreshProfileComplete();
      } else {
        message.error('Failed to update profile');
      }
    } catch {
      message.error('An error occurred while updating the profile. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    form.resetFields();
  };

  const initialValues = useMemo(
    () => ({
      ...profileData,
      countryCode: profileData?.countryCode ?? 'MYS',
    }),
    [profileData],
  );

  const getMsicSelectOptions = () =>
    msicOptions.map((option) => ({
      label: `${option.code} - ${option.description}`,
      value: option.code,
    }));

  const getStateSelectOptions = () =>
    stateOptions.map((option) => ({
      label: option.State,
      value: option.Code,
    }));

  return (
    <div style={{ padding: 20 }}>
      {!profileLoading && !stateLoading && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ margin: 0 }}>Profile</h2>
            {!isEditMode && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setIsEditMode(true)}
                style={{ marginLeft: 'auto' }}
              >
                Update
              </Button>
            )}
          </div>
          <ProForm
            key={profileData?.id}
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            disabled={profileLoading || submitLoading}
            initialValues={initialValues}
            requiredMark
            submitter={{
              render: (_, dom) =>
                isEditMode && (
                  <Row justify="end" style={{ marginTop: 24 }}>
                    <Col>
                      <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                        Cancel
                      </Button>
                      <Button type="primary" htmlType="submit" loading={submitLoading}>
                        Save Changes
                      </Button>
                    </Col>
                  </Row>
                ),
            }}
          >
            <Card title="Basic Information" style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <ProFormText
                    name="name"
                    label="Seller Name"
                    tooltip="Full legal name of the supplier."
                    disabled={!isEditMode}
                    rules={[{ required: true, message: 'Please enter the seller name!' }]}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <ProFormText
                    name="email"
                    label="Email"
                    disabled
                    tooltip="Supplier's email address."
                    rules={[{ type: 'email', message: 'Please enter a valid email!' }]}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <ProFormText
                    name="phone"
                    label="Contact Number"
                    tooltip="E.164 format (e.g., +60123456789)"
                    disabled={!isEditMode}
                    rules={[
                      { required: true, message: 'Please enter the contact number!' },
                      {
                        pattern: /^\+6\d{10,12}$/,
                        message: 'Format should be e.g., +60123456789',
                      },
                    ]}
                  />
                </Col>
              </Row>
            </Card>

            <Card title="Tax Information" style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <ProFormText
                    name="tin"
                    label="TIN"
                    tooltip="Taxpayer Identification Number (LHDNM)"
                    disabled={!isEditMode}
                    rules={[
                      { required: true, message: 'Please enter the TIN!' },
                      { min: 11, max: 14, message: 'TIN must be 11–14 characters!' },
                    ]}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <ProFormText
                    name="sstRegistrationNumber"
                    label="SST Reg. Number"
                    tooltip="Enter 'NA' if not applicable."
                    disabled={!isEditMode}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the SST number or "NA".',
                      },
                      {
                        pattern: /^(A\d{2}-\d{4}-\d{8}|\bNA\b)$/,
                        message: 'Enter valid SST number or "NA".',
                      },
                    ]}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <ProFormSelect
                    name="schemeId"
                    label="Scheme ID"
                    tooltip="Identity scheme"
                    disabled={!isEditMode}
                    options={[
                      { label: 'BRN', value: 'BRN' },
                      { label: 'NRIC', value: 'NRIC' },
                      { label: 'PASSPORT', value: 'PASSPORT' },
                      { label: 'ARMY', value: 'ARMY' },
                    ]}
                    rules={[{ required: true, message: 'Please select a scheme ID!' }]}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <ProFormText
                    name="registrationNumber"
                    label="Registration Number"
                    tooltip="Based on scheme ID"
                    disabled={!isEditMode}
                    rules={[
                      { required: true, message: 'Please enter the registration number!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const schemeID = getFieldValue('schemeId');
                          if (schemeID === 'BRN' && value.length <= 20) return Promise.resolve();
                          if (['NRIC', 'PASSPORT', 'ARMY'].includes(schemeID) && value.length <= 12)
                            return Promise.resolve();
                          return Promise.reject(
                            new Error(
                              schemeID === 'BRN' ? 'BRN max 20 chars!' : 'ID max 12 chars!',
                            ),
                          );
                        },
                      }),
                    ]}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <ProFormText
                    name="tourismTaxRegistrationNumber"
                    label="Tourism Tax Reg. No"
                    tooltip="Enter or use 'NA'"
                    disabled={!isEditMode}
                    rules={[
                      {
                        pattern: /^\d{3}-\d{4}-\d{8}|\bNA\b/,
                        message: 'Enter valid number or "NA".',
                      },
                    ]}
                  />
                </Col>
              </Row>
            </Card>

            <Card title="Business Information" style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={24}>
                  <ProFormSelect
                    name="msicCode"
                    label="MSIC Code"
                    tooltip="Malaysia Industrial Classification"
                    options={getMsicSelectOptions()}
                    loading={msicLoading}
                    disabled={!isEditMode}
                    showSearch
                    rules={[{ required: true, message: 'Please select MSIC code!' }]}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <ProFormTextArea
                    name="businessActivityDescription"
                    label="Business Activity"
                    tooltip="Describe business"
                    disabled={!isEditMode}
                    rules={[{ required: true, message: 'Please enter activity description!' }]}
                  />
                </Col>
              </Row>
            </Card>

            <Card title="Address Information">
              <Row gutter={16}>
                <Col span={24}>
                  <ProFormText
                    name="address1"
                    label="Address Line 1"
                    tooltip="Primary street address"
                    disabled={!isEditMode}
                    rules={[{ required: true, message: 'Enter address line 1!' }]}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <ProFormText name="address2" label="Address Line 2" disabled={!isEditMode} />
                </Col>
                <Col xs={24} md={12}>
                  <ProFormText name="address3" label="Address Line 3" disabled={!isEditMode} />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <ProFormText
                    name="postalCode"
                    label="Postal Code"
                    disabled={!isEditMode}
                    rules={[{ pattern: /^\d{5}$/, message: 'Postal code must be 5 digits!' }]}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <ProFormText
                    name="city"
                    label="City"
                    disabled={!isEditMode}
                    rules={[{ required: true, message: 'Enter city!' }]}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <ProFormSelect
                    name="state"
                    label="State"
                    options={getStateSelectOptions()}
                    loading={stateLoading}
                    showSearch
                    disabled={!isEditMode}
                    rules={[{ required: true, message: 'Select state!' }]}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <ProFormText
                    name="countryCode"
                    label="Country"
                    disabled={!isEditMode}
                    rules={[
                      { required: true, message: 'Enter country code!' },
                      {
                        pattern: /^[A-Z]{3}$/,
                        message: 'Must be ISO alpha-3 (e.g., MYS)',
                      },
                    ]}
                  />
                </Col>
              </Row>
            </Card>

            <ProFormText name="id" hidden />
          </ProForm>
        </>
      )}
    </div>
  );
};

export default BaseView;
