import { ProForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { message } from 'antd';
import React from 'react';
import { queryCurrent } from '../service';
import useStyles from './index.style';

const BaseView: React.FC = () => {
  const { styles } = useStyles();

  const { data: currentUser, loading } = useRequest(() => {
    return queryCurrent();
  });

  const handleFinish = async () => {
    message.success('Successfully updated basic information');
  };

  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                searchConfig: {
                  submitText: 'Update Information',
                },
                render: (_, dom) => dom[1],
              }}
              initialValues={{
                ...currentUser,
                ContactNumber: currentUser?.ContactNumber,
              }}
              hideRequiredMark
            >
              {/* Seller Name */}
              <ProFormText
                width="md"
                name="Name"
                label="Seller Name"
                tooltip="Full legal name of the supplier."
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
                name="TIN"
                label="Tax Identification Number (TIN)"
                tooltip="Supplier's Taxpayer Identification Number assigned by LHDNM. Should be exactly 14 characters."
                rules={[
                  {
                    required: true,
                    message: 'Please enter the TIN!',
                  },
                  {
                    len: 14,
                    message: 'TIN must be exactly 14 characters!',
                  },
                ]}
              />

              {/* Registration Number */}
              <ProFormSelect
                width="sm"
                name="RegistrationNumber.schemeID"
                label="Scheme ID"
                tooltip="Choose the appropriate scheme ID: BRN, NRIC, PASSPORT, or ARMY."
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
                name="RegistrationNumber.value"
                label="Registration Number"
                tooltip="Provide the registration number based on the selected scheme ID."
                rules={[
                  {
                    required: true,
                    message: 'Please enter the registration number!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const schemeID = getFieldValue(['RegistrationNumber', 'schemeID']);
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
                name="SSTRegistrationNumber"
                label="SST Registration Number"
                tooltip="Sales and Service Tax registration number. Enter 'NA' if not applicable."
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
                name="TourismTaxRegistrationNumber"
                label="Tourism Tax Registration Number"
                tooltip="Enter the tourism tax registration number if applicable, or 'NA' if not."
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
                name="Email"
                label="Email"
                tooltip="Supplier's email address."
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
                name="ContactNumber"
                label="Contact Number"
                tooltip="Supplier's telephone number in E.164 format (e.g., +60123456789)."
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

              {/* MSIC Code */}
              <ProFormText
                width="md"
                name="MSICCode"
                label="MSIC Code"
                tooltip="5-digit Malaysia Standard Industrial Classification code."
                rules={[
                  {
                    required: true,
                    message: 'Please enter the MSIC code!',
                  },
                  {
                    len: 5,
                    message: 'MSIC code must be exactly 5 digits!',
                  },
                ]}
              />

              {/* Business Activity Description */}
              <ProFormTextArea
                name="BusinessActivityDescription"
                label="Business Activity Description"
                tooltip="Description of the supplier's business activities."
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
                name="Address.AddressLine0"
                label="Address Line 0"
                tooltip="Primary address line, such as street address or lot number."
                rules={[
                  {
                    required: true,
                    message: 'Please enter address line 0!',
                  },
                ]}
              />
              <ProFormText width="md" name="Address.AddressLine1" label="Address Line 1" />
              <ProFormText width="md" name="Address.AddressLine2" label="Address Line 2" />
              <ProFormText
                width="md"
                name="Address.PostalZone"
                label="Postal Code"
                tooltip="5-digit postal code for the address."
                rules={[
                  {
                    pattern: /^\d{5}$/,
                    message: 'Postal code should be exactly 5 digits!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="Address.CityName"
                label="City"
                tooltip="City where the business is located."
                rules={[
                  {
                    required: true,
                    message: 'Please enter the city!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="Address.State"
                label="State"
                tooltip="State code based on Malaysian administrative divisions."
                rules={[
                  {
                    required: true,
                    message: 'Please enter the state!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="Address.Country"
                label="Country"
                initialValue="MYS"
                disabled
                tooltip="Country code in ISO 3166-1 alpha-3 format."
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
            </ProForm>
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
