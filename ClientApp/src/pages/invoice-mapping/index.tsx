import { getInvoiceTypes, submitInvoice } from '@/services/ant-design-pro/invoiceService';
import type { ActionType } from '@ant-design/pro-components';
import { FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Drawer, List, message, Modal, Select, Space } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { useEffect, useRef, useState } from 'react';
import { InvoiceData } from './utils/invoiceData';
import { buildInvoicePayload } from './utils/buildInvoicePayload';
import { calculateDueDate, calculateTotalInvoiceValue } from './utils/invoiceHelperFunctions';
import { fetchDataBasedOnInvoiceType, fetchUserProfile } from './utils/useInvoiceData';
import { renderProDescriptions } from './utils/proDescriptions';
import { getInvoiceColumns } from './utils/columns';

dayjs.extend(customParseFormat);

interface TableData {
  data: InvoiceData[];
  success: boolean;
  total: number;
}

interface InvoiceType {
  code: string;
  description: string;
}

const InvoiceSubmission: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<InvoiceData | undefined>();
  const [selectedRowsState, setSelectedRows] = useState<InvoiceData[]>([]);
  const [tableData, setTableData] = useState<TableData>({ data: [], success: false, total: 0 });
  const [invoiceType, setInvoiceType] = useState<InvoiceType[]>([]);
  const [selectedInvoiceType, setSelectedInvoiceType] = useState<string>('01');
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState<boolean>(false);

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const email = currentUser?.email ?? '';
  const [profileData, setProfileData] = useState<API.ProfileItem>();

  useEffect(() => {
    if (!profileData && email) {
      fetchUserProfile(email, setProfileData, setLoading);
    }
  }, [email]);

  const handleInvoiceSubmission = async (record: InvoiceData) => {
    const dueDate = calculateDueDate(record.terms, record.invdate);
    const payload = {
      ...record,
      dueDate: dueDate !== null ? dueDate.format('YYYY-MM-DD') : null,
    };
    const request = buildInvoicePayload(selectedInvoiceType, payload, profileData);
    console.log(request);
    Modal.confirm({
      title: 'Confirm Submission',
      onOk: async () => {
        try {
          if (!profileData?.tin) {
            Modal.error({
              title: 'Incomplete Profile',
              content: 'Please configure your profile before submission.',
              onOk: () => {
                window.location.href = '/account';
              },
            });
            return;
          }
          const response = await submitInvoice(request);
          if (response.status) {
            if (response.data.succeeded) {
              message.success('Invoice submitted successfully.');
            } else {
              const errorList = response.data.errors;

              if (Array.isArray(errorList) && errorList.length > 0) {
                Modal.error({
                  title: response.data.message || 'Failed to submit invoice',
                  content: (
                    <List
                      size="small"
                      dataSource={errorList}
                      renderItem={(item) => (
                        <List.Item style={{ paddingLeft: 0 }}>• {item}</List.Item>
                      )}
                    />
                  ),
                });
              } else {
                message.error(response.data.message || 'Failed to submit invoice');
              }
            }
          } else {
            throw new Error('Submission failed');
          }
        } catch {
          message.error('Failed to submit the invoice.');
        }
      },
    });
  };

  const columns = getInvoiceColumns(
    selectedInvoiceType,
    setCurrentRow,
    setShowDetail,
    handleInvoiceSubmission,
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const invoiceTypeOptions = await getInvoiceTypes();
        setInvoiceType(
          invoiceTypeOptions.data.data.filter(
            (type) => !type.description.toLowerCase().includes('refund'),
          ),
        );
        await fetchDataBasedOnInvoiceType({
          type: selectedInvoiceType,
          setLoading,
          setTableData,
        });
      } catch {
        message.error('Failed to load initial data.');
      }
    };
    loadInitialData();
  }, [selectedInvoiceType]);

  return (
    <PageContainer>
      <ProTable<InvoiceData>
        actionRef={actionRef}
        rowKey={(record) => {
          switch (selectedInvoiceType) {
            case '01':
              return record.invuniq;
            case '02':
            case '03':
              return record.crduniq;
            case '11':
              return record.invhseq;
            case '12':
            case '13':
              return record.crnhseq;
            default:
              return `${record.invnumber}_${Math.random()}`;
          }
        }}
        search={{ labelWidth: 'auto' }}
        dataSource={tableData.data}
        pagination={{
          total: tableData.total,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, pageSize) =>
            fetchDataBasedOnInvoiceType({
              type: selectedInvoiceType,
              page,
              pageSize,
              setLoading,
              setTableData,
            }),
        }}
        loading={loading}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        headerTitle={
          <Space>
            <span>Document Mapping Table</span>
            <Select<string>
              value={selectedInvoiceType}
              onChange={(value) => setSelectedInvoiceType(value)}
              style={{ width: 180 }}
              options={invoiceType
                .filter((data) => !data.description.toLowerCase().includes('refund')) // Exclude refund types
                .map((data) => ({
                  value: data.code,
                  label: data.description,
                }))}
            />
          </Space>
        }
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar>
          <div>
            Selected <strong>{selectedRowsState.length}</strong> items &nbsp;&nbsp;
            <span>
              Total Invoice Value:{' '}
              {calculateTotalInvoiceValue(selectedRowsState, selectedInvoiceType)}
            </span>
          </div>
          <Button onClick={() => setSelectedRows([])}>Batch submission</Button>
        </FooterToolbar>
      )}
      <Drawer width={800} open={showDetail} onClose={() => setShowDetail(false)} closable={false}>
        {currentRow && renderProDescriptions(selectedInvoiceType, currentRow)}
      </Drawer>
    </PageContainer>
  );
};

export default InvoiceSubmission;
