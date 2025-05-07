import { generateInvoice, getInvoiceDocumentList } from '@/services/ant-design-pro/invoiceService';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useNavigate } from '@umijs/max';
import { Button, message, Space } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

const SubmissionHistory: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchInvoiceDocuments = async (params: {
    current: number;
    pageSize: number;
    issueDateFrom?: string;
    issueDateTo?: string;
    uuid?: string;
  }) => {
    const { current, pageSize, issueDateFrom, issueDateTo, uuid } = params;

    try {
      const response = await getInvoiceDocumentList({
        pageNumber: current,
        pageSize: pageSize,
        status: true,
        uuid,
        issueDateFrom,
        issueDateTo,
      });

      if (response.data.succeeded) {
        return {
          data: response?.data.data || [],
          success: true,
          total: response?.data.totalCount || 0,
        };
      } else {
        message.error('Failed to fetch invoice document list.');
        return { data: [], total: 0, success: false };
      }
    } catch (error) {
      message.error('Error fetching invoice document list.');
      return { data: [], total: 0, success: false };
    }
  };

  const generatePdfInvoice = async (uuid: string) => {
    setLoading(true);

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

      message.success('Invoice generated successfully.');
    } catch (error) {
      message.error('Failed to generate invoice.');
    } finally {
      setLoading(false);
    }
  };

  const columns: ProColumns<API.InvoiceDocument>[] = [
    {
      title: 'UUID',
      dataIndex: 'uuid',
      key: 'uuid',
      render: (dom: any, entity: any) => (
        <a
          onClick={async () => {
            navigate(`/submission-history/${dom}`, { replace: true });
          }}
        >
          {dom}
        </a>
      ),
    },
    {
      title: 'Issue Date Range',
      dataIndex: 'issueDateRange',
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
      },
      transform: (value: any) => {
        if (value && value.length === 2) {
          return {
            issueDateFrom: dayjs(value[0]).startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
            issueDateTo: dayjs(value[1]).startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
          };
        }
        return {};
      },
    },
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      search: false,
    },
    {
      title: 'Supplier TIN',
      dataIndex: ['supplier', 'tin'],
      key: 'supplierTin',
      search: false,
      hideInTable: true,
    },
    {
      title: 'Supplier Name',
      dataIndex: ['supplier', 'name'],
      key: 'supplierName',
      ellipsis: true,
      search: false,
    },
    {
      title: 'Buyer TIN',
      dataIndex: ['customer', 'tin'],
      key: 'buyerTin',
      search: false,
      hideInTable: true,
    },
    {
      title: 'Buyer Name',
      dataIndex: ['customer', 'name'],
      key: 'buyerName',
      ellipsis: true,
      search: false,
    },
    {
      title: 'Currency',
      dataIndex: 'documentCurrencyCode',
      key: 'documentCurrencyCode',
      search: false,
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      valueType: 'money',
      align: 'right',
      search: false,
      render: (_, record) => {
        const amount = record.totalAmount ?? 0;
        const currencyCode = record.documentCurrencyCode ?? 'USD';

        if (currencyCode === 'MYR') {
          return `RM${amount.toLocaleString('en-MY', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        }

        return amount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          style: 'currency',
          currency: currencyCode,
        });
      },
    },
    {
      title: 'Status',
      dataIndex: 'documentStatus',
      key: 'documentStatus',
      valueEnum: {
        Valid: { text: 'Valid', status: 'Success' },
        Invalid: { text: 'Invalid', status: 'Error' },
        Cancelled: { text: 'Cancelled', status: 'Error' },
        Submitted: { text: 'Submitted', status: 'Processing' },
      },
    },
    {
      title: 'Issue Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
      valueType: 'date',
      search: false,
      render: (_: any, record: any) => {
        return record.issueDate ? dayjs(record.issueDate).format('YYYY-MM-DD HH:mm:ss') : '';
      },
    },
    {
      title: 'Actions',
      key: 'action',
      width: 80,
      fixed: 'right',
      search: false,
      render: (_: any, record: any) =>
        [
          record.documentStatus === 'Valid' && (
            <Button key="submit" loading={loading} onClick={() => generatePdfInvoice(record.uuid)}>
              PDF
            </Button>
          ),
        ].filter(Boolean),
    },
  ];

  return (
    <PageContainer title={'Submission History'}>
      <ProTable<API.InvoiceDocument>
        columns={columns}
        request={async (params) => {
          // Your API request logic here
          const response = await fetchInvoiceDocuments(params);
          return {
            data: response.data,
            success: response.success,
            total: response.total,
          };
        }}
        scroll={{ x: 'max-content' }}
        rowKey="uuid"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        headerTitle="E-Invoice Transactions"
        toolBarRender={() => [
          <Button key="primary">
            <FormattedMessage id="pages.invoice.export" />
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default SubmissionHistory;
