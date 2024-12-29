import {
  getCreditDebitNotes,
  getInvoiceTypes,
  getPurchaseCreditDebitNotes,
  getPurchaseInvoices,
  getSalesInvoices,
  submitInvoice,
} from '@/services/ant-design-pro/invoiceService';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message, Modal, Select, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';

// Define types for data
interface InvoiceData {
  invnumber: string;
  uuid?: string;
  bilname: string;
  invnetwtx: number;
  customerTIN: string;
  customerBRN?: string;
  biladdR1: string;
  bilstate?: string;
  bilzip: string;
  invitaxtot: number;
  invnetnotx: number;
  insourcurr: string;
  invdate: string;
  orderEntryDetails: OrderEntryDetail[];
  terms: string;
}

interface OrderEntryDetail {
  invuniq: string;
  qtyshipped: number;
  invunit: string;
  extinvmisc: number;
  desc: string;
  unitprice: number;
}

interface TableData {
  data: InvoiceData[];
  success: boolean;
  total: number;
}

interface InvoiceType {
  code: string;
  description: string;
}

const InvoiceSubmission: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<InvoiceData | undefined>();
  const [selectedRowsState, setSelectedRows] = useState<InvoiceData[]>([]);
  const [tableData, setTableData] = useState<TableData>({ data: [], success: false, total: 0 });
  const [invoiceType, setInvoiceType] = useState<InvoiceType[]>([]);
  const [selectedInvoiceType, setSelectedInvoiceType] = useState<string>('01'); // Default type
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState<boolean>(false);

  const columns: ProColumns<InvoiceData>[] = [
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
    { title: 'e-Invoice Code', dataIndex: 'uuid' },
    { title: 'Buyer Name', dataIndex: 'bilname' },
    { title: 'Total Payable Amount', dataIndex: 'invnetwtx', valueType: 'money' },
    {
      title: 'Actions',
      valueType: 'option',
      render: (_, record) => [
        <a key="submit" onClick={() => handleLHDNSubmission(record)}>
          Submit
        </a>,
      ],
    },
  ];

  const fetchDataBasedOnInvoiceType = async (
    type: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<void> => {
    setLoading(true);
    const fetchMap: { [key: string]: Function } = {
      '01': getSalesInvoices,
      '02': getCreditDebitNotes,
      '03': getCreditDebitNotes,
      '11': getPurchaseInvoices,
      '12': getPurchaseCreditDebitNotes,
      '13': getPurchaseCreditDebitNotes,
    };

    const fetchFunction = fetchMap[type];
    if (!fetchFunction) {
      message.warning('Invalid invoice type selected.');
      return;
    }

    try {
      const response = await fetchFunction({ page, pageSize });
      setTableData({
        data: response.data?.data || [],
        success: true,
        total: response.data?.totalItems || 0,
      });
      setLoading(false);
    } catch {
      message.error('Failed to fetch data for the selected invoice type.');
      setTableData({ data: [], success: false, total: 0 });
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const invoiceTypeOptions = await getInvoiceTypes();
        setInvoiceType(invoiceTypeOptions.data.data || []);
        await fetchDataBasedOnInvoiceType(selectedInvoiceType);
      } catch {
        message.error('Failed to load initial data.');
      }
    };
    loadInitialData();
  }, [selectedInvoiceType]);

  const calculateDueDate = (record: InvoiceData): Dayjs => {
    if (record.terms.endsWith('D')) {
      return dayjs(record.invdate, 'YYYYMMDD').add(
        parseInt(record.terms.replace('D', ''), 10),
        'day',
      );
    }
    if (record.terms.endsWith('M')) {
      return dayjs(record.invdate, 'YYYYMMDD').add(
        parseInt(record.terms.replace('M', ''), 10),
        'month',
      );
    }
    throw new Error('Invalid payment terms format. Must end with "D" or "M".');
  };

  const mapInvoiceRecord = (record: InvoiceData, dueDate: Dayjs) => ({
    Irn: record.invnumber + dayjs().format('YYYYMMDDHHmmss'),
    IssueDate: dayjs(record.invdate, 'YYYYMMDD').format('YYYY-MM-DD'),
    CurrencyCode: record.insourcurr || 'MYR',

    // Supplier details
    SupplierName: 'Supplier Name',
    SupplierCity: 'Kuala Lumpur',
    SupplierPostalCode: '81300',
    SupplierCountryCode: 'MYS',
    SupplierEmail: 'supplier@email.com',
    SupplierTelephone: '+60123456789',
    SupplierTIN: 'IG26339098050',
    SupplierBRN: '960614015177',
    SupplierSST: 'NA',
    SupplierTTX: 'NA',
    SupplierAddressLine1: 'address 1',
    SupplierAddressLine2: '',
    SupplierAddressLine3: '',
    SupplierIndustryCode: '46510',
    SupplierAdditionalAccountID: 'CPT-CCN-W-211111-KL-000002',
    SupplierCountrySubentityCode: '14',

    CustomerTIN: record.customerTIN,
    CustomerBRN: record.customerBRN,
    CustomerName: record.bilname,
    CustomerTelephone: record.bilphone || '+60123456789',
    CustomerEmail: record.bilemail,
    CustomerAddressLine1: record.biladdR1,
    CustomerAddressLine2: record.biladdR2 || '',
    CustomerAddressLine3: record.biladdR3 || '',
    CustomerCountrySubentityCode: '00',
    CustomerCity: record.bilstate || 'Kuala Lumpur',
    CustomerPostalCode: record.bilzip,
    CustomerCountryCode: 'MYS',

    InvoiceTypeCode: selectedInvoiceType,

    TaxableAmount: record.invnetnotx.toString(),
    TaxAmount: record.invitaxtot.toString(),
    TotalAmount: record.invnetwtx.toString(),
    StartDate: dayjs(record.invdate, 'YYYYMMDD').format('YYYY-MM-DD'),
    EndDate: dayjs(dueDate).format('YYYY-MM-DD'),
    InvoicePeriodDescription: 'Monthly',
    ItemList: record.orderEntryDetails.map((item) => ({
      Id: item.invuniq.toString(),
      Qty: item.qtyshipped,
      Unit: item.invunit,
      TotItemVal: item.extinvmisc,
      Description: item.desc,
      UnitPrice: item.unitprice,
    })),
  });

  const handleLHDNSubmission = async (record: InvoiceData): Promise<void> => {
    const dueDate = calculateDueDate(record);
    const mappedRecord = mapInvoiceRecord(record, dueDate);

    Modal.confirm({
      title: 'Confirm Submission',
      // content: (
      //   <Select
      //     placeholder="Select Invoice Type"
      //     style={{ width: '100%' }}
      //     options={invoiceType.map((data) => ({ value: data.code, label: data.description }))}
      //     onChange={(value) => setSelectedInvoiceType(value)}
      //   />
      // ),
      onOk: async () => {
        try {
          const response = await submitInvoice(mappedRecord);

          if (!response.status) throw new Error('Submission failed.');
          updateTableDataAfterSubmission(JSON.parse(response.data.data));
        } catch {
          message.error('Submission failed, please try again.');
        }
      },
    });
  };

  const updateTableDataAfterSubmission = (response: any): void => {
    if (response.acceptedDocuments?.length) {
      message.success(`Successfully submitted ${response.acceptedDocuments.length} documents.`);
      setTableData((prev) => ({
        ...prev,
        data: prev.data.map((row) =>
          response.acceptedDocuments.some((doc: any) => doc.invoiceCodeNumber === row.invnumber)
            ? { ...row, status: 'submitted', uuid: response.acceptedDocuments[0].uuid }
            : row,
        ),
      }));
    } else {
      message.error('No documents were accepted.');
    }
  };

  return (
    <PageContainer>
      <ProTable<InvoiceData>
        actionRef={actionRef}
        rowKey="invnumber"
        search={{ labelWidth: 'auto' }}
        dataSource={tableData.data}
        pagination={{
          total: tableData.total,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, pageSize) =>
            fetchDataBasedOnInvoiceType(selectedInvoiceType, page, pageSize),
        }}
        loading={loading}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        headerTitle={
          <Space>
            <span>Document Mapping Table</span>
            <Select<string>
              value={selectedInvoiceType}
              onChange={(value) => setSelectedInvoiceType(value)}
              style={{ width: 180 }}
              options={invoiceType
                .filter((data) => !data.description.toLowerCase().includes('refund')) // Exclude refund types
                .map((data) => ({
                  value: data.code,
                  label: data.description,
                }))}
            />
          </Space>
        }
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar>
          <div>
            Selected <strong>{selectedRowsState.length}</strong> items &nbsp;&nbsp;
            <span>
              Total Invoice Value:{' '}
              {selectedRowsState.reduce((sum, item) => sum + item.invnetwtx, 0)}
            </span>
          </div>
          <Button onClick={() => setSelectedRows([])}>Batch submission</Button>
        </FooterToolbar>
      )}
      <Drawer width={800} open={showDetail} onClose={() => setShowDetail(false)} closable={false}>
        {currentRow && (
          <ProDescriptions<InvoiceData>
            column={2}
            title={`Invoice Details: ${currentRow.invnumber}`}
            request={async () => ({ data: currentRow })}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default InvoiceSubmission;
