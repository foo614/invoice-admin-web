// InvoiceForm.tsx
import { ProForm, ProFormDigit, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React from 'react';
import { invoiceTypesConfig } from '../config/invoiceTypesConfig';

interface InvoiceFormProps {
  eInvoiceTypeCode: string;
  onSubmit: (data: any) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ eInvoiceTypeCode, onSubmit }) => {
  const config = invoiceTypesConfig[eInvoiceTypeCode];

  if (!config) {
    return <div>Invalid Invoice Type Code</div>;
  }

  const handleSubmit = async (values: any) => {
    try {
      await onSubmit(values);
      message.success(`${config.typeName} submitted successfully`);
    } catch (error) {
      message.error('Submission failed, please try again!');
    }
  };

  return (
    <ProForm
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ eInvoiceTypeCode }}
      submitter={{
        render: (_, dom) => (
          <Button type="primary" htmlType="submit">{`Submit ${config.typeName}`}</Button>
        ),
      }}
    >
      <ProFormText name="eInvoiceTypeCode" label="Invoice Type Code" disabled />

      <ProFormText name="issuedBy" label="Issued By" initialValue={config.issuedBy} disabled />

      {config.originalInvoiceRequired && (
        <>
          <ProFormText
            name="OriginaleInvoiceReferenceNumber"
            label="Original Invoice Reference Number"
          />
          <ProFormText name="OriginaleInvoiceUUID" label="Original Invoice UUID" />
        </>
      )}

      <ProFormDigit name="TotalExcludingTax" label="Total Excluding Tax" fieldProps={{ min: 0 }} />
      <ProFormDigit name="TotalIncludingTax" label="Total Including Tax" fieldProps={{ min: 0 }} />
      <ProFormDigit
        name="TotalPayableAmount"
        label="Total Payable Amount"
        fieldProps={{ min: 0 }}
      />
      <ProFormDigit name="TotalTaxAmount" label="Total Tax Amount" fieldProps={{ min: 0 }} />

      {config.requiresDigitalSignature && (
        <ProFormTextArea
          name="IssuerDigitalSignature"
          label={`${config.issuedBy} Digital Signature`}
        />
      )}
    </ProForm>
  );
};

export default InvoiceForm;
