import { getAuditLogs } from '@/services/ant-design-pro/auditService';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import React from 'react';
import { useRef } from 'react';

const AuditLogList = () => {
  const actionRef = useRef();

  const columns = [
    {
      title: 'Action Type',
      dataIndex: 'actionType',
      key: 'actionType',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      valueType: 'dateTime',
    },
  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle="Audit Logs"
        actionRef={actionRef}
        rowKey="key"
        columns={columns}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        request={async (params, sorter, filter) => {
          // Extract the current page and page size
          const { current = 1, pageSize = 10 } = params;

          // Make the request to the API
          const response = await getAuditLogs({ current, pageSize });

          return {
            data: response.data,
            success: response.success,
            total: response.total,
            current: response.current,
            pageSize: response.pageSize,
          };
        }}
      />
    </PageContainer>
  );
};

export default AuditLogList;
