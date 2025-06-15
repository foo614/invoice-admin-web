import { ProColumns } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { InvoiceData } from './invoiceData';
import React from 'react';

export const getInvoiceColumns = (
  selectedInvoiceType: string,
  setCurrentRow: (record: InvoiceData) => void,
  setShowDetail: (show: boolean) => void,
  handleInvoiceSubmission: (record: InvoiceData) => void,
): ProColumns<InvoiceData>[] => {
  const isSalesInvoice = selectedInvoiceType === '01';
  const isPurchaseInvoice = selectedInvoiceType === '11';
  const isCreditDebitNoteInvoice = selectedInvoiceType === '02' || selectedInvoiceType === '03';
  const isPurchaseCreditDebitNoteInvoice =
    selectedInvoiceType === '12' || selectedInvoiceType === '13';

  return [
    {
      title: 'Invoice Number',
      dataIndex: 'invnumber',
      render: (dom, entity) => (
        <a
          onClick={() => {
            setCurrentRow(entity);
            setShowDetail(true);
          }}
        >
          {dom}
        </a>
      ),
    },
    { title: 'e-Invoice Code', dataIndex: 'uuid', hideInTable: true, hideInSearch: true },
    {
      title: isPurchaseInvoice || isPurchaseCreditDebitNoteInvoice ? 'Supplier Name' : 'Buyer Name',
      dataIndex: isPurchaseInvoice || isPurchaseCreditDebitNoteInvoice ? 'vdname' : 'bilname',
    },
    {
      title: 'Invoice Date',
      hideInSearch: true,
      dataIndex: isSalesInvoice ? 'invdate' : isCreditDebitNoteInvoice ? 'crddate' : 'date',
      render: (date) => dayjs(date?.toString(), 'YYYYMMDD').format('YYYY-MM-DD'),
    },
    {
      title: 'Invoice Date Range',
      valueType: 'dateRange',
      hideInTable: true,
      dataIndex: 'invoiceDateRange',
      fieldProps: {
        format: 'YYYY-MM-DD',
      },
      transform: (value: any) => {
        if (value && value.length === 2) {
          return {
            invoiceDateFrom: dayjs(value[0]).format('YYYYMMDD'),
            invoiceDateTo: dayjs(value[1]).format('YYYYMMDD'),
          };
        }
        return {};
      },
    },
    {
      title: 'Currency',
      hideInSearch: true,
      dataIndex: isSalesInvoice
        ? 'insourcurr'
        : isCreditDebitNoteInvoice
          ? 'crsourcurr'
          : 'currency',
    },
    {
      title: 'Total Payable Amount',
      hideInSearch: true,
      dataIndex: isSalesInvoice ? 'invnetwtx' : isCreditDebitNoteInvoice ? 'crdnetwtx' : 'scamount',
      render: (_, record) => {
        const amount = isPurchaseInvoice
          ? record.scamount
          : isCreditDebitNoteInvoice
            ? record.crdnetwtx
            : record.invnetwtx;

        return `${amount?.toFixed(2)}`.replace(/,/g, '');
      },
    },
    {
      title: 'Actions',
      valueType: 'option',
      render: (_, record) => [
        <a key="submit" onClick={() => handleInvoiceSubmission(record)}>
          Submit
        </a>,
      ],
    },
  ];
};
