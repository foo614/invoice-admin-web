import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ProFormSelect } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Table, message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import {
  addUomMapping,
  getUomMappings,
} from '../../../../services/ant-design-pro/uomMappingService';
import { getUoms } from '../../../../services/ant-design-pro/uomService';
interface LhdnUOM {
  Code: string;
  Name: string;
}

interface SellerUOM {
  id: number;
  code: string;
  description: string;
}

interface RowData {
  key: string;
  lhdnUomCode?: string;
  sellerUomIds: number[];
}

const UOMMappingPage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [lhdnUOMList, setLhdnUOMList] = useState<LhdnUOM[]>([]);
  const [sellerUOMList, setSellerUOMList] = useState<SellerUOM[]>([]);
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(false);

  // Simulated userId (replace with actual userId source)
  const userId = '123456'; // Replace with actual userId from context or state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch LHDN UOM List
        const lhdnResponse = await getUomMappings();
        setLhdnUOMList(lhdnResponse?.data || []);
        console.log(currentUser);
        // Fetch Seller UOM List with userId
        const sellerResponse = await getUoms({ userId: currentUser?.id });
        setSellerUOMList(sellerResponse?.data || []);
      } catch (error) {
        message.error('Failed to fetch UOM data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const addRow = () => {
    const newRow: RowData = {
      key: `row-${rows.length + 1}`,
      sellerUomIds: [],
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (rowKey: string) => {
    setRows((prevRows) => prevRows.filter((row) => row.key !== rowKey));
  };

  const updateLhdnUomCode = (rowKey: string, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.key === rowKey ? { ...row, lhdnUomCode: value } : row)),
    );
  };

  const updateSellerUoms = (rowKey: string, values: number[]) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.key === rowKey ? { ...row, sellerUomIds: values } : row)),
    );
  };

  const selectedLhdnUOMs = useMemo(() => {
    const selected = new Set<string>();
    rows.forEach((row) => {
      if (row.lhdnUomCode) selected.add(row.lhdnUomCode);
    });
    return selected;
  }, [rows]);

  const selectedSellerUOMs = useMemo(() => {
    const selected = new Set<number>();
    rows.forEach((row) => row.sellerUomIds.forEach((uom) => selected.add(uom)));
    return selected;
  }, [rows]);

  const saveMappings = async () => {
    if (rows.some((row) => !row.lhdnUomCode || row.sellerUomIds.length === 0)) {
      message.error('Please complete all mappings before saving.');
      return;
    }

    try {
      const payload = rows.flatMap((row) =>
        row.sellerUomIds.map((sellerUomId) => ({
          lhdnUomCode: row.lhdnUomCode,
          uomId: sellerUomId,
        })),
      );

      await Promise.all(payload.map((mapping) => addUomMapping(mapping)));

      message.success('Mappings saved successfully!');
    } catch (error) {
      message.error('Failed to save mappings.');
    }
  };

  const columns = [
    {
      title: 'LHDN UOM',
      dataIndex: 'lhdnUomCode',
      key: 'lhdnUomCode',
      render: (_: any, record: RowData) => (
        <ProFormSelect
          options={
            Array.isArray(lhdnUOMList)
              ? lhdnUOMList
                  .filter(
                    (uom) => !selectedLhdnUOMs.has(uom.Code) || uom.Code === record.lhdnUomCode,
                  )
                  .map((uom) => ({
                    label: `${uom.Code} - ${uom.Name}`,
                    value: uom.Code,
                  }))
              : []
          }
          placeholder="Select LHDN UOM"
          showSearch
          fieldProps={{
            value: record.lhdnUomCode,
            onChange: (value) => updateLhdnUomCode(record.key, value),
            style: { width: '100%' },
          }}
        />
      ),
    },
    {
      title: 'Mapped Seller UOMs',
      dataIndex: 'sellerUomIds',
      key: 'sellerUomIds',
      render: (_: any, record: RowData) => (
        <ProFormSelect
          mode="multiple"
          options={
            Array.isArray(sellerUOMList)
              ? sellerUOMList
                  .filter(
                    (uom) =>
                      !selectedSellerUOMs.has(uom.id) || record.sellerUomIds.includes(uom.id),
                  )
                  .map((uom) => ({
                    label: `${uom.code} - ${uom.description}`,
                    value: uom.id,
                  }))
              : []
          }
          placeholder="Select Seller UOMs"
          showSearch
          fieldProps={{
            value: record.sellerUomIds,
            onChange: (values) => updateSellerUoms(record.key, values),
            style: { width: '100%' },
          }}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: RowData) => (
        <Button type="link" icon={<DeleteOutlined />} onClick={() => removeRow(record.key)} danger>
          Delete Row
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Map Seller UOMs to LHDN UOM List</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={addRow}
        style={{ marginBottom: '20px' }}
      >
        Add Row
      </Button>
      <Table
        loading={loading}
        dataSource={rows}
        columns={columns}
        pagination={false}
        bordered
        rowKey="key"
      />
      <Button type="primary" style={{ marginTop: '20px' }} onClick={saveMappings}>
        Save Mappings
      </Button>
    </div>
  );
};

export default UOMMappingPage;
