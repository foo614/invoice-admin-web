import { PlusOutlined } from '@ant-design/icons';
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
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';

/**
 * Fetch e-invoice transactions
 */
const fetchTransactions = async () => {
  try {
    const response = await fetch('/api/eInvoiceTransactions', {
      method: 'GET',
    });
    const data = await response.json();
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

/**
 * Handle add operation
 */
const handleAdd = async (fields: any) => {
  const hide = message.loading('Adding...');
  try {
    // Mock add operation
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

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<any>[] = [
    {
      title: 'Invoice ID',
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
              handleUpdateModalOpen(true);
              setCurrentRow(record);
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

  return (
    <PageContainer>
      <ProTable
        headerTitle="E-Invoice Submission Table"
        actionRef={actionRef}
        rowKey="Irn"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> New
          </Button>,
        ]}
        request={fetchTransactions}
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
