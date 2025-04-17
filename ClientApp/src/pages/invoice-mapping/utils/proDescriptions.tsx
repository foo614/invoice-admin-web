import { ProDescriptions, ProDescriptionsItemProps } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import React from 'react';
import { InvoiceData } from './invoiceData';

export const renderProDescriptions = (selectedInvoiceType: string, record: InvoiceData) => {
  const isSalesInvoice = selectedInvoiceType === '01';
  const isPurchaseInvoice = selectedInvoiceType === '11';
  const isCreditDebitNoteInvoice = selectedInvoiceType === '02' || selectedInvoiceType === '03';
  const isPurchaseCreditDebitNoteInvoice =
    selectedInvoiceType === '12' || selectedInvoiceType === '13';

  const commonColumns: ProDescriptionsItemProps<InvoiceData>[] = [
    { title: 'Invoice Number', dataIndex: 'invnumber' },
    {
      title: isPurchaseInvoice || isPurchaseCreditDebitNoteInvoice ? 'Supplier Name' : 'Buyer Name',
      dataIndex: isPurchaseInvoice || isPurchaseCreditDebitNoteInvoice ? 'vdname' : 'bilname',
    },
    {
      title: 'Total Amount',
      dataIndex: isSalesInvoice ? 'invnetwtx' : isCreditDebitNoteInvoice ? 'crdnetwtx' : 'scamount',
      render: (_, record) => {
        const amount = isSalesInvoice
          ? record.invnetwtx
          : isCreditDebitNoteInvoice
            ? record.crdnetwtx
            : record.scamount;
        return `${amount?.toFixed(2)}`.replace(/,/g, '');
      },
    },
    {
      title: 'Currency',
      dataIndex: isSalesInvoice
        ? 'insourcurr'
        : isCreditDebitNoteInvoice
          ? 'crsourcurr'
          : 'currency',
    },
    {
      title: 'Invoice Date',
      dataIndex: isSalesInvoice ? 'invdate' : isCreditDebitNoteInvoice ? 'crddate' : 'date',
      render: (date) => dayjs(date?.toString(), 'YYYYMMDD').format('YYYY-MM-DD'),
    },
    { title: 'Terms', dataIndex: 'terms' },
    { title: 'Customer TIN', dataIndex: 'customerTIN' },
    {
      title: 'Address',
      render: (_, data) =>
        isSalesInvoice || isCreditDebitNoteInvoice
          ? `${data.biladdR1 || ''} ${data.biladdR2 || ''} ${data.biladdR3 || ''} ${data.biladdR4 || ''} ${data.bilstate || ''} ${data.bilzip || ''}, ${
              data.bilcountry || ''
            }`
          : `${data.vdaddresS1 || ''} ${data.vdaddresS2 || ''} ${data.vdaddresS3 || ''} ${data.vdaddresS4 || ''}`,
    },
  ];

  const salesColumns: ProDescriptionsItemProps<InvoiceData>[] = [
    {
      title: 'Order Entry Details',
      dataIndex: 'orderEntryDetails',
      render: (_, record) =>
        record.orderEntryDetails?.map((item, index) => (
          <div key={index}>
            <strong>Item {index + 1}:</strong>
            <div>Description: {item.desc}</div>
            <div>Quantity: {item.qtyshipped}</div>
            <div>Unit: {item.invunit}</div>
            <div>Unit Price: {item.unitprice?.toFixed(2)}</div>
            <div>Total: {item.extinvmisc?.toFixed(2)}</div>
          </div>
        )),
    },
  ];

  const creditDebitNoteColumns: ProDescriptionsItemProps<InvoiceData>[] = [
    {
      title: 'Order Credit Debit Details',
      dataIndex: 'orderCreditDebitDetails',
      render: (_, record) =>
        record.orderCreditDebitDetails?.map((item, index) => (
          <div key={index}>
            <strong>Item {index + 1}:</strong>
            <div>Description: {item.desc}</div>
            <div>Quantity: {item.qtyreturn}</div>
            <div>Unit: {item.crdunit}</div>
            <div>Unit Price: {item.unitprice?.toFixed(2)}</div>
            <div>Total: {item.extcrdmisc?.toFixed(2)}</div>
          </div>
        )),
    },
  ];

  const purchaseColumns: ProDescriptionsItemProps<InvoiceData>[] = [
    {
      title: 'Purchase Invoice Details',
      dataIndex: 'purchaseInvoiceDetails',
      render: (_, record) =>
        record.purchaseInvoiceDetails?.map((item, index) => (
          <div key={index}>
            <strong>Item {index + 1}:</strong>
            <div>Description: {item.itemdesc}</div>
            <div>Unit: {item.rcpunit}</div>
            <div>Unit Cost: {item.unitcost?.toFixed(2)}</div>
            <div>Extended: {item.extended?.toFixed(2)}</div>
            <div>Received Quantity: {item.rqreceived}</div>
            <div>Tax Rate: {item.taxratE1?.toFixed(2)}</div>
            <div>Discount: {item.discpct?.toFixed(2)}</div>
          </div>
        )),
    },
  ];

  const purchaseCreditDebitNoteColumns: ProDescriptionsItemProps<InvoiceData>[] = [
    {
      title: 'Purchase Credit Debit Note Details',
      dataIndex: 'purchaseCreditDebitNoteDetails',
      render: (_, record) =>
        record.purchaseCreditDebitNoteDetails?.map((item, index) => (
          <div key={index}>
            <strong>Item {index + 1}:</strong>
            <div>Description: {item.itemdesc}</div>
            <div>Unit: {item.retunit}</div>
            <div>Unit Cost: {item.unitcost?.toFixed(2)}</div>
            <div>Extended: {item.extended?.toFixed(2)}</div>
            <div>Received Quantity: {item.rqreturned}</div>
            <div>Tax Rate: {item.taxratE1?.toFixed(2)}</div>
          </div>
        )),
    },
  ];

  const selectedColumns = [
    ...commonColumns,
    ...(isSalesInvoice ? salesColumns : []),
    ...(isCreditDebitNoteInvoice ? creditDebitNoteColumns : []),
    ...(isPurchaseInvoice ? purchaseColumns : []),
    ...(isPurchaseCreditDebitNoteInvoice ? purchaseCreditDebitNoteColumns : []),
  ];

  return (
    <ProDescriptions<InvoiceData>
      column={2}
      title={`Invoice Details: ${record.invnumber}`}
      dataSource={record}
      columns={selectedColumns}
    />
  );
};
