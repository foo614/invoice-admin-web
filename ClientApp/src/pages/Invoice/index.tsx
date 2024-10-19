import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormGroup,
  ProFormList,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

/**
 * Fetch e-invoice transactions
 */
// const fetchTransactions = async () => {
//   try {
//     const response = await fetch('/api/eInvoiceTransactions', {
//       method: 'GET',
//     });
//     const data = await response.json();
//     return {
//       data: data.data,
//       success: data.success,
//       total: data.total,
//     };
//   } catch (error) {
//     message.error('Failed to fetch e-invoice transactions.');
//     return { data: [], success: false, total: 0 };
//   }
// };

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

const InvoiceSubmission: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]); // State for table data

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
              handleLHDNSubmission(record, actionRef, setSelectedRows);
            }}
          >
            LHDN Submission
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

  /**
   * Handle LHDN submission
   */
  const handleLHDNSubmission = async (record: any, actionRef: any, setSelectedRows: any) => {
    const mappedRecord = {
      Irn: 'INV124567',
      IssueDate: '2024-10-19',
      // record.DocDtls.Dt ||
      IssueTime: record.DocDtls.Tm || '00:30:00Z', // Assuming time is not provided
      InvoiceTypeCode: '01',
      // record.DocDtls.Typ ||
      CurrencyCode: 'MYR', // Assuming currency is MYR

      // Supplier details
      SupplierName: record.SellerDtls.LglNm || 'Supplier Name',
      SupplierCity: record.SellerDtls.Loc || 'Kuala Lumpur',
      SupplierPostalCode: record.SellerDtls.Pin,
      SupplierCountryCode: 'MY', // Assuming Malaysia
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
      BuyerCountryCode: 'MY', // Assuming Malaysia
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
      StartDate: '2024-09-01',
      EndDate: '2024-10-10',
      InvoicePeriodDescription: 'Monthly',

      // Additional document references
      BillingReferenceID: record.BillingReferenceID || 'E12345678912',
      AdditionalDocumentReferenceID: record.AdditionalDocumentReferenceID || 'IG26339098050',

      // Total and item list
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
      content: 'Are you sure you want to submit this invoice to LHDN?' + JSON.stringify(record),
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
          console.log(result);
          if (response.ok) {
            hide();
            message.success('Submitted successfully');
            const updatedData = tableData.map((row) => {
              if (row.Irn === record.Irn) {
                return {
                  ...row,
                  uuid: result.acceptedDocuments[0].uuid, // Update the UUID
                  status: 'submitted', // Update the status
                };
              }
              return row;
            });

            // Update the state
            setTableData(updatedData);
            return true;
          } else {
            hide();
            // Check if the response contains validation errors
            if (result.error?.details && result.error.details.length > 0) {
              // Iterate through the details array and collect error messages
              const errorMessages = result.error.details
                .map((detail: any) => `${detail.message} (Code: ${detail.code})`)
                .join('\n');
              message.error(`Submission failed:\n${errorMessages}`);
            } else {
              // Fallback in case no details are provided
              message.error(`Submission failed: ${result.error?.message || 'Unknown error'}`);
            }
            return false;
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

  return (
    <PageContainer>
      <ProTable
        headerTitle="E-Invoice Submission Table"
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
        title={currentRow ? 'Edit Invoice' : 'New Invoice'}
        width={'60%'}
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
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        initialValues={currentRow}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: 'Invoice ID is required',
            },
          ]}
          width="xl"
          name="Irn"
          label="Invoice ID"
        />
        <ProFormTextArea width="xl" name="desc" label="Description" />
        <ProFormGroup title="Self-Billed Details">
          <ProFormText
            width="md"
            name={['SellerDtls', 'AdditionalAccountID']}
            label="Additional Account ID"
          />
          <ProFormText width="md" name="billingReference" label="Billing Reference" />
        </ProFormGroup>

        <ProFormGroup title="Seller Details">
          <ProFormText
            rules={[
              {
                required: true,
                message: 'Seller GSTIN is required',
              },
            ]}
            width="md"
            name={['SellerDtls', 'Gstin']}
            label="Seller GSTIN"
          />
          <ProFormText width="md" name={['SellerDtls', 'LglNm']} label="Seller Legal Name" />
          <ProFormText width="md" name={['SellerDtls', 'TrdNm']} label="Seller Trade Name" />
          <ProFormText width="md" name={['SellerDtls', 'Addr1']} label="Seller Address Line 1" />
          <ProFormText width="md" name={['SellerDtls', 'Addr2']} label="Seller Address Line 2" />
          <ProFormText width="md" name={['SellerDtls', 'Loc']} label="Seller Location" />
          <ProFormText width="md" name={['SellerDtls', 'Pin']} label="Seller PIN Code" />
          <ProFormText width="md" name={['SellerDtls', 'Stcd']} label="Seller State Code" />
          <ProFormText width="md" name={['SellerDtls', 'Ph']} label="Seller Phone Number" />
          <ProFormText width="md" name={['SellerDtls', 'Em']} label="Seller Email" />
        </ProFormGroup>

        <ProFormGroup title="Dispatch Details">
          <ProFormText width="md" name={['DispDtls', 'Gstin']} label="Dispatch GSTIN" />
          <ProFormText width="md" name={['DispDtls', 'Addr1']} label="Dispatch Address Line 1" />
          <ProFormText width="md" name={['DispDtls', 'Addr2']} label="Dispatch Address Line 2" />
          <ProFormText width="md" name={['DispDtls', 'Loc']} label="Dispatch Location" />
        </ProFormGroup>

        <ProFormGroup title="Ship To Details">
          <ProFormText width="md" name={['ShipDtls', 'Gstin']} label="Ship To GSTIN" />
          <ProFormText width="md" name={['ShipDtls', 'Addr1']} label="Ship To Address Line 1" />
          <ProFormText width="md" name={['ShipDtls', 'Addr2']} label="Ship To Address Line 2" />
          <ProFormText width="md" name={['ShipDtls', 'Loc']} label="Ship To Location" />
        </ProFormGroup>

        <ProFormList
          name="ItemList"
          label={<b className="ant-pro-form-group-title">Item List</b>}
          copyIconProps={false}
          deleteIconProps={{
            tooltipText: 'Delete this item',
          }}
        >
          <ProFormGroup>
            <ProFormText width="xs" name="PrdDesc" label="Product Name" />
            <ProFormText width="xs" name="HsnCd" label="HSN Code" />
            <ProFormText width="xs" name="Qty" label="Quantity" />
            <ProFormText width="xs" name="Unit" label="Unit" />
            <ProFormText width="xs" name="UnitPrice" label="Unit Price" />
            <ProFormText width="xs" name="TotAmt" label="Total Amount" />
          </ProFormGroup>
        </ProFormList>

        <ProFormText
          rules={[
            {
              required: true,
              message: 'Total Invoice Value is required',
            },
          ]}
          width="md"
          name={['ValDtls', 'TotInvVal']}
          label="Total Invoice Value"
        />
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
