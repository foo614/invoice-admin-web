import { getPartners, removePartner, updatePartner } from '@/services/ant-design-pro/api';
import { FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, message, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import UpdateForm from './components/UpdateForm';

const PartnerList = () => {
  const actionRef = useRef();
  const [selectedRowsState, setSelectedRowsState] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null); // To determine add or edit mode

  // Define columns for the partner list
  const columns = [
    {
      title: 'Partner Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Company Name',
      dataIndex: ['companyInfo', 'companyName'],
      key: 'companyName',
    },
    {
      title: 'Company Address',
      dataIndex: ['companyInfo', 'address'],
      key: 'address',
    },
    {
      title: 'Company Email',
      dataIndex: ['companyInfo', 'email'],
      key: 'email',
    },
    {
      title: 'Company Phone',
      dataIndex: ['companyInfo', 'phone'],
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <Switch
          checked={record.status === 'active'}
          onChange={(checked) => handleStatusChange(record, checked)}
        />
      ),
    },
    {
      title: 'Submission Count',
      dataIndex: 'submissionCount',
      key: 'submissionCount',
    },
    {
      title: 'Max Submissions',
      dataIndex: 'maxSubmissions',
      key: 'maxSubmissions',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => [
        <a key="edit" onClick={() => handleEdit(record)}>
          Edit
        </a>,
        <a key="delete" style={{ marginLeft: 8 }} onClick={() => handleDelete(record.key)}>
          Delete
        </a>,
      ],
    },
  ];

  // Fetch data from the mock API
  const { data, loading } = useRequest(() => getPartners(), {
    formatResult: (res) => res.data,
  });

  // Handle status toggle change
  const handleStatusChange = async (record, isActive) => {
    await updatePartner({ ...record, status: isActive ? 'active' : 'inactive' });
    message.success(`Partner status updated to ${isActive ? 'Active' : 'Inactive'}`);
    actionRef.current?.reload();
  };

  const handleEdit = (record) => {
    setEditingPartner(record);
    setFormVisible(true);
  };

  const handleAdd = () => {
    setEditingPartner(null); // Clear editing partner to switch to add mode
    setFormVisible(true);
  };

  // Handle delete
  const handleDelete = async (key) => {
    await removePartner(key);
    message.success('Partner deleted');
    actionRef.current?.reload();
  };

  const handleFinish = async (values) => {
    if (editingPartner) {
      await updatePartner({ ...editingPartner, ...values });
    } else {
      await addPartner(values);
    }
    setFormVisible(false);
    actionRef.current?.reload();
  };

  return (
    <PageContainer>
      <ProTable
        headerTitle="Manage Partners"
        actionRef={actionRef}
        rowKey="key"
        loading={loading}
        columns={columns}
        dataSource={data}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRowsState(selectedRows),
        }}
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={handleAdd}>
            Add Partner
          </Button>,
        ]}
      />

      {selectedRowsState?.length > 0 && (
        <FooterToolbar>
          <Button
            onClick={async () => {
              await Promise.all(selectedRowsState.map((row) => removePartner(row.key)));
              setSelectedRowsState([]);
              actionRef.current?.reload();
              message.success('Deleted successfully');
            }}
          >
            Batch Delete
          </Button>
        </FooterToolbar>
      )}

      {/* Add/Edit Form Modal */}
      <UpdateForm
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onFinish={handleFinish}
        initialValues={editingPartner}
      />
    </PageContainer>
  );
};

export default PartnerList;
