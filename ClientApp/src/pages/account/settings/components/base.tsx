import { getUserProfile, updateUserProfile } from '@/services/ant-design-pro/profileService';
import { ProForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Card, Col, Form, message, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import useStyles from './index.style';
import { EditOutlined } from '@ant-design/icons';
import { getMsicCodes, getStateCodes } from '@/services/ant-design-pro/invoiceService';

interface MSICOption {
  Code: string;
  Description: string;
}

interface StateOption {
  Code: string;
  State: string;
}

const BaseView: React.FC = () => {
  const { styles } = useStyles();

  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [msicOptions, setMsicOptions] = useState<MSICOption[]>([]);
  const [msicLoading, setMsicLoading] = useState(false);
  const [stateOptions, setStateOptions] = useState<StateOption[]>([]);
  const [stateLoading, setStateLoading] = useState(false);
  const [profileData, setProfileData] = useState<API.ProfileItem>();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const [form] = Form.useForm();

  const fetchMsicOptions = async () => {
    setMsicLoading(true);
    try {
      const response = await getMsicCodes();
      setMsicOptions(response.data.data);
      setMsicLoading(false);
    } catch (error) {
      message.error('Failed to fetch MSIC options');
      setMsicLoading(false);
    }
  };

  const fetchStateOptions = async () => {
    setStateLoading(true);
    try {
      const response = await getStateCodes();
      setStateOptions(response.data.data);
      setStateLoading(false);
    } catch (error) {
      message.error('Failed to fetch state options');
      setStateLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    setProfileLoading(true);
    try {
      const response = await getUserProfile({ email: currentUser!.email });
      setProfileData(response.data.data);
    } catch (error) {
      message.error('Failed to fetch profile data');
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchMsicOptions();
    fetchStateOptions();
    fetchUserProfile();
  }, []);

  const refreshProfileComplete = async () => {
    if (!initialState?.currentUser?.email) return;

    try {
      const response = await getUserProfile({ email: initialState.currentUser.email });
      const profileData = response.data.data;
      const isComplete = !!profileData?.tin;

      setInitialState((prev) => ({
        ...prev,
        isProfileComplete: isComplete,
      }));
      localStorage.setItem('isProfileComplete', JSON.stringify(isComplete));
      return isComplete;
    } catch (error) {
      console.error('Failed to refresh profile status:', error);
      return false;
    }
  };

  const handleFinish = async (values: any) => {
    try {
      const response = await updateUserProfile(profileData!.id, values);

      if (response.data && response.data.succeeded) {
        message.success('Successfully updated profile');
        setIsEditMode(false);
        fetchUserProfile();
        await refreshProfileComplete();
      } else {
        message.error('Failed to update profile');
      }
    } catch {
      message.error('An error occurred while updating the profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: '20px' }}>
      {stateLoading && profileLoading ? null : (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <h2
              style={{
                margin: 0,
              }}
            >
              Profile
            </h2>
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
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            submitter={{
              render: (_, dom) =>
                isEditMode && (
                  <Row justify="end" style={{ marginTop: 24 }}>
                    <Col>
                      <Button type="default" onClick={handleCancel} style={{ marginRight: 8 }}>
                        Cancel
                      </Button>
                      <Button type="primary" htmlType="submit">
                        Save Changes
                      </Button>
                    </Col>
                  </Row>
                ),
            }}
            initialValues={{
              ...profileData,
              countryCode: profileData?.countryCode ?? 'MYS',
            }}
            requiredMark
          >
            {/* Basic Information Section */}
            <Card title="Basic Information" bordered={false} style={{ marginBottom: 24 }}>
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
                    tooltip="Supplier's email address."
                    disabled
                    rules={[{ type: 'email', message: 'Please enter a valid email!' }]}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <ProFormText
                    name="phone"
                    label="Contact Number"
                    tooltip="Supplier's telephone number in E.164 format (e.g., +60123456789)."
                    disabled={!isEditMode}
                    rules={[
                      { required: true, message: 'Please enter the contact number!' },
                      {
                        pattern: /^\+6\d{10,12}$/,
                        message: 'Contact number should be in E.164 format, e.g., +60123456789',
                      },
                    ]}
                  />
                </Col>
              </Row>
            </Card>

            {/* Tax Information Section */}
            <Card title="Tax Information" bordered={false} style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <ProFormText
                    name="tin"
                    label="Tax Identification Number (TIN)"
                    tooltip="Supplier's Taxpayer Identification Number assigned by LHDNM."
                    disabled={!isEditMode}
                    rules={[
                      { required: true, message: 'Please enter the TIN!' },
                      { min: 11, max: 14, message: 'TIN must be between 11 and 14 characters!' },
                    ]}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <ProFormText
                    name="sstRegistrationNumber"
                    label="SST Registration Number"
                    tooltip="Sales and Service Tax registration number. Enter 'NA' if not applicable."
                    disabled={!isEditMode}
                    rules={[
                      {
                        required: true,
                        message:
                          'Please enter the SST registration number or "NA" if not applicable!',
                      },
                      {
                        pattern: /^(A\d{2}-\d{4}-\d{8}|\bNA\b)$/,
                        message: 'Enter a valid SST registration number or "NA".',
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
                    tooltip="Choose the appropriate scheme ID"
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
                    tooltip="Provide the registration number based on the selected scheme ID."
                    disabled={!isEditMode}
                    rules={[
                      { required: true, message: 'Please enter the registration number!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const schemeID = getFieldValue('schemeId');
                          if (schemeID === 'BRN' && value.length <= 20) {
                            return Promise.resolve();
                          } else if (
                            ['NRIC', 'PASSPORT', 'ARMY'].includes(schemeID) &&
                            value.length <= 12
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              schemeID === 'BRN'
                                ? 'BRN number should be up to 20 characters!'
                                : 'ID number should be up to 12 characters!',
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
                    label="Tourism Tax Registration Number"
                    tooltip="Enter the tourism tax registration number if applicable, or 'NA' if not."
                    disabled={!isEditMode}
                    rules={[
                      {
                        pattern: /^\d{3}-\d{4}-\d{8}|\bNA\b/,
                        message: 'Enter a valid tourism tax registration number or "NA".',
                      },
                    ]}
                  />
                </Col>
              </Row>
            </Card>

            {/* Business Information Section */}
            <Card title="Business Information" bordered={false} style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={24}>
                  <ProFormSelect
                    name="msicCode"
                    label="MSIC Code"
                    tooltip="5-digit Malaysia Standard Industrial Classification code."
                    options={msicOptions.map((option) => ({
                      label: `${option.Code} - ${option.Description}`,
                      value: option.Code,
                    }))}
                    placeholder="Select or search MSIC code"
                    loading={msicLoading}
                    showSearch
                    disabled={!isEditMode}
                    rules={[{ required: true, message: 'Please select the MSIC code!' }]}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <ProFormTextArea
                    name="businessActivityDescription"
                    label="Business Activity Description"
                    tooltip="Description of the supplier's business activities."
                    disabled={!isEditMode}
                    rules={[{ required: true, message: 'Please describe the business activity!' }]}
                    placeholder="Business activity description"
                  />
                </Col>
              </Row>
            </Card>

            {/* Address Information Section */}
            <Card title="Address Information" bordered={false}>
              <Row gutter={16}>
                <Col span={24}>
                  <ProFormText
                    name="address1"
                    label="Address Line 1"
                    tooltip="Primary address line, such as street address or lot number."
                    disabled={!isEditMode}
                    rules={[{ required: true, message: 'Please enter address line 1!' }]}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <ProFormText name="address2" disabled={!isEditMode} label="Address Line 2" />
                </Col>
                <Col xs={24} md={12}>
                  <ProFormText name="address3" disabled={!isEditMode} label="Address Line 3" />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <ProFormText
                    name="postalCode"
                    label="Postal Code"
                    tooltip="5-digit postal code for the address."
                    disabled={!isEditMode}
                    rules={[
                      { pattern: /^\d{5}$/, message: 'Postal code should be exactly 5 digits!' },
                    ]}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <ProFormText
                    name="city"
                    label="City"
                    tooltip="City where the business is located."
                    disabled={!isEditMode}
                    rules={[{ required: true, message: 'Please enter the city!' }]}
                  />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <ProFormSelect
                    name="state"
                    label="State"
                    tooltip="State code based on Malaysian administrative divisions."
                    options={stateOptions.map((option) => ({
                      label: `${option.State}`,
                      value: option.Code,
                    }))}
                    placeholder="Select or search state code"
                    loading={stateLoading}
                    showSearch
                    disabled={!isEditMode}
                    rules={[{ required: true, message: 'Please select the state!' }]}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <ProFormText
                    name="countryCode"
                    label="Country"
                    tooltip="Country code in ISO 3166-1 alpha-3 format."
                    disabled={!isEditMode}
                    rules={[
                      { required: true, message: 'Please enter the country!' },
                      {
                        pattern: /^[A-Z]{3}$/,
                        message: 'Country code should be in ISO 3166-1 alpha-3 format (e.g., MYS).',
                      },
                    ]}
                  />
                </Col>
              </Row>
            </Card>

            <ProFormText name="id" hidden />
          </ProForm>
        </div>
      )}
    </div>
  );
};

export default BaseView;
