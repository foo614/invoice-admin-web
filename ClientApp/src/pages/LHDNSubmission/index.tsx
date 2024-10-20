import { ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';

/**
 * Types for API response and records
 */
interface InvoiceRecord {
  uuid: string;
  internalId: string;
  supplierTIN: string;
  supplierName: string;
  receiverTIN: string;
  receiverName: string;
  dateTimeIssued: string;
  dateTimeReceived: string;
  total: number;
  status: string;
  documentCurrency: string;
}

interface ValidationError {
  propertyName: string;
  error: string;
  errorCode: string;
  errorMs: string;
}

interface ValidationStep {
  status: string;
  name: string;
  error?: ValidationError;
}

interface InvoiceDetails {
  uuid: string;
  submissionUid: string;
  internalId: string;
  typeName: string;
  typeVersionName: string;
  issuerTin: string;
  issuerName: string;
  receiverId: string;
  receiverName: string;
  dateTimeReceived: string;
  dateTimeValidated: string;
  totalExcludingTax: number;
  totalDiscount: number;
  totalNetAmount: number;
  totalPayableAmount: number;
  status: string;
  validationResults: {
    status: string;
    validationSteps: ValidationStep[];
  };
}

/**
 * Fetch recent invoices (list)
 */
const fetchRecentDocuments = async (params: { current: number; pageSize: number }) => {
  const { current, pageSize } = params;

  try {
    const response = await fetch(
      `https://localhost:5001/api/invoice/recent?pageNo=${current}&pageSize=${pageSize}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const result = await response.json();
    if (response.ok) {
      return {
        data: result.result,
        total: result.metadata.totalCount,
        success: true,
      };
    } else {
      message.error('Failed to fetch e-invoice transactions.');
      return { data: [], total: 0, success: false };
    }
  } catch (error) {
    message.error('Error fetching e-invoice transactions.');
    return { data: [], total: 0, success: false };
  }
};

/**
 * Fetch document details by UUID
 */
const fetchDocumentDetails = async (uuid: string): Promise<InvoiceDetails | null> => {
  try {
    const response = await fetch(`https://localhost:5001/api/invoice/${uuid}/details`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      message.error('Failed to fetch document details.');
      return null;
    }
  } catch (error) {
    message.error('Error fetching document details.');
    return null;
  }
};

const InvoiceSubmission: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [documentDetails, setDocumentDetails] = useState<InvoiceDetails | null>(null);
  const actionRef = useRef<any>();

  const columns = [
    {
      title: 'UUID',
      dataIndex: 'uuid',
      render: (dom: any, entity: any) => (
        <a
          onClick={async () => {
            const details = await fetchDocumentDetails(entity.uuid);
            if (details) {
              setDocumentDetails(details);
              setDrawerVisible(true);
            }
          }}
        >
          {dom}
        </a>
      ),
    },
    {
      title: 'Internal ID',
      dataIndex: 'internalId',
    },
    {
      title: 'Supplier TIN',
      dataIndex: 'supplierTIN',
    },
    {
      title: 'Supplier Name',
      dataIndex: 'supplierName',
    },
    {
      title: 'Receiver TIN',
      dataIndex: 'receiverTIN',
    },
    {
      title: 'Receiver Name',
      dataIndex: 'receiverName',
    },
    {
      title: 'Date Issued',
      dataIndex: 'dateTimeIssued',
      valueType: 'dateTime',
    },
    {
      title: 'Date Received',
      dataIndex: 'dateTimeReceived',
      valueType: 'dateTime',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      valueType: 'money',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueEnum: {
        Valid: { text: 'Valid', status: 'Success' },
        Invalid: { text: 'Invalid', status: 'Error' },
        Pending: { text: 'Pending', status: 'Processing' },
      },
    },
    {
      title: 'Currency',
      dataIndex: 'documentCurrency',
    },
  ];

  return (
    <>
      <ProTable
        headerTitle="Recent E-Invoice Transactions"
        actionRef={actionRef}
        rowKey="uuid"
        request={async (params) => await fetchRecentDocuments(params)}
        columns={columns}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
      />

      <Drawer
        width={1200}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        closable={false}
      >
        {documentDetails && (
          <ProDescriptions<InvoiceDetails>
            column={2}
            title={`Invoice Details - ${documentDetails.uuid}`}
            dataSource={documentDetails}
            columns={[
              { title: 'UUID', dataIndex: 'uuid' },
              { title: 'Internal ID', dataIndex: 'internalId' },
              { title: 'Type Name', dataIndex: 'typeName' },
              { title: 'Type Version', dataIndex: 'typeVersionName' },
              { title: 'Issuer TIN', dataIndex: 'issuerTin' },
              { title: 'Issuer Name', dataIndex: 'issuerName' },
              { title: 'Receiver ID', dataIndex: 'receiverId' },
              { title: 'Receiver Name', dataIndex: 'receiverName' },
              { title: 'Date Received', dataIndex: 'dateTimeReceived', valueType: 'dateTime' },
              { title: 'Date Validated', dataIndex: 'dateTimeValidated', valueType: 'dateTime' },
              { title: 'Total Excluding Tax', dataIndex: 'totalExcludingTax', valueType: 'money' },
              //   { title: 'Total Discount', dataIndex: 'totalDiscount', valueType: 'money' },
              { title: 'Total Net Amount', dataIndex: 'totalNetAmount', valueType: 'money' },
              {
                title: 'Total Payable Amount',
                dataIndex: 'totalPayableAmount',
                valueType: 'money',
              },
              { title: 'Status', dataIndex: 'status' },
              {
                title: 'Validation Steps',
                render: () => (
                  <pre>
                    {JSON.stringify(documentDetails.validationResults.validationSteps, null, 2)}
                  </pre>
                ),
              },
            ]}
          />
        )}
      </Drawer>
    </>
  );
};

export default InvoiceSubmission;
