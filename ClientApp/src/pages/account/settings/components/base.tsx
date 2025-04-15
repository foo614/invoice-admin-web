import { getUserProfile, updateUserProfile } from '@/services/ant-design-pro/profileService';
import { ProForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Form, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useStyles from './index.style';

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

  const { initialState } = useModel('@@initialState');
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
      const response = await axios.get('/invoice/msiccodes');
      setMsicOptions(response.data);
      setMsicLoading(false);
    } catch (error) {
      message.error('Failed to fetch MSIC options');
      setMsicLoading(false);
    }
  };

  const fetchStateOptions = async () => {
    setStateLoading(true);
    try {
      const response = await axios.get('/invoice/statecodes');
      setStateOptions(response.data);
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
      message.error('Failed to fetch state options');
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchMsicOptions();
    fetchStateOptions();
    fetchUserProfile();
  }, []);

  const handleFinish = async (values: any) => {
    try {
      const response = await updateUserProfile(profileData!.id, values);

      if (response.data && response.data.succeeded) {
        message.success('Successfully updated basic information');
        setIsEditMode(false);
        fetchUserProfile();
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
    <div className={styles.baseView}>
      {stateLoading && profileLoading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                render: (_, dom) => (
                  <>
                    {isEditMode ? (
                      <>
                        <Button
                          type="default"
                          onClick={handleCancel}
                          style={{ marginRight: '8px' }}
                        >
                          Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                          Submit
                        </Button>
                      </>
                    ) : (
                      <Button type="primary" onClick={() => setIsEditMode(true)}>
                        Update Information
                      </Button>
                    )}
                  </>
                ),
              }}
              initialValues={{
                ...profileData,
                countryCode: profileData?.countryCode ?? 'MYS',
              }}
              hideRequiredMark
            >
              {/* Seller Name */}
              <ProFormText
                width="md"
                name="name"
                label="Seller Name"
                tooltip="Full legal name of the supplier."
                disabled={!isEditMode}
                rules={[
                  {
                    required: true,
                    message: 'Please enter the seller name!',
                  },
                ]}
              />

              {/* TIN */}
              <ProFormText
                width="md"
                name="tin"
                label="Tax Identification Number (TIN)"
                tooltip="Supplier's Taxpayer Identification Number assigned by LHDNM. Should be exactly 14 characters."
                disabled={!isEditMode}
                rules={[
                  {
                    required: true,
                    message: 'Please enter the TIN!',
                  },
                  {
                    min: 11,
                    max: 14,
                    message: 'TIN must be between 11 and 14 characters!',
                  },
                ]}
              />

              {/* Scheme ID */}
              <ProFormSelect
                width="sm"
                name="schemeId"
                label="Scheme ID"
                tooltip="Choose the appropriate scheme ID: BRN, NRIC, PASSPORT, or ARMY."
                disabled={!isEditMode}
                options={[
                  { label: 'BRN', value: 'BRN' },
                  { label: 'NRIC', value: 'NRIC' },
                  { label: 'PASSPORT', value: 'PASSPORT' },
                  { label: 'ARMY', value: 'ARMY' },
                ]}
                rules={[
                  {
                    required: true,
                    message: 'Please select a scheme ID!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="registrationNumber"
                label="Registration Number"
                tooltip="Provide the registration number based on the selected scheme ID."
                disabled={!isEditMode}
                rules={[
                  {
                    required: true,
                    message: 'Please enter the registration number!',
                  },
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

              {/* SST Registration Number */}
              <ProFormText
                width="md"
                name="sstRegistrationNumber"
                label="SST Registration Number"
                tooltip="Sales and Service Tax registration number. Enter 'NA' if not applicable."
                disabled={!isEditMode}
                rules={[
                  {
                    required: true,
                    message: 'Please enter the SST registration number or "NA" if not applicable!',
                  },
                  {
                    pattern: /^(A\d{2}-\d{4}-\d{8}|\bNA\b)$/,
                    message: 'Enter a valid SST registration number or "NA".',
                  },
                ]}
              />

              {/* Tourism Tax Registration Number */}
              <ProFormText
                width="md"
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

              {/* Email */}
              <ProFormText
                width="md"
                name="email"
                label="Email"
                tooltip="Supplier's email address."
                disabled
                rules={[
                  {
                    type: 'email',
                    message: 'Please enter a valid email!',
                  },
                ]}
              />

              {/* Contact Number */}
              <ProFormText
                width="md"
                name="phone"
                label="Contact Number"
                tooltip="Supplier's telephone number in E.164 format (e.g., +60123456789)."
                disabled={!isEditMode}
                rules={[
                  {
                    required: true,
                    message: 'Please enter the contact number!',
                  },
                  {
                    pattern: /^\+6\d{10,12}$/,
                    message: 'Contact number should be in E.164 format, e.g., +60123456789',
                  },
                ]}
              />

              {/* MSIC Code with dropdown and search */}
              <ProFormSelect
                width="md"
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
                rules={[
                  {
                    required: true,
                    message: 'Please select the MSIC code!',
                  },
                ]}
              />

              {/* Business Activity Description */}
              <ProFormTextArea
                name="businessActivityDescription"
                label="Business Activity Description"
                tooltip="Description of the supplier's business activities."
                disabled={!isEditMode}
                rules={[
                  {
                    required: true,
                    message: 'Please describe the business activity!',
                  },
                ]}
                placeholder="Business activity description"
              />

              {/* Address Group */}
              <ProFormText
                width="md"
                name="address1"
                label="Address Line 1"
                tooltip="Primary address line, such as street address or lot number."
                disabled={!isEditMode}
                rules={[
                  {
                    required: true,
                    message: 'Please enter address line 1!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="address2"
                disabled={!isEditMode}
                label="Address Line 2"
              />
              <ProFormText
                width="md"
                name="address3"
                disabled={!isEditMode}
                label="Address Line 3"
              />
              <ProFormText
                width="md"
                name="postalCode"
                label="Postal Code"
                tooltip="5-digit postal code for the address."
                disabled={!isEditMode}
                rules={[
                  {
                    pattern: /^\d{5}$/,
                    message: 'Postal code should be exactly 5 digits!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="city"
                label="City"
                tooltip="City where the business is located."
                disabled={!isEditMode}
                rules={[
                  {
                    required: true,
                    message: 'Please enter the city!',
                  },
                ]}
              />

              {/* State Code with dropdown and search */}
              <ProFormSelect
                width="md"
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
                rules={[
                  {
                    required: true,
                    message: 'Please select the state!',
                  },
                ]}
              />

              {/* Country */}
              <ProFormText
                width="md"
                name="countryCode"
                label="Country"
                tooltip="Country code in ISO 3166-1 alpha-3 format."
                disabled={!isEditMode}
                rules={[
                  {
                    required: true,
                    message: 'Please enter the country!',
                  },
                  {
                    pattern: /^[A-Z]{3}$/,
                    message: 'Country code should be in ISO 3166-1 alpha-3 format (e.g., MYS).',
                  },
                ]}
              />

              <ProFormText name="id" hidden />
            </ProForm>
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
