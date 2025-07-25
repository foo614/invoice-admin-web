import {
  addPartner,
  getPartners,
  removePartner,
  updatePartner,
} from '@/services/ant-design-pro/partnerService';
import { FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Modal, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import UpdateForm from './components/UpdateForm';

const PartnerList = () => {
  const actionRef = useRef();
  const [selectedRowsState, setSelectedRowsState] = useState<API.PartnerListItem[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingPartner, setEditingPartner] = useState<API.PartnerListItem | null>(null); // To determine add or edit mode
  const [partnerList, setPartnerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);

  // Handle status toggle change
  const handleStatusChange = async (record: API.PartnerListItem, isActive: boolean) => {
    await updatePartner(record.id, { ...record, status: isActive });
    message.success(`Partner status updated to ${isActive ? 'Active' : 'Inactive'}`);
    actionRef.current?.reload();
  };

  const handleView = (record: API.PartnerListItem) => {
    setEditingPartner(record);
    setIsViewMode(true);
    setFormVisible(true);
  };

  const handleEdit = (record: API.PartnerListItem) => {
    setEditingPartner(record);
    setFormVisible(true);
  };

  const handleAdd = () => {
    setEditingPartner(null); // Clear editing partner to switch to add mode
    setFormVisible(true);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this partner?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await removePartner(id);
          message.success('Partner deleted');
          actionRef.current?.reload();
        } catch (error) {
          message.error('Failed to delete partner');
        }
      },
    });
  };

  const handleFinish = async (values: API.PartnerListItem) => {
    if (editingPartner) {
      await updatePartner(editingPartner.id, { ...editingPartner, ...values });
    } else {
      await addPartner(values);
    }
    setFormVisible(false);
    setEditingPartner(null);
    actionRef.current?.reload();
  };

  // Define columns for the partner list
  const columns = [
    {
      title: 'Partner Name',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => {
        return (
          <>
            <a key="view" onClick={() => handleView(record)}>
              {record.name}
            </a>
          </>
        )
      }
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Company Address',
      dataIndex: 'address1',
      key: 'address',
      hideInSearch: true,
      hideInTable: true,
      render: (_: any, record: API.PartnerListItem) => {
        const { address1, address2, address3 } = record;
        return [address1, address2, address3].filter((line) => line).join(', ');
      },
    },
    {
      title: 'Company Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Company Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'License Key',
      dataIndex: ['licenseKey', 'key'],
      key: 'licenseKey',
      render: (licenseKey: any) => (licenseKey ? licenseKey : 'N/A'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_: any, record: API.PartnerListItem) => (
        <Switch
          checked={record.status}
          onChange={(checked) => handleStatusChange(record, checked)}
        />
      ),
      hideInSearch: true,
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value: any, record: { status: any; }) => record.status === value,
    },
    {
      title: 'Submission Count',
      dataIndex: ['licenseKey', 'submissionCount'],
      key: 'submissionCount',
      hideInSearch: true,
    },
    {
      title: 'Max Submissions',
      dataIndex: ['licenseKey', 'maxSubmissions'],
      key: 'maxSubmissions',
      hideInSearch: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      hideInSearch: true,
      render: (_: any, record: API.PartnerListItem) => [
        <a key="edit" onClick={() => handleEdit(record)}>
          Edit
        </a>,
        <a
          key="delete"
          style={{ marginLeft: 8, color: 'red' }}
          onClick={() => handleDelete(record.id)}
        >
          Delete
        </a>,
      ],
    },
  ];

  const fetchData = async (params: {
    pageSize: number;
    pageNumber: number;
    name?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    licenseKey?: string;
    status?: boolean;
  }) => {
    try {
      setLoading(true);
      const response = await getPartners({
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        name: params.name,
        companyName: params.companyName,
        email: params.email,
        phone: params.phone,
        licenseKey: params.licenseKey,
        status: params.status,
      });

      setPartnerList(response?.data.data || []);

      return {
        data: response?.data.data || [],
        success: response?.data.succeeded || false,
        total: response?.data.totalCount || 0,
      };
    } catch (error) {
      message.error('Failed to fetch partners data.');
      return { data: [], success: false, total: 0 };
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <ProTable
        headerTitle="Manage Partners"
        actionRef={actionRef}
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={partnerList}
        pagination={{ pageSize: 10 }}
        request={(params) =>
          fetchData({
            pageSize: params.pageSize ?? 10,
            pageNumber: params.current ?? 1,
            name: params.name,
            companyName: params.companyName,
            email: params.email,
            phone: params.phone,
            licenseKey: params.licenseKey,
            status: params.status,
          })
        }
        rowSelection={{
          selectedRowKeys: selectedRowsState.map((row) => row.id),
          onChange: (_, selectedRows) => setSelectedRowsState(selectedRows),
        }}
        search={{
          labelWidth: 'auto',
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
            onClick={() => {
              Modal.confirm({
                title: 'Are you sure you want to delete the selected partners?',
                content: 'This action cannot be undone.',
                onOk: async () => {
                  try {
                    await Promise.all(selectedRowsState.map((row) => removePartner(row.id)));
                    setSelectedRowsState([]);
                    actionRef.current?.reload();
                    message.success('Deleted successfully');
                  } catch (error) {
                    message.error('Failed to delete partners');
                  }
                },
              });
            }}
          >
            Batch Delete
          </Button>
        </FooterToolbar>
      )}

      {/* Add/Edit Form Modal */}
      <UpdateForm
        key={editingPartner ? editingPartner.id : 'add'}
        visible={formVisible}
        onClose={() => { setFormVisible(false); setIsViewMode(false); }}
        onFinish={handleFinish}
        initialValues={editingPartner}
        isViewMode={isViewMode}
      />
    </PageContainer>
  );
};

export default PartnerList;
