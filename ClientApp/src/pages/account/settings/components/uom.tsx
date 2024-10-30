import { PlusOutlined } from '@ant-design/icons';
import { Button, Select, Space, Table, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import sellerUOMListData from '../../../../../mock/config/uom.json'; // Importing the local JSON file

// Define TypeScript types for LHDN UOM and mapping data
interface LhdnUOM {
  Code: string;
  Name: string;
}

interface SellerUOM {
  Code: string;
  Name: string;
}

interface RowData {
  key: string;
  uomCode?: string;
  uomMappings: { sellerUOM: string }[];
}

const UOMMappingPage: React.FC = () => {
  const [lhdnUOMList, setLhdnUOMList] = useState<LhdnUOM[]>([]);
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch UOM list from the unitypes API
  const fetchUOMList = async () => {
    try {
      const response = await axios.get('https://localhost:5001/api/invoice/unittypes');
      setLhdnUOMList(response.data);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch UOM list');
    }
  };

  useEffect(() => {
    fetchUOMList();
  }, []);

  // Handle adding a new row
  const addRow = () => {
    const newRow: RowData = {
      key: `row-${rows.length + 1}`,
      uomMappings: [{ sellerUOM: '' }],
    };
    setRows([...rows, newRow]);
  };

  // Handle adding a new mapping for a specific row
  const addMapping = (rowKey: string) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.key === rowKey ? { ...row, uomMappings: [...row.uomMappings, { sellerUOM: '' }] } : row,
      ),
    );
  };

  // Handle updating the LHDN UOM selection for a specific row
  const updateUOMCode = (rowKey: string, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.key === rowKey ? { ...row, uomCode: value } : row)),
    );
  };

  // Handle updating a specific mapping within a row
  const updateMapping = (rowKey: string, index: number, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.key === rowKey
          ? {
              ...row,
              uomMappings: row.uomMappings.map((mapping, i) =>
                i === index ? { sellerUOM: value } : mapping,
              ),
            }
          : row,
      ),
    );
  };

  // Define table columns
  const columns = [
    {
      title: 'LHDN UOM',
      dataIndex: 'uomCode',
      key: 'uomCode',
      render: (_: any, record: RowData) => (
        <Select
          style={{ width: '100%' }}
          placeholder="Select UOM"
          value={record.uomCode}
          onChange={(value) => updateUOMCode(record.key, value)}
          options={lhdnUOMList.map((uom) => ({
            label: `${uom.Code} - ${uom.Name}`,
            value: uom.Code,
          }))}
        />
      ),
    },
    {
      title: 'Mapped Seller UOMs',
      dataIndex: 'uomMappings',
      key: 'uomMappings',
      render: (_: any, record: RowData) => (
        <Space direction="vertical" style={{ width: '100%' }}>
          {record.uomMappings.map((mapping, index) => (
            <Select
              key={`${record.key}-${index}`}
              style={{ width: '100%' }}
              placeholder="Select Seller UOM"
              value={mapping.sellerUOM}
              onChange={(value) => updateMapping(record.key, index, value)}
              options={sellerUOMListData.map((uom) => ({
                label: `${uom.ID} - ${uom.DESC}`,
                value: uom.ID,
              }))}
            />
          ))}
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => addMapping(record.key)}
            style={{ width: '100%' }}
          >
            Add UOM Mapping
          </Button>
        </Space>
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
      <Button
        type="primary"
        style={{ marginTop: '20px' }}
        onClick={() => message.success('Mappings saved successfully!')}
      >
        Save Mappings
      </Button>
    </div>
  );
};

export default UOMMappingPage;
