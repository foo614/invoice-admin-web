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
      dataIndex: isSalesInvoice ? 'invdate' : isCreditDebitNoteInvoice ? 'crddate' : 'date',
      render: (date) => dayjs(date?.toString(), 'YYYYMMDD').format('YYYY-MM-DD'),
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
