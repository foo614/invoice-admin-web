import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Select, Table, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import sellerUOMListData from '../../../../../mock/config/uom.json';

// Define TypeScript types
interface LhdnUOM {
  Code: string;
  Name: string;
}

interface SellerUOM {
  ID: string;
  DESC: string;
  TEXTDESC: string;
}

interface RowData {
  key: string;
  uomCode?: string;
  uomMappings: string[]; // Array to store selected seller UOM IDs
}

const UOMMappingPage: React.FC = () => {
  const [lhdnUOMList, setLhdnUOMList] = useState<LhdnUOM[]>([]);
  const [sellerUOMList, setSellerUOMList] = useState<SellerUOM[]>([]);
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch LHDN UOM and Seller UOM lists
  const fetchUOMList = async () => {
    try {
      const response = await axios.get('https://localhost:5001/api/invoice/unittypes');
      setLhdnUOMList(response.data);
    } catch (error) {
      message.error('Failed to fetch LHDN UOM list');
    }
  };

  const fetchSellerUOMList = async () => {
    try {
      setSellerUOMList(sellerUOMListData);
    } catch (error) {
      message.error('Failed to fetch Seller UOM list');
    }
  };

  useEffect(() => {
    fetchUOMList();
    fetchSellerUOMList();
    setLoading(false);
  }, []);

  const addRow = () => {
    const newRow: RowData = {
      key: `row-${rows.length + 1}`,
      uomMappings: [],
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (rowKey: string) => {
    setRows((prevRows) => prevRows.filter((row) => row.key !== rowKey));
  };

  const updateUOMCode = (rowKey: string, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.key === rowKey ? { ...row, uomCode: value } : row)),
    );
  };

  const updateMappings = (rowKey: string, values: string[]) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.key === rowKey ? { ...row, uomMappings: values } : row)),
    );
  };

  // Get selected LHDN UOMs to exclude from other rows
  const getSelectedLhdnUOMs = () => {
    const selectedUOMs = new Set<string>();
    rows.forEach((row) => {
      if (row.uomCode) selectedUOMs.add(row.uomCode);
    });
    return selectedUOMs;
  };

  // Get selected Seller UOMs to exclude from other rows
  const getSelectedSellerUOMs = () => {
    const selectedUOMs = new Set<string>();
    rows.forEach((row) => row.uomMappings.forEach((uom) => selectedUOMs.add(uom)));
    return selectedUOMs;
  };

  const columns = [
    {
      title: 'LHDN UOM',
      dataIndex: 'uomCode',
      key: 'uomCode',
      render: (_: any, record: RowData) => {
        const selectedLhdnUOMs = getSelectedLhdnUOMs();

        return (
          <Select
            style={{ width: '100%' }}
            placeholder="Select UOM"
            value={record.uomCode}
            onChange={(value) => updateUOMCode(record.key, value)}
            options={lhdnUOMList
              .filter((uom) => !selectedLhdnUOMs.has(uom.Code) || uom.Code === record.uomCode)
              .map((uom) => ({
                label: `${uom.Code} - ${uom.Name}`,
                value: uom.Code,
              }))}
          />
        );
      },
    },
    {
      title: 'Mapped Seller UOMs',
      dataIndex: 'uomMappings',
      key: 'uomMappings',
      render: (_: any, record: RowData) => {
        const selectedSellerUOMs = getSelectedSellerUOMs();

        return (
          <Select
            mode="multiple"
            placeholder="Select Seller UOMs"
            value={record.uomMappings}
            onChange={(values) => updateMappings(record.key, values)}
            style={{ width: '100%' }}
            options={sellerUOMList
              .filter(
                (uom) => !selectedSellerUOMs.has(uom.ID) || record.uomMappings.includes(uom.ID),
              )
              .map((uom) => ({
                label: `${uom.DESC}`,
                value: uom.ID,
              }))}
          />
        );
      },
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
