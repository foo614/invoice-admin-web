import {
  addClassification,
  getClassifications,
  removeClassification,
  updateClassification,
} from '@/services/ant-design-pro/classificationService';
import {
  FooterToolbar,
  ModalForm,
  ProColumns,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Form, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';

type Classification = {
  id: string;
  code: string;
  description: string;
  isDeleted: boolean;
};

const ClassficationList = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef();
  const [selectedRowsState, setSelectedRowsState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classficationList, setClassficationList] = useState<Classification[]>([]);
  const [editClassification, setEditClassification] = useState<Classification | null>(null);
  const [formVisible, setFormVisible] = useState(false);

  const fetchData = async (params: { pageSize: number; pageNumber: number }) => {
    try {
      setLoading(true);
      const response = await getClassifications({
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        userId: currentUser?.id,
      });

      setClassficationList(response?.data.data || []);

      return {
        data: response?.data.data || [],
        success: response?.data.succeeded || false,
        total: response?.data.totalCount || 0,
      };
    } catch (error) {
      message.error('Failed to fetch classification data.');
      return { data: [], success: false, total: 0 };
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: Classification) => {
    setEditClassification(record);
    setFormVisible(true);
  };

  const handleAdd = () => {
    setEditClassification(null);
    setFormVisible(true);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this classification?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await removeClassification(id);
          message.success('Classification deleted');
          setSelectedRowsState([]);
          actionRef.current?.reload();
        } catch (error) {
          message.error('Failed to delete classification');
        }
      },
    });
  };

  const handleFinish = async (values: Classification) => {
    if (editClassification) {
      await updateClassification(editClassification.id, { ...values });
    } else {
      await addClassification({
        ...values,
        userId: currentUser?.id,
      });
    }
    setEditClassification(null);
    setFormVisible(false);
    actionRef.current?.reload();
  };

  const columns: ProColumns<Classification>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      hideInTable: true,
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      hideInSearch: true,
      render: (_, record) => [
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

  return (
    <div style={{ paddingTop: '5px' }}>
      <ProTable
        headerTitle={<h2 style={{ fontSize: '1.3rem' }}>Seller Classification Code List</h2>}
        actionRef={actionRef}
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={classficationList}
        pagination={{ pageSize: 20 }}
        request={(params) =>
          fetchData({
            pageSize: params.pageSize ?? 20,
            pageNumber: params.current ?? 1,
          })
        }
        rowSelection={{
          selectedRowKeys: selectedRowsState.map((row) => row.id),
          onChange: (_, selectedRows) => setSelectedRowsState(selectedRows),
        }}
        search={false}
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={handleAdd}>
            Add Classification Code
          </Button>,
        ]}
      />

      {selectedRowsState?.length > 0 && (
        <FooterToolbar>
          <Button
            onClick={() => {
              Modal.confirm({
                title: 'Are you sure you want to delete the selected classifications?',
                content: 'This action cannot be undone.',
                onOk: async () => {
                  try {
                    await Promise.all(selectedRowsState.map((row) => removeClassification(row.id)));
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

      <UpdateForm
        key={editClassification ? editClassification.id : 'add'}
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
        }}
        onFinish={handleFinish}
        initialValues={editClassification}
      />
    </div>
  );
};

const UpdateForm = ({ visible, onClose, onFinish, initialValues }) => {
  const [form] = Form.useForm();

  return (
    <ModalForm
      title={initialValues ? 'Edit Classification' : 'Add Classification'}
      open={visible}
      initialValues={initialValues}
      form={form}
      modalProps={{
        onCancel: onClose,
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        await onFinish(values);
        message.success(
          initialValues
            ? 'Classification updated successfully'
            : 'Classification added successfully',
        );
      }}
    >
      <ProFormText
        name="code"
        label="Classification Code"
        placeholder="Enter Classification code"
        rules={[
          { required: true, message: 'Please enter the Classification code' },
          { min: 2, message: 'Classification description must be at least 2 characters' },
        ]}
      />
      <ProFormText
        name="description"
        label="Classification description"
        placeholder="Enter Classification desctription"
        rules={[
          { required: true, message: 'Please enter the Classification desctription' },
          { min: 2, message: 'Classification description must be at least 2 characters' },
        ]}
      />
      <ProFormText name="id" hidden />
    </ModalForm>
  );
};

export default ClassficationList;
