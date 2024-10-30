import InvoiceSubmission from '@/pages/invoice-submission';
import { GridContent } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Col, Row } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import type dayjs from 'dayjs';
import type { FC } from 'react';
import { Suspense, useState } from 'react';
import ProportionSales from './components/ProportionSales';
import type { TimeType } from './components/SalesCard';
import type { AnalysisData } from './data.d';
import { fakeChartData } from './service';
import useStyles from './style.style';
import { getTimeDistance } from './utils/utils';
type RangePickerValue = RangePickerProps<dayjs.Dayjs>['value'];
type AnalysisProps = {
  dashboardAndanalysis: AnalysisData;
  loading: boolean;
};

const Analysis: FC<AnalysisProps> = () => {
  const { styles } = useStyles();
  const [rangePickerValue, setRangePickerValue] = useState<RangePickerValue>(
    getTimeDistance('year'),
  );
  const [rangePickerValueSAGE, setRangePickerValueSAGE] = useState<RangePickerValue>();
  const [rangePickerValueLHDN, setRangePickerValueLHDN] = useState<RangePickerValue>();
  const { loading, data } = useRequest(fakeChartData);
  const selectDate = (type: TimeType) => {
    setRangePickerValue(getTimeDistance(type));
  };
  const handleRangePickerChange = (value: RangePickerValue) => {
    setRangePickerValue(value);
  };
  const handleRangePickerLHDNChange = (value: RangePickerValue) => {
    setRangePickerValueLHDN(value);
  };
  const handleRangePickerSAGEChange = (value: RangePickerValue) => {
    setRangePickerValueSAGE(value);
  };

  const isActive = (type: TimeType) => {
    if (!rangePickerValue) {
      return '';
    }
    const value = getTimeDistance(type);
    if (!value) {
      return '';
    }
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0] as dayjs.Dayjs, 'day') &&
      rangePickerValue[1].isSame(value[1] as dayjs.Dayjs, 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  return (
    data && (
      <GridContent>
        <>
          <Row
            gutter={24}
            style={{
              marginBottom: 24,
            }}
          >
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <ProportionSales
                  rangePickerValue={rangePickerValueSAGE}
                  loading={loading}
                  salesPieData={data.invoiceSubmissionRateData || []}
                  handleRangePickerChange={handleRangePickerLHDNChange}
                  title={'SAGE Submission Rate'}
                />
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <ProportionSales
                  rangePickerValue={rangePickerValueLHDN}
                  loading={loading}
                  salesPieData={data.lhdnSubmissionStatusData || []}
                  handleRangePickerChange={handleRangePickerSAGEChange}
                  title={'LHDN Submission Rate'}
                />
              </Suspense>
            </Col>
          </Row>
          <Suspense fallback={null}>
            <InvoiceSubmission />
          </Suspense>
        </>
      </GridContent>
    )
  );
};
export default Analysis;
