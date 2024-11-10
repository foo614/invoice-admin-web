import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormGroup,
  ProFormList,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message, Modal, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { invoiceTypesConfig } from './config/invoiceTypesConfig';

/**
 * Handle add operation
 */
const handleAdd = async (fields: any) => {
  const hide = message.loading('Adding...');
  try {
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * Handle update operation
 */
const handleUpdate = async (fields: any) => {
  const hide = message.loading('Updating...');
  try {
    // Mock update operation
    hide();
    message.success('Updated successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Update failed, please try again!');
    return false;
  }
};

/**
 * Handle remove operation
 */
const handleRemove = async (selectedRows: any[]) => {
  const hide = message.loading('Deleting...');
  if (!selectedRows) return true;
  try {
    // Mock remove operation
    hide();
    message.success('Deleted successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again!');
    return false;
  }
};

const InvoiceSubmission: React.FC = (invoiceType: string) => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]); // State for table data
  const location = useLocation();
  const lastPathSegment = location.pathname.split('/').filter(Boolean).pop();

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<any>[] = [
    {
      title: 'Transaction ID',
      dataIndex: 'Irn',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: 'e-Invoice Code',
      dataIndex: 'uuid',
    },
    {
      title: 'Seller GSTIN',
      dataIndex: ['SellerDtls', 'Gstin'],
    },
    {
      title: 'Buyer GSTIN',
      dataIndex: ['BuyerDtls', 'Gstin'],
    },
    {
      title: 'Total Invoice Value',
      dataIndex: ['ValDtls', 'TotInvVal'],
      valueType: 'money',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueEnum: {
        submitted: { text: 'Submitted', status: 'Success' },
        pending: { text: 'Pending', status: 'Processing' },
        rejected: { text: 'Rejected', status: 'Error' },
      },
    },
    {
      title: 'Actions',
      valueType: 'option',
      render: (_, record) => [
        record.status === 'pending' && (
          <a
            key="edit"
            style={{ marginRight: 10 }}
            onClick={() => {
              handleUpdateModalOpen(true);
              setCurrentRow(record);
            }}
          >
            Edit Document
          </a>
        ),
        record.status === 'pending' && (
          <a
            key="config"
            onClick={() => {
              // handleUpdateModalOpen(true);
              setCurrentRow(record);
              handleLHDNSubmission(record);
            }}
          >
            Submit to LHDN
          </a>
        ),
      ],
    },
  ];

  // Define the columns for the details shown in the drawer separately
  const descriptionColumns: ProDescriptionsItemProps<any>[] = [
    {
      title: 'Invoice ID',
      dataIndex: 'Irn',
    },
    {
      title: 'Version',
      dataIndex: 'Version',
    },
    {
      title: 'Transaction Tax Scheme',
      dataIndex: ['TranDtls', 'TaxSch'],
    },
    {
      title: 'Transaction Category',
      dataIndex: ['TranDtls', 'SupTyp'],
    },
    {
      title: 'Reverse Charge',
      dataIndex: ['TranDtls', 'RegRev'],
    },
    {
      title: 'E-Commerce GSTIN',
      dataIndex: ['TranDtls', 'EcmGstin'],
    },
    {
      title: 'IGST on Intra',
      dataIndex: ['TranDtls', 'IgstOnIntra'],
    },
    {
      title: 'Document Type',
      dataIndex: ['DocDtls', 'Typ'],
    },
    {
      title: 'Document Number',
      dataIndex: ['DocDtls', 'No'],
    },
    {
      title: 'Document Date',
      dataIndex: ['DocDtls', 'Dt'],
    },
    {
      title: 'Seller GSTIN',
      dataIndex: ['SellerDtls', 'Gstin'],
    },
    {
      title: 'Seller Legal Name',
      dataIndex: ['SellerDtls', 'LglNm'],
    },
    {
      title: 'Seller Trade Name',
      dataIndex: ['SellerDtls', 'TrdNm'],
    },
    {
      title: 'Seller Address Line 1',
      dataIndex: ['SellerDtls', 'Addr1'],
    },
    {
      title: 'Seller Address Line 2',
      dataIndex: ['SellerDtls', 'Addr2'],
    },
    {
      title: 'Seller Location',
      dataIndex: ['SellerDtls', 'Loc'],
    },
    {
      title: 'Seller PIN Code',
      dataIndex: ['SellerDtls', 'Pin'],
    },
    {
      title: 'Seller State Code',
      dataIndex: ['SellerDtls', 'Stcd'],
    },
    {
      title: 'Seller Phone Number',
      dataIndex: ['SellerDtls', 'Ph'],
    },
    {
      title: 'Seller Email',
      dataIndex: ['SellerDtls', 'Em'],
    },
    {
      title: 'Dispatch GSTIN',
      dataIndex: ['DispDtls', 'Gstin'],
    },
    {
      title: 'Dispatch Address Line 1',
      dataIndex: ['DispDtls', 'Addr1'],
    },
    {
      title: 'Dispatch Address Line 2',
      dataIndex: ['DispDtls', 'Addr2'],
    },
    {
      title: 'Dispatch Location',
      dataIndex: ['DispDtls', 'Loc'],
    },
    {
      title: 'Ship To GSTIN',
      dataIndex: ['ShipDtls', 'Gstin'],
    },
    {
      title: 'Ship To Address Line 1',
      dataIndex: ['ShipDtls', 'Addr1'],
    },
    {
      title: 'Ship To Address Line 2',
      dataIndex: ['ShipDtls', 'Addr2'],
    },
    {
      title: 'Ship To Location',
      dataIndex: ['ShipDtls', 'Loc'],
    },
    {
      title: 'Item List',
      dataIndex: 'ItemList',
      order: -1,
      render: (_, record) => {
        return (
          <div>
            {record.ItemList?.map((item: any, index: number) => (
              <div key={index} style={{ marginBottom: '8px' }}>
                <strong>Item {index + 1}:</strong>
                <div>Product Name: {item?.PrdDesc}</div>
                <div>HSN Code: {item?.HsnCd}</div>
                <div>Quantity: {item?.Qty}</div>
                <div>Unit: {item?.Unit}</div>
                <div>Price: {item?.UnitPrice}</div>
                <div>Total: {item?.TotAmt}</div>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Total Invoice Value',
      dataIndex: ['ValDtls', 'TotInvVal'],
    },
    {
      title: 'Submitted Date',
      dataIndex: 'submittedDate',
    },
  ];

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/eInvoiceTransactions', {
        method: 'GET',
      });
      const data = await response.json();
      setTableData(data.data); // Set the table data in state
      return {
        data: data.data,
        success: data.success,
        total: data.total,
      };
    } catch (error) {
      message.error('Failed to fetch e-invoice transactions.');
      return { data: [], success: false, total: 0 };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchTransactions();
      setTableData(result.data); // Set the fetched data in the table
    };
    loadData();
  }, []);

  // Helper function to generate a random dynamic number
  const generateRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const dynamicIrn = `INV${generateRandomNumber(100000, 999999)}`;

  // Generate random IssueDate within the current year
  const currentYear = new Date().getFullYear();
  const randomMonth = generateRandomNumber(1, 12);
  const randomDay = generateRandomNumber(1, 28); // To avoid handling month-specific day limits
  const randomIssueDate = `${currentYear}-${String(randomMonth).padStart(2, '0')}-${String(randomDay).padStart(2, '0')}`;

  // Generate random IssueTime in the format HH:mm:ssZ
  const randomHour = generateRandomNumber(0, 23);
  const randomMinute = generateRandomNumber(0, 59);
  const randomSecond = generateRandomNumber(0, 59);
  const randomIssueTime = `${String(randomHour).padStart(2, '0')}:${String(randomMinute).padStart(2, '0')}:${String(randomSecond).padStart(2, '0')}Z`;

  /**
   * Handle LHDN submission
   */
  const handleLHDNSubmission = async (record: any) => {
    const mappedRecord = {
      Irn: record.Irn,
      IssueDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      // record.DocDtls.Dt ||
      IssueTime: record.DocDtls.Tm || randomIssueTime,
      InvoiceTypeCode: '01',
      // record.DocDtls.Typ ||
      CurrencyCode: 'MYR', // Assuming currency is MYR

      // Supplier details
      SupplierName: record.SellerDtls.LglNm || 'Supplier Name',
      SupplierCity: record.SellerDtls.Loc || 'Kuala Lumpur',
      SupplierPostalCode: record.SellerDtls.Pin,
      SupplierCountryCode: 'MYS', // Assuming Malaysia
      SupplierEmail: record.SellerDtls.Em || 'supplier@email.com',
      SupplierTelephone: record.SellerDtls.Ph || '+60-123456789',
      SupplierTIN: 'IG26339098050',
      // record.SellerDtls.Gstin, // Assuming GSTIN is used as TIN
      SupplierBRN: record.SellerDtls.Brn || 'IG26339098050',
      SupplierSST: record.SellerDtls.Sst || 'NA',
      SupplierTTX: record.SellerDtls.Ttx || 'NA',
      SupplierAddressLine1: record.SellerDtls.Addr1,
      SupplierAddressLine2: record.SellerDtls.Addr2 || '',
      SupplierAddressLine3: record.SellerDtls.Addr3 || '',
      SupplierIndustryCode: record.SellerDtls.IndustryClassificationCode || '46510',
      SupplierAdditionalAccountID:
        record.SellerDtls.AdditionalAccountID || 'CPT-CCN-W-211111-KL-000002',
      SupplierCountrySubentityCode: record.SellerDtls.Stcd,

      // Buyer details
      BuyerName: record.BuyerDtls.LglNm,
      BuyerCity: record.BuyerDtls.Loc,
      BuyerPostalCode: record.BuyerDtls.Pin,
      BuyerCountryCode: 'MYS', // Assuming Malaysia
      BuyerEmail: record.BuyerDtls.Em,
      BuyerTelephone: record.BuyerDtls.Ph,
      CustomerTIN: 'IG26339098050',
      // record.BuyerDtls.Gstin || 'Buyer TIN', // Assuming GSTIN is used as TIN
      CustomerBRN: record.BuyerDtls.Brn || 'Recipient BRN',
      CustomerAddressLine1: record.BuyerDtls.Addr1,
      CustomerAddressLine2: record.BuyerDtls.Addr2 || '',
      CustomerAddressLine3: record.BuyerDtls.Addr3 || '',
      CustomerCountrySubentityCode: record.BuyerDtls.Stcd,
      CustomerCity: 'Kuala Lumpur',
      CustomerCountryCode: 'MYS',
      CustomerPostalCode: '81300',
      CustomerName: 'Buyer Name',
      CustomerTelephone: '+60-123456789',
      CustomerEmail: 'buyer@email.com',

      // Invoice period details
      StartDate: '2024-10-01',
      EndDate: '2024-10-10',
      InvoicePeriodDescription: 'Monthly',

      // Additional document references
      BillingReferenceID: record.BillingReferenceID || 'E12345678912',
      AdditionalDocumentReferenceID: record.AdditionalDocumentReferenceID || 'IG26339098050',

      // Total and item list
      TaxableAmount: record.TaxableAmount,
      TaxAmount: record.TaxAmount,
      TotalAmount: record.ValDtls.TotInvVal,
      ItemList: record.ItemList.map((item: any) => ({
        Id: item.SlNo,
        Qty: item.Qty,
        Unit: item.Unit,
        TotItemVal: item.TotItemVal,
        Description: item.PrdDesc,
        UnitPrice: item.UnitPrice,
      })),
    };
    Modal.confirm({
      title: 'Confirm Submission',
      content: 'Are you sure you want to submit this invoice to LHDN?',
      onOk: async () => {
        const hide = message.loading('Submitting...');
        try {
          // Call the API to submit the document
          const response = await fetch('https://localhost:5001/api/invoice/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(mappedRecord),
          });

          const result = await response.json();
          if (response.ok) {
            hide();
            const { acceptedDocuments, rejectedDocuments } = result;
            if (acceptedDocuments.length > 0) {
              message.success(`Successfully submitted ${acceptedDocuments.length} documents.`);

              // Update table data for accepted documents
              const updatedData = tableData.map((row) => {
                const acceptedDoc = acceptedDocuments.find(
                  (doc) => doc.invoiceCodeNumber === row.Irn,
                );
                if (acceptedDoc) {
                  return {
                    ...row,
                    uuid: acceptedDoc.uuid, // Update the UUID if present
                    status: 'submitted', // Update the status
                  };
                }
                return row;
              });

              setTableData(updatedData);
              return true;
            } else {
              hide();
              const { rejectedDocuments } = result;

              if (rejectedDocuments && rejectedDocuments.length > 0) {
                // Format rejected document errors in multi-line
                const errorMessages = rejectedDocuments
                  .map((doc) => {
                    const { error } = doc;
                    return `
                  Invoice Code: ${doc.invoiceCodeNumber}
                  ${error.details
                    .map(
                      (detail) => `
                    Error Code: ${detail.code}
                    Message: ${detail.message}
                    Target: ${detail.target}
                    Property Path: ${detail.propertyPath || 'N/A'}
                  `,
                    )
                    .join('\n\n')}
                `;
                  })
                  .join('\n\n');

                message.error(`Submission failed:\n${errorMessages}`, 10);
              } else {
                // Fallback in case no rejected document details are provided
                message.error(`Submission failed: ${result.error?.message || 'Unknown error'}`);
              }
              return false;
            }
          }
        } catch (error) {
          hide();
          message.error('Submission failed, please try again!');
          console.log(error);
          return false;
        }
      },
    });
  };

  const renderField = (field: string, readOnly = false) => {
    switch (field) {
      case 'SellerDetails':
        return (
          <ProFormGroup title="Seller Details">
            <ProFormText
              width="md"
              name={['SellerDtls', 'Gstin']}
              label="Seller GSTIN"
              initialValue={currentRow?.SellerDtls?.Gstin}
              fieldProps={{ readOnly }}
            />
            <ProFormText
              width="md"
              name={['SellerDtls', 'LglNm']}
              label="Seller Legal Name"
              initialValue={currentRow?.SellerDtls?.LglNm}
              fieldProps={{ readOnly }}
            />
            <ProFormText
              width="md"
              name={['SellerDtls', 'TrdNm']}
              label="Seller Trade Name"
              initialValue={currentRow?.SellerDtls?.TrdNm}
              fieldProps={{ readOnly }}
            />
            <ProFormText
              width="md"
              name={['SellerDtls', 'Addr1']}
              label="Seller Address Line 1"
              initialValue={currentRow?.SellerDtls?.Addr1}
              fieldProps={{ readOnly }}
            />
            <ProFormText
              width="md"
              name={['SellerDtls', 'Addr2']}
              label="Seller Address Line 2"
              initialValue={currentRow?.SellerDtls?.Addr2}
              fieldProps={{ readOnly }}
            />
            <ProFormText
              width="md"
              name={['SellerDtls', 'Loc']}
              label="Seller Location"
              initialValue={currentRow?.SellerDtls?.Loc}
              fieldProps={{ readOnly }}
            />
            <ProFormText
              width="md"
              name={['SellerDtls', 'Pin']}
              label="Seller PIN Code"
              initialValue={currentRow?.SellerDtls?.Pin}
              fieldProps={{ readOnly }}
            />
            <ProFormText
              width="md"
              name={['SellerDtls', 'Stcd']}
              label="Seller State Code"
              initialValue={currentRow?.SellerDtls?.Stcd}
              fieldProps={{ readOnly }}
            />
            <ProFormText
              width="md"
              name={['SellerDtls', 'Ph']}
              label="Seller Phone Number"
              initialValue={currentRow?.SellerDtls?.Ph}
              fieldProps={{ readOnly }}
            />
            <ProFormText
              width="md"
              name={['SellerDtls', 'Em']}
              label="Seller Email"
              initialValue={currentRow?.SellerDtls?.Em}
              fieldProps={{ readOnly }}
            />
          </ProFormGroup>
        );

      case 'BuyerDetails':
        return (
          <ProFormGroup title="Buyer Details">
            <ProFormText
              width="md"
              name={['BuyerDtls', 'Gstin']}
              label="Buyer GSTIN"
              initialValue={currentRow?.BuyerDtls?.Gstin}
              fieldProps={{ readOnly }}
            />
            <ProFormText
              width="md"
              name={['BuyerDtls', 'LglNm']}
              label="Buyer Legal Name"
              initialValue={currentRow?.BuyerDtls?.LglNm}
              fieldProps={{ readOnly }}
            />
            <ProFormText
              width="md"
              name={['BuyerDtls', 'TrdNm']}
              label="Buyer Trade Name"
              initialValue={currentRow?.BuyerDtls?.TrdNm}
              fieldProps={{ readOnly }}
            />
            <ProFormText
              width="md"
              name={['BuyerDtls', 'Addr1']}
              label="Buyer Address Line 1"
              initialValue={currentRow?.BuyerDtls?.Addr1}
              fieldProps={{ readOnly }}
            />
            <ProFormText
              width="md"
              name={['BuyerDtls', 'Addr2']}
              label="Buyer Address Line 2"
              initialValue={currentRow?.BuyerDtls?.Addr2}
              fieldProps={{ readOnly }}
            />
            <ProFormText
              width="md"
              name={['BuyerDtls', 'Loc']}
              label="Buyer Location"
              initialValue={currentRow?.BuyerDtls?.Loc}
              fieldProps={{ readOnly }}
            />
            <ProFormText
              width="md"
              name={['BuyerDtls', 'Pin']}
              label="Buyer PIN Code"
              initialValue={currentRow?.BuyerDtls?.Pin}
              fieldProps={{ readOnly }}
            />
            <ProFormText
              width="md"
              name={['BuyerDtls', 'Stcd']}
              label="Buyer State Code"
              initialValue={currentRow?.BuyerDtls?.Stcd}
              fieldProps={{ readOnly }}
            />
            <ProFormText
              width="md"
              name={['BuyerDtls', 'Ph']}
              label="Buyer Phone Number"
              initialValue={currentRow?.BuyerDtls?.Ph}
              fieldProps={{ readOnly }}
            />
            <ProFormText
              width="md"
              name={['BuyerDtls', 'Em']}
              label="Buyer Email"
              initialValue={currentRow?.BuyerDtls?.Em}
              fieldProps={{ readOnly }}
            />
          </ProFormGroup>
        );

      case 'TotalInvoiceValue':
        return (
          <ProFormText
            width="md"
            name={['ValDtls', 'TotInvVal']}
            label="Total Invoice Value"
            initialValue={currentRow?.ValDtls?.TotInvVal}
            fieldProps={{ readOnly }}
          />
        );

      case 'ItemList':
        return (
          <ProFormList
            name="ItemList"
            label="Item List"
            initialValue={currentRow?.ItemList || []}
            readonly={true}
            deleteIconProps={false}
            copyIconProps={false}
          >
            <ProFormGroup>
              <ProFormText
                width="xs"
                name="PrdDesc"
                label="Product Name"
                fieldProps={{
                  readOnly,
                  onRender: (dom) => (
                    <Tooltip title={dom?.value}>
                      <span>{dom?.value}</span>
                    </Tooltip>
                  ),
                }}
              />
              <ProFormText width="xs" name="HsnCd" label="HSN Code" fieldProps={{ readOnly }} />
              <ProFormText width="xs" name="Qty" label="Quantity" fieldProps={{ readOnly }} />
              <ProFormText width="xs" name="Unit" label="Unit" fieldProps={{ readOnly }} />
              <ProFormText
                width="xs"
                name="UnitPrice"
                label="Unit Price"
                fieldProps={{ readOnly }}
              />
              <ProFormText
                width="xs"
                name="TotAmt"
                label="Total Amount"
                fieldProps={{ readOnly }}
              />
            </ProFormGroup>
          </ProFormList>
        );

      case 'MonetaryAmounts':
        return (
          <ProFormGroup title="Monetary Amounts">
            <ProFormText
              name="UnitPrice"
              label="Unit Price"
              fieldProps={{ readOnly }}
              rules={[{ required: true, message: 'Unit Price is required' }]}
            />
            <ProFormText
              name="Subtotal"
              label="Subtotal"
              fieldProps={{ readOnly }}
              rules={[{ required: true, message: 'Subtotal is required' }]}
            />
            <ProFormText
              name="TotalExcludingTax"
              label="Total Excluding Tax"
              fieldProps={{ readOnly }}
              rules={[{ required: true, message: 'Total Excluding Tax is required' }]}
            />
            <ProFormText name="DiscountAmount" label="Discount Amount" fieldProps={{ readOnly }} />
            <ProFormText
              name="FeeChargeAmount"
              label="Fee/Charge Amount"
              fieldProps={{ readOnly }}
            />
          </ProFormGroup>
        );

      case 'TaxAmounts':
        return (
          <ProFormGroup title="Tax Amounts">
            <ProFormText
              name="TaxRate"
              label="Tax Rate"
              fieldProps={{ readOnly }}
              rules={[{ required: true, message: 'Tax Rate is required' }]}
            />
            <ProFormText
              name="TaxAmount"
              label="Tax Amount"
              fieldProps={{ readOnly }}
              rules={[{ required: true, message: 'Tax Amount is required' }]}
            />
            <ProFormText
              name="TotalTaxAmount"
              label="Total Tax Amount"
              fieldProps={{ readOnly }}
              rules={[{ required: true, message: 'Total Tax Amount is required' }]}
            />
          </ProFormGroup>
        );

      case 'OriginalInvoiceReference':
        return (
          <ProFormGroup title="Original Invoice Reference">
            <ProFormText
              width="md"
              name="OriginaleInvoiceReferenceNumber"
              label="Original Invoice Reference Number"
              initialValue={currentRow?.OriginaleInvoiceReferenceNumber}
              fieldProps={{ readOnly }}
            />
            {/* <ProFormText
              width="md"
              name="OriginaleInvoiceUUID"
              label="Original Invoice UUID"
              initialValue={currentRow?.OriginaleInvoiceUUID}
              fieldProps={{ readOnly }}
            /> */}
          </ProFormGroup>
        );

      case 'DigitalSignature':
        return (
          <ProFormText
            width="md"
            name="IssuerDigitalSignature"
            label="Digital Signature"
            initialValue={currentRow?.IssuerDigitalSignature}
            fieldProps={{ readOnly }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <ProTable
        headerTitle={`Document Mapping Table`}
        actionRef={actionRef}
        rowKey="Irn"
        search={{
          labelWidth: 120,
        }}
        // request={fetchTransactions}
        dataSource={tableData}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              Selected <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> items
              &nbsp;&nbsp;
              <span>
                Total Invoice Value:{' '}
                {selectedRowsState.reduce((pre, item) => pre + item?.ValDtls?.TotInvVal!, 0)}
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
            disabled={selectedRowsState.find((x) => x.status !== 'pending')}
          >
            Batch submission
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        width={1000}
        title="Invoice Submission"
        open={createModalOpen || updateModalOpen}
        onOpenChange={(open) => {
          if (updateModalOpen) handleUpdateModalOpen(open);
          else handleModalOpen(open);
        }}
        onFinish={async (value) => {
          const success = currentRow ? await handleUpdate(value) : await handleAdd(value);
          if (success) {
            handleModalOpen(false);
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) actionRef.current.reload();
          }
        }}
      >
        {/* Render Fields Based on Invoice Type */}
        {lastPathSegment &&
          invoiceTypesConfig[lastPathSegment].fields.map((field) => renderField(field, true))}
      </ModalForm>

      <Drawer
        width={800}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.Irn && (
          <ProDescriptions<any>
            column={2}
            title={`Invoice Details: ${currentRow?.Irn}`}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.Irn,
            }}
            columns={descriptionColumns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default InvoiceSubmission;
