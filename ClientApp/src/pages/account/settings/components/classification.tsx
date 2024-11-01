import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ProFormSelect } from '@ant-design/pro-components';
import { Button, Table, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import localClassificationCodes from '../../../../../mock/config/classification.json';

// Define TypeScript types
interface LhdnClassification {
  Code: string;
  Description: string;
}

interface LocalClassification {
  ID: string;
  CTYPE: string;
  NAME: string;
  TEXTDESC?: string;
}

interface RowData {
  key: string;
  classificationCode?: string;
  mappings: string[]; // Array to store selected classification mappings
}

const ClassificationMappingPage: React.FC = () => {
  const [lhdnClassificationList, setLhdnClassificationList] = useState<LhdnClassification[]>([]);
  const [localClassificationList, setLocalClassificationList] = useState<LocalClassification[]>([]);
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch LHDN Classification Codes
  const fetchLhdnClassificationList = async () => {
    try {
      const response = await axios.get('https://localhost:5001/api/invoice/classificationcodes');
      setLhdnClassificationList(response.data);
    } catch (error) {
      message.error('Failed to fetch LHDN Classification list');
    }
  };

  // Fetch Local Classification Codes
  const fetchLocalClassificationList = async () => {
    try {
      setLocalClassificationList(localClassificationCodes); // Load from local JSON file
    } catch (error) {
      message.error('Failed to fetch Local Classification list');
    }
  };

  useEffect(() => {
    fetchLhdnClassificationList();
    fetchLocalClassificationList();
    setLoading(false);
  }, []);

  const addRow = () => {
    const newRow: RowData = {
      key: `row-${rows.length + 1}`,
      mappings: [],
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (rowKey: string) => {
    setRows((prevRows) => prevRows.filter((row) => row.key !== rowKey));
  };

  const updateClassificationCode = (rowKey: string, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.key === rowKey ? { ...row, classificationCode: value } : row)),
    );
  };

  const updateMappings = (rowKey: string, values: string[]) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.key === rowKey ? { ...row, mappings: values } : row)),
    );
  };

  const getSelectedClassificationCodes = () => {
    const selectedCodes = new Set<string>();
    rows.forEach((row) => {
      if (row.classificationCode) selectedCodes.add(row.classificationCode);
    });
    return selectedCodes;
  };

  const getSelectedMappings = () => {
    const selectedMappings = new Set<string>();
    rows.forEach((row) => row.mappings.forEach((mapping) => selectedMappings.add(mapping)));
    return selectedMappings;
  };

  const columns = [
    {
      title: 'LHDN Classification Code',
      dataIndex: 'classificationCode',
      key: 'classificationCode',
      render: (_: any, record: RowData) => {
        const selectedClassificationCodes = getSelectedClassificationCodes();

        return (
          <ProFormSelect
            options={lhdnClassificationList
              .filter(
                (classification) =>
                  !selectedClassificationCodes.has(classification.Code) ||
                  classification.Code === record.classificationCode,
              )
              .map((classification) => ({
                label: `${classification.Code} - ${classification.Description}`,
                value: classification.Code,
              }))}
            placeholder="Select Classification Code"
            showSearch
            fieldProps={{
              value: record.classificationCode,
              onChange: (value) => updateClassificationCode(record.key, value),
              style: { width: '100%' },
            }}
          />
        );
      },
    },
    {
      title: 'Mapped Local Classification Codes',
      dataIndex: 'mappings',
      key: 'mappings',
      render: (_: any, record: RowData) => {
        const selectedMappings = getSelectedMappings();

        return (
          <ProFormSelect
            mode="multiple"
            options={localClassificationList
              .filter(
                (localCode) =>
                  !selectedMappings.has(localCode.ID) || record.mappings.includes(localCode.ID),
              )
              .map((localCode) => ({
                label: `${localCode.NAME} - ${localCode.TEXTDESC || ''}`,
                value: localCode.ID,
              }))}
            placeholder="Select Local Classifications"
            showSearch
            fieldProps={{
              value: record.mappings,
              onChange: (values) => updateMappings(record.key, values),
              style: { width: '100%' },
            }}
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
      <h2>Map Local Classification Codes to LHDN Classification Codes</h2>
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

export default ClassificationMappingPage;
