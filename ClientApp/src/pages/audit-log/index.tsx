import {
  formatUtcToLocalDateTime24H,
  formatUtcToLocalDateTimeWithAmPm,
} from '@/helpers/dateFormatter';
import { getAuditTrails } from '@/services/ant-design-pro/auditService';
import {
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Drawer, message } from 'antd';
import React, { useState } from 'react';
import { useRef } from 'react';
import ExpandableJsonCell from './components/ExpandableJsonCell';
import dayjs from 'dayjs';

const AuditLogList = () => {
  const actionRef = useRef();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<API.AuditTrails[]>([]);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [currentLog, setCurrentLog] = useState<API.AuditTrails | null>(null);

  const fetchData = async (params: any) => {
    try {
      setLoading(true);
      const { pageSize, current, startDate, endDate } = params;
      const response = await getAuditTrails({
        pageNumber: current,
        pageSize,
        startDate,
        endDate,
      });

      setData(response?.data.data ?? []);

      return {
        data: response?.data.data || [],
        success: response?.data.succeeded || false,
        total: response?.data.totalCount || 0,
      };
    } catch {
      message.error('Failed to fetch audit logs.');
      return { data: [], success: false, total: 0 };
    } finally {
      setLoading(false);
    }
  };

  const columns: ProColumns<API.AuditTrails> = [
    {
      title: 'Timestamp',
      dataIndex: 'dateTime',
      key: 'dateTime',
      valueType: 'dateTimeRange',
      width: 170,
      formItemProps: {
        rules: [
          {
            validator: (_, value) => {
              if (!value || value.length !== 2) {
                return Promise.reject('Please select both start and end dates');
              }
              return Promise.resolve();
            },
          },
        ],
      },
      transform: (value: any) => {
        if (value && value.length === 2) {
          return {
            startDate: dayjs(value[0]).toISOString(),
            endDate: dayjs(value[1]).toISOString(),
          };
        }
        return {};
      },
      render: (dom: any, entity: API.AuditTrails) => (
        <a
          onClick={() => {
            setCurrentLog(entity);
            setDrawerVisible(true);
          }}
        >
          {entity.dateTime ? formatUtcToLocalDateTime24H(entity.dateTime) : ''}
        </a>
      ),
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      hideInTable: true,
      hideInSearch: true,
      width: 200,
    },
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      hideInSearch: true,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      key: 'operation',
      hideInSearch: true,
    },
    {
      title: 'Entity',
      dataIndex: 'entity',
      key: 'entity',
      hideInSearch: true,
    },
    {
      title: 'Previous Values',
      dataIndex: 'previousValues',
      key: 'previousValues',
      hideInSearch: true,
      width: 200,
      render: (dom: any, entity: { previousValues: string }) => (
        <ExpandableJsonCell text={entity.previousValues} />
      ),
    },
    {
      title: 'New Values',
      dataIndex: 'newValues',
      key: 'newValues',
      hideInSearch: true,
      width: 200,
      render: (dom: any, entity: { newValues: string }) => (
        <ExpandableJsonCell text={entity.newValues} />
      ),
    },
    {
      title: 'Modified Properties',
      dataIndex: 'modifiedProperties',
      key: 'modifiedProperties',
      hideInSearch: true,
      width: 200,
      render: (dom: any, entity: { modifiedProperties: string }) => (
        <ExpandableJsonCell text={entity.modifiedProperties} />
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.AuditTrails>
        headerTitle="Audit Logs"
        actionRef={actionRef}
        rowKey="key"
        columns={columns}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        loading={loading}
        request={async (params, sorter, filter) => {
          return fetchData(params);
        }}
        scroll={{ x: 'max-content' }}
      />

      <Drawer
        width={800}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        title={'Audit Log Details'}
      >
        {currentLog && (
          <ProDescriptions<API.AuditTrails>
            column={2}
            layout="vertical"
            title={`Audit Logs - ${currentLog?.dateTime !== null ? formatUtcToLocalDateTimeWithAmPm(currentLog?.dateTime) : '-'}`}
            dataSource={currentLog}
            columns={columns as ProDescriptionsItemProps<API.AuditTrails>}
            labelStyle={{ fontWeight: 600, color: 'black' }}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default AuditLogList;
