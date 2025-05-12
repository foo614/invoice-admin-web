import React, { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Descriptions,
  Row,
  Spin,
  Table,
  message,
  Empty,
  Button,
  Tag,
  Alert,
  QRCode,
  Typography,
  Breadcrumb,
} from 'antd';
import { Link, useParams } from '@umijs/max';
import {
  generateInvoice,
  getDocumentDetails,
  getInvoiceDocumentByUuId,
} from '@/services/ant-design-pro/invoiceService';
import { PageContainer } from '@ant-design/pro-components';
import { DownloadOutlined, ScanOutlined } from '@ant-design/icons';
import { formatUtcToLocalDateTimeWithAmPm } from '@/helpers/dateFormatter';

const InvoiceDetail: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [loading, setLoading] = useState(true);
  const [fetchDetailsLoading, setFetchDetailsLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<API.InvoiceDocument | null>(null);
  const [documentDetails, setDocumentDetails] = useState<API.InvoiceDetails | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const generatePdfInvoice = async (uuid: string) => {
    setDownloadLoading(true);

    try {
      const response = await generateInvoice(uuid, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${uuid}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      message.success('Invoice generated successfully.');
    } catch (error) {
      message.error('Failed to generate invoice.');
    } finally {
      setDownloadLoading(false);
    }
  };

  // Fetch document details by UUID
  const fetchDocumentDetails = async (uuid: string) => {
    try {
      setFetchDetailsLoading(true);
      const response = await getDocumentDetails(uuid);

      if (response.data.succeeded) {
        const result = await response.data.data;
        setDocumentDetails(result);
      } else {
        message.error('Failed to fetch document details.');
        return null;
      }
    } catch (error) {
      message.error('Error fetching document details.');
      return null;
    } finally {
      setFetchDetailsLoading(false);
    }
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const response = await getInvoiceDocumentByUuId(uuid!);

        if (response.data.succeeded && response.data.data) {
          setInvoiceData(response.data.data);
          setNotFound(false);
        } else {
          setNotFound(true);
          message.error('Invoice not found');
        }
      } catch (error) {
        setNotFound(true);
        message.error('Failed to load invoice details');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
    if (invoiceData?.documentStatus !== 'Submitted') {
      fetchDocumentDetails(uuid!);
    }
  }, [uuid]);

  if (loading || fetchDetailsLoading) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  if (notFound ?? !invoiceData) {
    return (
      <PageContainer>
        <Empty description="Invoice not found" />
      </PageContainer>
    );
  }

  const { supplier, customer, invoiceLines, taxAmount, totalAmount } = invoiceData;

  const columns = [
    { title: 'Classification Codes', dataIndex: 'classificationCode' },
    { title: 'Description', dataIndex: 'description' },
    { title: 'Quantity', dataIndex: 'quantity' },
    { title: 'Measurement', dataIndex: 'unitCode' },
    { title: `Unit Price (${invoiceData.invoiceLines[0].currencyCode})`, dataIndex: 'unitPrice' },
    { title: `Subtotal (${invoiceData.invoiceLines[0].currencyCode})`, dataIndex: 'lineAmount' },
    { title: `Total Tax (${invoiceData.invoiceLines[0].currencyCode})`, dataIndex: 'taxAmount' },
  ];

  return (
    <PageContainer
      title={
        <>
          <Breadcrumb style={{ fontWeight: 'normal', marginBottom: '16px' }}>
            <Breadcrumb.Item>
              <Link to="/submission-history">Submission History</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{uuid}</Breadcrumb.Item>
          </Breadcrumb>
          <div>Invoice Details</div>
        </>
      }
      extra={[
        invoiceData?.documentStatus === 'Valid' && (
          <Button
            key="submit"
            type="primary"
            loading={downloadLoading}
            onClick={() => generatePdfInvoice(invoiceData.uuid)}
            icon={<DownloadOutlined />}
          >
            Download Invoice
          </Button>
        ),
      ]}
    >
      {documentDetails?.validationResults.status === 'Invalid' && (
        <Alert
          message="Document Validation Failed"
          description="This document contains validation errors that need to be addressed."
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <Card title="Invoice Summary" style={{ marginBottom: 24 }}>
        <Row gutter={[24, 16]}>
          <Col xs={24} md={16}>
            <Descriptions
              column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
              size="small"
              labelStyle={{ fontWeight: 500 }}
            >
              <Descriptions.Item label="Document Type">
                {documentDetails?.typeName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Reference No.">
                {invoiceData.invoiceNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    invoiceData.documentStatus === 'Valid'
                      ? 'green'
                      : invoiceData.documentStatus === 'Submitted'
                        ? 'blue'
                        : invoiceData.documentStatus === 'Invalid'
                          ? 'red'
                          : 'gray'
                  }
                >
                  {invoiceData.documentStatus ?? '-'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Issued Date">
                {formatUtcToLocalDateTimeWithAmPm(invoiceData.issueDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Currency">
                {invoiceData.documentCurrencyCode}
              </Descriptions.Item>
              <Descriptions.Item label="Validation">
                {documentDetails?.dateTimeValidated
                  ? formatUtcToLocalDateTimeWithAmPm(documentDetails.dateTimeValidated)
                  : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Col>

          {!fetchDetailsLoading && (
            <Col xs={24} md={8} style={{ display: 'flex', justifyContent: 'center' }}>
              {invoiceData.documentStatus !== 'Submitted' && documentDetails?.longId ? (
                <div
                  style={{
                    textAlign: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <QRCode
                    value={`${MY_INVOICE_BASE_URL}/${documentDetails.uuid}/share/${documentDetails.longId}`}
                    size={150}
                    iconSize={30}
                  />
                  <Typography.Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                    <ScanOutlined /> Scan to verify
                  </Typography.Text>
                  <Typography.Text copyable style={{ fontSize: 12 }}>
                    ID: {documentDetails.longId}
                  </Typography.Text>
                </div>
              ) : (
                <Alert
                  message="No Verification Code"
                  description="This document cannot be verified electronically"
                  type="warning"
                  showIcon
                />
              )}
            </Col>
          )}
        </Row>
      </Card>
      <Row gutter={[24, 24]}>
        <Col span={24} lg={12}>
          <Card title="Supplier (From)">
            {supplier ? (
              <Descriptions column={2} size="small" layout="vertical">
                <Descriptions.Item label="Name">{supplier.name ?? ''}</Descriptions.Item>
                <Descriptions.Item label="TIN">{supplier.tin ?? ''}</Descriptions.Item>
                <Descriptions.Item label="ID Type">{supplier.idType ?? ''}</Descriptions.Item>
                <Descriptions.Item label="ID Number">{supplier.brn ?? ''}</Descriptions.Item>
                <Descriptions.Item label="SST Registration">
                  {supplier.sstRegistrationNumber ?? ''}
                </Descriptions.Item>
                <Descriptions.Item label="Tourism Tax Registration Number">
                  {supplier.taxTourismRegistrationNumber ?? ''}
                </Descriptions.Item>
                <Descriptions.Item label="MSIC Code">{supplier.msicCode ?? ''}</Descriptions.Item>
                <Descriptions.Item label="Business Activity">
                  {supplier.businessActivityDescription ?? ''}
                </Descriptions.Item>
                <Descriptions.Item span={2} label="Address">
                  {supplier.address ?? ''}
                </Descriptions.Item>
                <Descriptions.Item label="Email">{supplier.email ?? ''}</Descriptions.Item>
                <Descriptions.Item label="Contact">
                  {supplier.contactNumber ?? ''}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty description="No supplier information" />
            )}
          </Card>
        </Col>

        <Col span={24} lg={12}>
          <Card title="Buyer (To)">
            {customer ? (
              <Descriptions column={2} size="small" layout="vertical">
                <Descriptions.Item label="Name">{customer.name ?? ''}</Descriptions.Item>
                <Descriptions.Item label="TIN">{customer.tin ?? ''}</Descriptions.Item>
                <Descriptions.Item label="ID Type">{customer.idType ?? ''}</Descriptions.Item>
                <Descriptions.Item label="Registration / Identification / Passport">
                  {customer.brn ?? ''}
                </Descriptions.Item>
                <Descriptions.Item label="SST Registration">
                  {customer.sstRegistrationNumber ?? ''}
                </Descriptions.Item>
                <Descriptions.Item label="Address">{customer.address ?? ''}</Descriptions.Item>
                <Descriptions.Item label="Email">{customer.email ?? ''}</Descriptions.Item>
                <Descriptions.Item label="Contact">
                  {customer.contactNumber ?? ''}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty description="No customer information" />
            )}
          </Card>
        </Col>
      </Row>

      <Card title="Line Items" style={{ marginTop: 24 }}>
        {invoiceLines && invoiceLines.length > 0 ? (
          <>
            <Table
              columns={columns}
              dataSource={invoiceLines}
              pagination={false}
              bordered
              rowKey="id"
              style={{ marginBottom: 24 }}
            />
            <Row justify="end">
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <div>
                  {[
                    ['Total Tax Amount', taxAmount],
                    ['Total Net Amount', totalAmount],
                    ['Total Excluding Tax', invoiceData.totalExcludingTax],
                    ['Total Including Tax', invoiceData.totalIncludingTax],
                  ].map(([label, value]) => (
                    <Row key={label} gutter={16} style={{ marginBottom: 8 }}>
                      <Col
                        span={14}
                        style={{
                          textAlign: 'left',
                          fontWeight: 'bold',
                          paddingRight: 8,
                        }}
                      >
                        {`${label} (${invoiceData.documentCurrencyCode}):`}
                      </Col>
                      <Col
                        span={10}
                        style={{
                          textAlign: 'right',
                          fontWeight: 500,
                          fontFamily: 'monospace',
                        }}
                      >
                        {value?.toLocaleString(undefined, { minimumFractionDigits: 2 }) ?? '-'}
                      </Col>
                    </Row>
                  ))}
                </div>
              </Col>
            </Row>
          </>
        ) : (
          <Empty description="No line items found" />
        )}
      </Card>
      <Card
        title="Validation Details"
        style={{ marginTop: 24 }}
        headStyle={{
          backgroundColor:
            documentDetails?.validationResults?.status === 'Invalid' ? '#fff1f0' : undefined,
          borderBottomColor:
            documentDetails?.validationResults?.status === 'Invalid' ? '#ffccc7' : undefined,
        }}
      >
        {documentDetails?.validationResults ? (
          <>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Overall Status">
                <Tag color={documentDetails.validationResults.status === 'Valid' ? 'green' : 'red'}>
                  {documentDetails.validationResults.status.toUpperCase()}
                </Tag>
                {documentDetails.validationResults.status === 'Invalid' && (
                  <span style={{ color: '#ff4d4f', marginLeft: 8 }}>
                    {
                      documentDetails.validationResults.validationSteps.filter(
                        (step) => step.status === 'Invalid',
                      ).length
                    }{' '}
                    validation errors
                  </span>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Document Type">
                {documentDetails.typeName} ({documentDetails.typeVersionName})
              </Descriptions.Item>
              <Descriptions.Item label="Received">
                {formatUtcToLocalDateTimeWithAmPm(documentDetails.dateTimeReceived)}
              </Descriptions.Item>
              <Descriptions.Item label="Validated">
                {formatUtcToLocalDateTimeWithAmPm(documentDetails.dateTimeValidated)}
              </Descriptions.Item>
            </Descriptions>

            <Table
              columns={[
                {
                  title: 'Validation Step',
                  dataIndex: 'name',
                  key: 'name',
                  render: (name, record) => (
                    <div style={{ fontWeight: record.status === 'Invalid' ? 600 : 'normal' }}>
                      {name}
                    </div>
                  ),
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => (
                    <Tag color={status === 'Valid' ? 'green' : 'red'}>{status.toUpperCase()}</Tag>
                  ),
                },
                {
                  title: 'Error Details',
                  key: 'error',
                  width: '40%',
                  render: (_, record) =>
                    record.error ? (
                      <div style={{ color: '#ff4d4f' }}>
                        {Object.entries(record.error)
                          .filter(([key, value]) => value !== null && key !== 'details')
                          .map(([key, value]) => (
                            <div key={key} style={{ marginTop: key === 'error' ? 0 : 4 }}>
                              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                            </div>
                          ))}
                        {record.error.details && (
                          <div style={{ marginTop: 4 }}>
                            <strong>Details:</strong>
                            <pre
                              style={{
                                margin: '4px 0 0',
                                padding: '8px',
                                background: '#f5f5f5',
                                borderRadius: '4px',
                                overflowX: 'auto',
                              }}
                            >
                              {JSON.stringify(record.error.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ) : (
                      '-'
                    ),
                },
              ]}
              dataSource={documentDetails.validationResults.validationSteps}
              pagination={false}
              size="small"
              rowKey="name"
              rowClassName={(record) => (record.status === 'Invalid' ? 'validation-error-row' : '')}
              style={{
                marginTop: 16,
              }}
            />
          </>
        ) : (
          <Empty description="No validation details available" />
        )}
      </Card>
    </PageContainer>
  );
};

export default InvoiceDetail;
