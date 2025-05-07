import {
  generateInvoice,
  getDocumentDetails,
  getRecentInvoices,
} from '@/services/ant-design-pro/invoiceService';
import { ProDescriptions, ProTable } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, Drawer, message, QRCode } from 'antd';
import React, { useRef, useState } from 'react';
import dayjs from 'dayjs';

// Types for API response and records
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
  longId: string;
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

// Fetch recent invoices (list)
const fetchRecentDocuments = async (params: {
  current: number;
  pageSize: number;
  issueDateFrom?: string;
  issueDateTo?: string;
  submissionDateFrom?: string;
  submissionDateTo?: string;
  direction?: string;
  status?: string;
  documentType?: string;
  receiverIdType?: string;
  receiverId?: string;
  receiverTin?: string;
  issuerTin?: string;
  issuerIdType?: string;
  issuerId?: string;
  uuid?: string;
}) => {
  const {
    current,
    pageSize,
    issueDateFrom,
    issueDateTo,
    submissionDateFrom,
    submissionDateTo,
    direction,
    status,
    documentType,
    receiverIdType,
    receiverId,
    receiverTin,
    issuerTin,
    issuerIdType,
    issuerId,
    uuid,
  } = params;

  // Build query string dynamically
  const queryParams = new URLSearchParams({
    pageNo: current.toString(),
    pageSize: pageSize.toString(),
    ...(issueDateFrom && { issueDateFrom }),
    ...(issueDateTo && { issueDateTo }),
    ...(submissionDateFrom && { submissionDateFrom }),
    ...(submissionDateTo && { submissionDateTo }),
    ...(direction && { direction }),
    ...(status && { status }),
    ...(documentType && { documentType }),
    ...(receiverIdType && { receiverIdType }),
    ...(receiverId && { receiverId }),
    ...(receiverTin && { receiverTin }),
    ...(issuerTin && { issuerTin }),
    ...(issuerIdType && { issuerIdType }),
    ...(issuerId && { issuerId }),
    ...(uuid && { uuid }),
  });

  try {
    const response = await getRecentInvoices(queryParams);

    if (response.data.succeeded) {
      return {
        data: response.data.data.result,
        total: response.data.data.metadata.totalCount,
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

// Fetch document details by UUID
const fetchDocumentDetails = async (uuid: string): Promise<InvoiceDetails | null> => {
  try {
    const response = await getDocumentDetails(uuid);

    if (response.data.succeeded) {
      const result = await response.data.data;
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

const generatePdfInvoice = async (uuid: string) => {
  try {
    const response = await generateInvoice(uuid, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(response.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${uuid}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    message.success('Invoice generate successfully.');
  } catch (error) {
    message.error('Failed to generate invoice.');
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
      hideInSearch: true,
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
      hideInSearch: true,
      dataIndex: 'internalId',
    },
    {
      title: 'Supplier TIN',
      hideInSearch: true,
      dataIndex: 'supplierTin',
    },
    {
      title: 'Supplier Name',
      hideInSearch: true,
      dataIndex: 'supplierName',
    },
    {
      title: 'Receiver TIN',
      hideInSearch: true,
      dataIndex: 'buyerTin',
    },
    {
      title: 'Receiver Name',
      hideInSearch: true,
      dataIndex: 'receiverName',
    },
    {
      title: 'Date Issued',
      dataIndex: 'dateTimeIssued',
      hideInSearch: true,
      valueType: 'date',
      hideInTable: true,
    },
    {
      title: 'Date Received',
      dataIndex: 'dateTimeReceived',
      hideInSearch: true,
      valueType: 'date',
      hideInTable: true,
    },
    {
      title: 'Total',
      hideInSearch: true,
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
      hideInSearch: true,
    },
    {
      title: 'Issue Date From',
      dataIndex: 'issueDateFrom',
      hideInSearch: true,
      valueType: 'date',
      hideInTable: true,
    },
    {
      title: 'Issue Date To',
      dataIndex: 'issueDateTo',
      hideInSearch: true,
      valueType: 'date',
      hideInTable: true,
    },
    {
      title: 'Submission Date Range',
      dataIndex: 'submissionDateRange',
      valueType: 'dateRange',
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            validator: (_, value) => {
              if (!value || value.length !== 2) {
                return Promise.reject('Please select both start and end dates');
              }
              return Promise.resolve();
            },
          },
        ],
      },
      fieldProps: {
        format: 'YYYY-MM-DD',
        disabledDate: (current) => {
          // Disable dates older than 31 days from today
          return current && current < dayjs().subtract(31, 'days').endOf('day');
        },
        onChange: (dates, dateStrings) => {
          if (dates && dates[0] && dates[1]) {
            const diffInDays = dates[1].diff(dates[0], 'days');
            if (diffInDays > 10) {
              message.error('Maximum search window is 10 days');
              // You might want to auto-adjust here by setting the end date to start+10
              dates[1] = dates[0].add(10, 'days');
              // You'll need to update the form value here
            }
          }
        },
      },
      transform: (value) => {
        if (value && value.length === 2) {
          return {
            submissionDateFrom: dayjs(value[0]).startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
            submissionDateTo: dayjs(value[1]).startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
          };
        }
        return {};
      },
    },
    {
      title: 'Submission Date From',
      dataIndex: 'submissionDateFrom',
      valueType: 'date',
      hideInSearch: true,
      formItemProps: {
        labelCol: { span: 12 },
      },
      fieldProps: {
        format: 'YYYY-MM-DD',
      },
      transform: (value: any) => {
        if (value) {
          return dayjs(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]');
        }
        return value;
      },
    },
    {
      title: 'Submission Date To',
      dataIndex: 'submissionDateTo',
      valueType: 'date',
      hideInSearch: true,
      formItemProps: {
        // label width
        labelCol: { span: 12 },
      },
      fieldProps: {
        format: 'YYYY-MM-DD',
      },
      transform: (value: any) => {
        if (value) {
          return dayjs(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]');
        }
        return value;
      },
    },
    {
      title: 'Actions',
      valueType: 'option',
      render: (_: any, record: any) =>
        [
          record.status === 'Valid' && (
            <a key="submit" onClick={() => generatePdfInvoice(record.uuid)}>
              PDF
            </a>
          ),
        ].filter(Boolean),
    },
  ];

  return (
    <>
      <ProTable
        headerTitle="Recent E-Invoice Transactions"
        actionRef={actionRef}
        rowKey="uuid"
        request={async (params) => {
          // ProTable provides `params` with pagination info.
          const queryParams = {
            current: params.current,
            pageSize: params.pageSize,
            issueDateFrom: params.issueDateFrom,
            issueDateTo: params.issueDateTo,
            submissionDateFrom: params.submissionDateFrom,
            submissionDateTo: params.submissionDateTo,
            direction: params.direction,
            status: params.status,
            documentType: params.documentType,
            receiverIdType: params.receiverIdType,
            receiverId: params.receiverId,
            receiverTin: params.receiverTin,
            issuerTin: params.issuerTin,
            issuerIdType: params.issuerIdType,
            issuerId: params.issuerId,
          };

          return await fetchRecentDocuments(queryParams);
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
        toolBarRender={() => [
          <Button key="primary">
            <FormattedMessage id="pages.invoice.export" />
          </Button>,
        ]}
        search={{
          labelWidth: 'auto',
        }}
      />

      <Drawer
        width={1200}
        open={drawerVisible}
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
              {
                title: 'Total Excluding Tax',
                dataIndex: 'totalExcludingTax',
                valueType: {
                  type: 'money',
                  locale: 'en-US',
                },
              },
              {
                title: 'Total Net Amount',
                dataIndex: 'totalNetAmount',
                valueType: {
                  type: 'money',
                  locale: 'en-US',
                },
              },
              {
                title: 'Total Payable Amount',
                dataIndex: 'totalPayableAmount',
                valueType: {
                  type: 'money',
                  locale: 'en-US',
                },
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
              {
                title: 'QR Code',
                hideInDescriptions: !documentDetails.longId,
                render: () => (
                  // get endpoint from config table
                  <QRCode
                    value={`${MY_INVOICE_BASE_URL}/${documentDetails.uuid}/share/${documentDetails.longId}`}
                    size={150}
                  />
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
