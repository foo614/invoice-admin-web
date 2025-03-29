import { addUom, getUoms, removeUom, updateUom } from '@/services/ant-design-pro/uomService';
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

type Uom = {
  id: string;
  code: string;
  description: string;
  isDeleted: boolean;
};

const UomList = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef();
  const [selectedRowsState, setSelectedRowsState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uomList, setUomList] = useState<Uom[]>([]);
  const [editUom, setEditUom] = useState<Uom | null>(null);
  const [formVisible, setFormVisible] = useState(false);

  const fetchData = async (params: { pageSize: number; pageNumber: number }) => {
    try {
      setLoading(true);
      const response = await getUoms({
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        userId: currentUser?.id,
      });

      setUomList(response?.data.data || []);

      return {
        data: response?.data.data || [],
        success: response?.data.succeeded || false,
        total: response?.data.totalCount || 0,
      };
    } catch (error) {
      message.error('Failed to fetch uom data.');
      return { data: [], success: false, total: 0 };
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: Uom) => {
    setEditUom(record);
    setFormVisible(true);
  };

  const handleAdd = () => {
    setEditUom(null);
    setFormVisible(true);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this uom?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await removeUom(id);
          message.success('Uom deleted');
          setSelectedRowsState([]);
          actionRef.current?.reload();
        } catch (error) {
          message.error('Failed to delete uom');
        }
      },
    });
  };

  const handleFinish = async (values: Uom) => {
    if (editUom) {
      await updateUom(editUom.id, { ...values });
    } else {
      await addUom({
        ...values,
        userId: currentUser?.id,
      });
    }
    setEditUom(null);
    setFormVisible(false);
    actionRef.current?.reload();
  };

  const columns: ProColumns<Uom>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      hideInTable: true,
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'name',
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
        headerTitle={<h2 style={{ fontSize: '1.3rem' }}>Seller UOM List</h2>}
        actionRef={actionRef}
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={uomList}
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
            Add UOM
          </Button>,
        ]}
      />

      {selectedRowsState?.length > 0 && (
        <FooterToolbar>
          <Button
            onClick={() => {
              Modal.confirm({
                title: 'Are you sure you want to delete the selected uoms?',
                content: 'This action cannot be undone.',
                onOk: async () => {
                  try {
                    await Promise.all(selectedRowsState.map((row) => removeUom(row.id)));
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
        key={editUom ? editUom.id : 'add'}
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
        }}
        onFinish={handleFinish}
        initialValues={editUom}
      />
    </div>
  );
};

const UpdateForm = ({ visible, onClose, onFinish, initialValues }) => {
  const [form] = Form.useForm();

  return (
    <ModalForm
      title={initialValues ? 'Edit UOM' : 'Add UOM'}
      open={visible}
      initialValues={initialValues}
      form={form}
      modalProps={{
        onCancel: onClose,
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        await onFinish(values);
        message.success(initialValues ? 'UOM updated successfully' : 'UOM added successfully');
      }}
    >
      <ProFormText
        name="code"
        label="UOM Code"
        placeholder="Enter UOM code"
        rules={[
          { required: true, message: 'Please enter the UOM code' },
          { min: 2, message: 'UOM description must be at least 2 characters' },
        ]}
      />
      <ProFormText
        name="description"
        label="UOM description"
        placeholder="Enter UOM desctription"
        rules={[
          { required: true, message: 'Please enter the UOM desctription' },
          { min: 2, message: 'UOM description must be at least 2 characters' },
        ]}
      />
      <ProFormText name="id" hidden />
    </ModalForm>
  );
};

export default UomList;
