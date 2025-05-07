import React, { useEffect, useState } from 'react';
import { Card, Col, Descriptions, Row, Spin, Table, message, Empty, Button } from 'antd';
import { useParams } from '@umijs/max'; // or 'react-router-dom' if not using Umi
import {
  generateInvoice,
  getInvoiceDocumentByUuId,
} from '@/services/ant-design-pro/invoiceService';
import { PageContainer } from '@ant-design/pro-components';
import { DownloadOutlined } from '@ant-design/icons';

const InvoiceDetail: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState<API.InvoiceDocument | null>(null);
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
  }, [uuid]);

  if (loading) {
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
      title="Invoice Details"
      breadcrumb={{
        routes: [
          { href: '/submission-history', breadcrumbName: 'Submission History' },
          { breadcrumbName: uuid },
        ],
      }}
      extra={[
        <Button
          key="submit"
          type="primary"
          loading={downloadLoading}
          onClick={() => generatePdfInvoice(invoiceData.uuid)}
          icon={<DownloadOutlined />}
        >
          Download Invoice
        </Button>,
      ]}
    >
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
    </PageContainer>
  );
};

export default InvoiceDetail;
