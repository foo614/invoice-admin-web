import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { ProFormSelect, ProTable } from '@ant-design/pro-components';
import { Button, Empty, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from '@umijs/max';
import { getClassificationCodes } from '@/services/ant-design-pro/invoiceService';
import { getClassifications } from '@/services/ant-design-pro/classificationService';
import {
  addClassificationMapping,
  getClassificationMappings,
  removeClassificationMapping,
} from '@/services/ant-design-pro/classificationMappingService';

interface LhdnClassification {
  code: string;
  description: string;
}

interface LocalClassification {
  id: number;
  code: string;
  description: string;
}

interface RowData {
  key: string;
  lhdnClassificationCode?: string;
  classificationId: number[]; // Array to store selected classification classificationId
}

interface ClassificationMapping {
  id: string;
  lhdnClassificationCode?: string;
  classificationId: number;
}

const ClassificationMappingPage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [lhdnClassificationList, setLhdnClassificationList] = useState<LhdnClassification[]>([]);
  const [sellerClassificationList, setSellerClassificationList] = useState<LocalClassification[]>(
    [],
  );
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [initialClassificationMappings, setInitialClassificationMappings] = useState<
    ClassificationMapping[]
  >([]);

  function transformToRowData(classificationMappings: any[]): RowData[] {
    const groupedData = classificationMappings.reduce(
      (acc, item) => {
        const groupKey = item.lhdnClassificationCode || 'Default';
        if (!acc[groupKey]) {
          acc[groupKey] = {
            key: groupKey,
            lhdnClassificationCode: item.lhdnClassificationCode,
            classificationId: [],
          };
        }
        acc[groupKey].classificationId.push(item.classificationId);
        return acc;
      },
      {} as Record<string, RowData>,
    );

    return Object.values(groupedData);
  }

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch LHDN Classification List
      const lhdnResponse = await getClassificationCodes();
      setLhdnClassificationList(lhdnResponse.data.data || []);

      // Fetch Seller Classification List with userId
      const sellerResponse = await getClassifications({
        userId: currentUser?.id,
      });
      setSellerClassificationList(sellerResponse?.data.data || []);

      // Fetch Classification Mapping
      const classificationMapping = await getClassificationMappings({ userId: currentUser?.id });
      const classificationMappingResponse = classificationMapping?.data.data;

      setInitialClassificationMappings(classificationMappingResponse || []);
      let rowData = transformToRowData(classificationMappingResponse);
      setRows(rowData || []);
    } catch (error) {
      message.error('Failed to fetch Classification data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setLoading(false);
  }, []);

  const addRow = () => {
    const newRow: RowData = {
      key: `row-${rows.length + 1}`,
      classificationId: [],
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (rowKey: string) => {
    setRows((prevRows) => prevRows.filter((row) => row.key !== rowKey));
  };

  const updateClassificationCode = (rowKey: string, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.key === rowKey ? { ...row, lhdnClassificationCode: value } : row)),
    );
  };

  const updateMappings = (rowKey: string, values: number[]) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.key === rowKey ? { ...row, classificationId: values } : row)),
    );
  };

  const getSelectedClassificationCodes = () => {
    const selectedCodes = new Set<string>();
    rows.forEach((row) => {
      if (row.lhdnClassificationCode) selectedCodes.add(row.lhdnClassificationCode);
    });
    return selectedCodes;
  };

  const getSelectedMappings = () => {
    const selectedMappings = new Set<number>();
    rows.forEach((row) => row.classificationId.forEach((mapping) => selectedMappings.add(mapping)));
    return selectedMappings;
  };

  const saveMappings = async () => {
    if (rows.some((row) => !row.lhdnClassificationCode || row.classificationId.length === 0)) {
      message.error('Please complete all mappings before saving.');
      return;
    }

    try {
      const savedMapping = rows.flatMap((row) =>
        row.classificationId.map((classificationId) => ({
          lhdnClassificationCode: row.lhdnClassificationCode,
          classificationId: classificationId,
        })),
      );

      const additions = savedMapping.filter(
        (saved) =>
          !initialClassificationMappings.some(
            (initial) =>
              initial.lhdnClassificationCode === saved.lhdnClassificationCode &&
              initial.classificationId === saved.classificationId,
          ),
      );

      const deletions = initialClassificationMappings.filter(
        (initial) =>
          !savedMapping.some(
            (saved) =>
              saved.lhdnClassificationCode === initial.lhdnClassificationCode &&
              saved.classificationId === initial.classificationId,
          ),
      );

      if (additions.length > 0) {
        const additionPromises = additions.map((mapping) => addClassificationMapping(mapping));
        await Promise.all(additionPromises);
      }

      if (deletions.length > 0) {
        const deletionPromises = deletions.map((mapping) =>
          removeClassificationMapping(mapping.id),
        );
        await Promise.all(deletionPromises);
      }

      message.success('Mappings saved successfully!');
      setIsEditMode(false);
      fetchData();
    } catch (error) {
      message.error('Failed to save classification.');
    }
  };

  const columns = [
    {
      title: 'LHDN Classification Code',
      dataIndex: 'lhdnClassificationCode',
      key: 'lhdnClassificationCode',
      render: (_: any, record: RowData) => {
        const selectedClassificationCodes = getSelectedClassificationCodes();

        return isEditMode ? (
          <ProFormSelect
            options={lhdnClassificationList
              .filter(
                (classification) =>
                  !selectedClassificationCodes.has(classification.code) ||
                  classification.code === record.lhdnClassificationCode,
              )
              .map((classification) => ({
                label: `${classification.code} - ${classification.description}`,
                value: classification.code,
              }))}
            placeholder="Select LHDN Classification Code"
            showSearch
            fieldProps={{
              value: record.lhdnClassificationCode,
              onChange: (value) => updateClassificationCode(record.key, value),
              style: { width: '100%' },
            }}
          />
        ) : (
          (() => {
            const classification = lhdnClassificationList.find(
              (cc) => cc.code === record.lhdnClassificationCode,
            );
            return classification
              ? `${classification.code} - ${classification.description}`
              : record.lhdnClassificationCode;
          })()
        );
      },
    },
    {
      title: 'Mapped Local Classification Codes',
      dataIndex: 'classificationId',
      key: 'classificationId',
      render: (_: any, record: RowData) => {
        const selectedMappings = getSelectedMappings();

        return isEditMode ? (
          <ProFormSelect
            mode="multiple"
            options={sellerClassificationList
              .filter(
                (classification) =>
                  !selectedMappings.has(classification.id) ||
                  record.classificationId.includes(classification.id),
              )
              .map((classification) => ({
                label: `${classification.code}`,
                value: classification.id,
              }))}
            placeholder="Select Local Classifications"
            showSearch
            fieldProps={{
              value: record.classificationId,
              onChange: (values) => updateMappings(record.key, values),
              style: { width: '100%' },
            }}
          />
        ) : (
          <div>
            {record.classificationId.map((mappingId) => {
              const classification = sellerClassificationList.find(
                (classification) => classification.id === mappingId,
              );
              return classification ? (
                <div
                  key={classification.id}
                >{`${classification.code} - ${classification.description}`}</div>
              ) : null;
            })}
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      hideInTable: !isEditMode,
      render: (_: any, record: RowData) => (
        <Button type="link" icon={<DeleteOutlined />} onClick={() => removeRow(record.key)} danger>
          Delete Row
        </Button>
      ),
    },
  ];

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const cancelChanges = () => {
    let rowData = transformToRowData(initialClassificationMappings);
    setRows(rowData || []);
    setIsEditMode(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Map Local Classification Codes to LHDN Classification Codes</h2>
      <Space style={{ marginBottom: 16 }}>
        {isEditMode ? (
          <>
            <Button type="primary" icon={<SaveOutlined />} onClick={saveMappings}>
              Save
            </Button>
            <Button icon={<CloseOutlined />} onClick={cancelChanges}>
              Cancel
            </Button>
          </>
        ) : (
          <Button type="primary" onClick={toggleEditMode} icon={<EditOutlined />}>
            Edit Mappings
          </Button>
        )}
      </Space>
      {rows.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          {isEditMode ? (
            <>
              <Empty description="No UOM mappings found">
                <Button type="primary" icon={<PlusOutlined />} onClick={addRow} size="large">
                  Add First Mapping
                </Button>
              </Empty>
            </>
          ) : (
            <Empty description="No UOM mappings found" />
          )}
        </div>
      ) : (
        <>
          <ProTable
            loading={loading}
            search={false}
            dataSource={rows}
            columns={columns}
            pagination={false}
            bordered
            rowKey="key"
            toolBarRender={false}
          />
          {isEditMode && (
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={addRow}
                block
                style={{ maxWidth: '300px', margin: '0 auto' }}
              >
                Add Another Mapping
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClassificationMappingPage;
