import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { ProFormSelect, ProTable } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Empty, message, Space } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import {
  addUomMapping,
  getUomMappings,
  removeUomMapping,
} from '../../../../services/ant-design-pro/uomMappingService';
import { getUoms } from '../../../../services/ant-design-pro/uomService';
import { getUnitTypes } from '@/services/ant-design-pro/invoiceService';

interface RowData {
  key: string;
  lhdnUomCode?: string;
  uomId: number[];
}

const UOMMappingPage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [lhdnUOMList, setLhdnUOMList] = useState<API.LhdnUOM[]>([]);
  const [sellerUOMList, setSellerUOMList] = useState<API.SellerUOM[]>([]);
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [initialUomMappings, setInitialUomMappings] = useState<API.UomMapping[]>([]);

  function transformToRowData(uomMappings: API.UomMapping[]): RowData[] {
    const groupedData = uomMappings.reduce(
      (acc, item) => {
        const groupKey = item.lhdnUomCode || 'Default';
        if (!acc[groupKey]) {
          acc[groupKey] = {
            key: groupKey,
            lhdnUomCode: item.lhdnUomCode,
            uomId: [],
          };
        }
        acc[groupKey].uomId.push(item.uomId);
        return acc;
      },
      {} as Record<string, RowData>,
    );

    return Object.values(groupedData);
  }

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch LHDN UOM List
      const lhdnResponse = await getUnitTypes();
      setLhdnUOMList(lhdnResponse.data.data || []);

      // Fetch Seller UOM List with userId
      const sellerResponse = await getUoms({
        userId: currentUser?.id,
      });
      setSellerUOMList(sellerResponse?.data.data || []);

      // Fetch UOM Mapping
      const uomMapping = await getUomMappings({ userId: currentUser?.id });
      const uomMappingResponse = uomMapping?.data.data;

      setInitialUomMappings(uomMappingResponse || []);
      let rowData = transformToRowData(uomMappingResponse);
      setRows(rowData || []);
    } catch (error) {
      message.error('Failed to fetch UOM data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser?.id]);

  const addRow = () => {
    const newRow: RowData = {
      key: `row-${rows.length + 1}`,
      uomId: [],
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
      prevRows.map((row) => (row.key === rowKey ? { ...row, uomId: values } : row)),
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
    rows.forEach((row) => row.uomId.forEach((uom) => selected.add(uom)));
    return selected;
  }, [rows]);

  const saveMappings = async () => {
    if (rows.some((row) => !row.lhdnUomCode || row.uomId.length === 0)) {
      message.error('Please complete all mappings before saving.');
      return;
    }

    try {
      const savedMapping = rows.flatMap((row) =>
        row.uomId.map((sellerUomId) => ({
          lhdnUomCode: row.lhdnUomCode,
          uomId: sellerUomId,
        })),
      );

      const additions = savedMapping.filter(
        (saved) =>
          !initialUomMappings.some(
            (initial) => initial.lhdnUomCode === saved.lhdnUomCode && initial.uomId === saved.uomId,
          ),
      );

      const deletions = initialUomMappings.filter(
        (initial) =>
          !savedMapping.some(
            (saved) => saved.lhdnUomCode === initial.lhdnUomCode && saved.uomId === initial.uomId,
          ),
      );

      if (additions.length > 0) {
        const additionPromises = additions.map((mapping) => addUomMapping(mapping));
        await Promise.all(additionPromises);
      }

      if (deletions.length > 0) {
        const deletionPromises = deletions.map((mapping) => removeUomMapping(mapping.id));
        await Promise.all(deletionPromises);
      }

      message.success('Mappings saved successfully!');
      setIsEditMode(false);
      fetchData();
    } catch (error) {
      message.error('Failed to save mappings.');
    }
  };

  const columns = [
    {
      title: 'LHDN UOM',
      dataIndex: 'lhdnUomCode',
      key: 'lhdnUomCode',
      render: (_: any, record: RowData) =>
        isEditMode ? (
          <ProFormSelect
            options={
              Array.isArray(lhdnUOMList)
                ? lhdnUOMList
                  .filter(
                    (uom) => !selectedLhdnUOMs.has(uom.code) || uom.code === record.lhdnUomCode,
                  )
                  .map((uom) => ({
                    label: `${uom.code} - ${uom.name}`,
                    value: uom.code,
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
        ) : (
          (() => {
            const uom = lhdnUOMList.find((uom) => uom.code === record.lhdnUomCode);
            return uom ? `${uom.code} - ${uom.name}` : record.lhdnUomCode;
          })()
        ),
    },
    {
      title: 'Mapped Seller UOMs',
      dataIndex: 'uomId',
      key: 'uomId',
      render: (_: any, record: RowData) =>
        isEditMode ? (
          <ProFormSelect
            mode="multiple"
            options={
              Array.isArray(sellerUOMList)
                ? sellerUOMList
                  .filter(
                    (uom) => !selectedSellerUOMs.has(uom.id) || record.uomId.includes(uom.id),
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
              value: record.uomId,
              onChange: (values) => updateSellerUoms(record.key, values),
              style: { width: '100%' },
            }}
          />
        ) : (
          <div>
            {record.uomId.map((uomId: number) => {
              const uom = sellerUOMList.find((uom) => uom.id === uomId);
              return uom ? <div key={uom.id}>{`${uom.code} - ${uom.description}`}</div> : null;
            })}
          </div>
        ),
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
    let rowData = transformToRowData(initialUomMappings);
    setRows(rowData || []);
    setIsEditMode(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <h2>Map Seller UOMs to LHDN UOM List</h2>
        {!isEditMode && (
          <Button
            type="primary"
            onClick={toggleEditMode}
            icon={<EditOutlined />}
            style={{ marginLeft: 'auto' }}
          >
            Edit Mappings
          </Button>
        )}
      </div>

      {rows.length === 0 && !isEditMode ? (
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <Empty description="No UOM mappings found" />
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
            scroll={{ x: 'max-content' }}
          />

          {isEditMode && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 20 }}>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={addRow}
                style={{ marginRight: 'auto' }}
              >
                Add Mapping
              </Button>
              <Button type="primary" icon={<SaveOutlined />} onClick={saveMappings}>
                Save
              </Button>
              <Button icon={<CloseOutlined />} onClick={cancelChanges}>
                Cancel
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UOMMappingPage;
