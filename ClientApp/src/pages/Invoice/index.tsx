import { ActionType, ProTable } from '@ant-design/pro-components';
import { Button, Drawer } from 'antd';
import React, { useRef, useState } from 'react';

const InvoiceSubmission: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // Define columns for the e-invoice data
  const columns = [
    {
      title: 'Invoice ID',
      dataIndex: 'invoiceId',
      key: 'invoiceId',
    },
    {
      title: 'Seller GSTIN',
      dataIndex: ['sellerDtls', 'gstin'],
      key: 'sellerGstin',
    },
    {
      title: 'Buyer GSTIN',
      dataIndex: ['buyerDtls', 'gstin'],
      key: 'buyerGstin',
    },
    {
      title: 'Total Invoice Value',
      dataIndex: ['valDtls', 'totInvVal'],
      key: 'totalInvoiceValue',
      valueType: 'money',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        submitted: { text: 'Submitted', status: 'Success' },
        pending: { text: 'Pending', status: 'Processing' },
        rejected: { text: 'Rejected', status: 'Error' },
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="link" onClick={() => showDetails(record)}>
          View Details
        </Button>
      ),
    },
  ];

  // Show details function to set the selected record and open the drawer
  const showDetails = (record: any) => {
    setSelectedRecord(record);
    setDrawerVisible(true);
  };

  // Close drawer function
  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedRecord(null);
  };

  return (
    <>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const response = await fetch('/api/eInvoiceTransactions', {
            method: 'GET',
          });
          const data = await response.json();
          return {
            data: data.data,
            success: data.success,
            total: data.total,
          };
        }}
        rowKey="invoiceId"
        pagination={{
          pageSize: 10,
        }}
        search={false}
      />

      <Drawer
        title="Invoice Details"
        width={600}
        onClose={closeDrawer}
        visible={drawerVisible}
        placement="right"
      >
        {selectedRecord && (
          <div>
            <h3>Transaction Details</h3>
            <p>
              <strong>Tax Scheme:</strong> {selectedRecord?.tranDtls?.taxSch}
            </p>
            <p>
              <strong>Transaction Category:</strong> {selectedRecord?.tranDtls?.supTyp}
            </p>
            <p>
              <strong>Reverse Charge:</strong> {selectedRecord?.tranDtls?.regRev}
            </p>
            <p>
              <strong>E-Commerce GSTIN:</strong> {selectedRecord?.tranDtls?.ecmGstin}
            </p>
            <p>
              <strong>IGST on Intra:</strong> {selectedRecord?.tranDtls?.igstOnIntra}
            </p>

            <h3>Document Details</h3>
            <p>
              <strong>Type:</strong> {selectedRecord?.docDtls?.typ}
            </p>
            <p>
              <strong>Number:</strong> {selectedRecord?.docDtls?.no}
            </p>
            <p>
              <strong>Date:</strong> {selectedRecord?.docDtls?.dt}
            </p>

            <h3>Seller Details</h3>
            <p>
              <strong>GSTIN:</strong> {selectedRecord?.sellerDtls?.gstin}
            </p>
            <p>
              <strong>Legal Name:</strong> {selectedRecord?.sellerDtls?.lglNm}
            </p>
            <p>
              <strong>Tradename:</strong> {selectedRecord?.sellerDtls?.trdNm}
            </p>
            <p>
              <strong>Location:</strong> {selectedRecord?.sellerDtls?.loc}
            </p>
            <p>
              <strong>PIN:</strong> {selectedRecord?.sellerDtls?.pin}
            </p>
            <p>
              <strong>State Code:</strong> {selectedRecord?.sellerDtls?.stcd}
            </p>
            <p>
              <strong>Phone:</strong> {selectedRecord?.sellerDtls?.ph}
            </p>
            <p>
              <strong>Email:</strong> {selectedRecord?.sellerDtls?.em}
            </p>

            <h3>Buyer Details</h3>
            <p>
              <strong>GSTIN:</strong> {selectedRecord?.buyerDtls?.gstin}
            </p>
            <p>
              <strong>Legal Name:</strong> {selectedRecord?.buyerDtls?.lglNm}
            </p>
            <p>
              <strong>Location:</strong> {selectedRecord?.buyerDtls?.loc}
            </p>
            <p>
              <strong>Place of Supply:</strong> {selectedRecord?.buyerDtls?.pos}
            </p>

            <h3>Value Details</h3>
            <p>
              <strong>Total Invoice Value:</strong> {selectedRecord?.valDtls?.totInvVal}
            </p>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default InvoiceSubmission;
