import { GridContent } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Col, message, Modal, Row } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { Suspense, useEffect, useState } from 'react';
import ProportionSales from './components/ProportionSales';
import type { AnalysisData } from './data.d';
import React from 'react';
import {
  getLhdnSubmissionRate,
  getSageSubmissionRate,
} from '@/services/ant-design-pro/dashboardService';
import SubmissionHistoryList from '@/pages/submission-history/submissionHistoryList';
type RangePickerValue = RangePickerProps<dayjs.Dayjs>['value'];
type AnalysisProps = {
  dashboardAndanalysis: AnalysisData;
  loading: boolean;
};

const Analysis: FC<AnalysisProps> = () => {
  const [rangePickerValueSAGE, setRangePickerValueSAGE] = useState<RangePickerProps['value']>([
    dayjs().subtract(6, 'day'), // default latest 7 days
    dayjs(),
  ]);
  const [rangePickerValueLHDN, setRangePickerValueLHDN] = useState<RangePickerProps['value']>([
    dayjs().subtract(6, 'day'), // default latest 7 days
    dayjs(),
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingLhdn, setLoadingLhdn] = useState<boolean>(false);
  const [sageSubmissionRate, setSageSubmissionRate] = useState<API.SubmissionRateItem[]>([]);
  const [lhdnSubmissionRate, setLhdnSubmissionRate] = useState<API.SubmissionRateItem[]>([]);

  const handleRangePickerLHDNChange = (value: RangePickerValue) => {
    setRangePickerValueLHDN(value);
  };
  const handleRangePickerSAGEChange = (value: RangePickerValue) => {
    setRangePickerValueSAGE(value);
  };

  const fetchSageSubmissionRate = async () => {
    try {
      setLoading(true);

      const response = await getSageSubmissionRate({
        startDate: rangePickerValueSAGE[0].format('YYYY-MM-DD'),
        endDate: rangePickerValueSAGE[1].format('YYYY-MM-DD'),
      });

      setSageSubmissionRate(response?.data.data || []);
    } catch (error) {
      message.error('Failed to fetch sage submission rate.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSageSubmissionRate();
  }, [rangePickerValueSAGE]);

  const fetchLhdnSubmissionRate = async () => {
    try {
      setLoadingLhdn(true);

      const response = await getLhdnSubmissionRate({
        startDate: rangePickerValueSAGE[0].format('YYYY-MM-DD'),
        endDate: rangePickerValueSAGE[1].format('YYYY-MM-DD'),
      });

      setLhdnSubmissionRate(response?.data.data || []);
    } catch (error) {
      message.error('Failed to fetch lhdn submission rate.');
    } finally {
      setLoadingLhdn(false);
    }
  };

  useEffect(() => {
    fetchLhdnSubmissionRate();
  }, [rangePickerValueLHDN]);

  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  useEffect(() => {
    if (initialState && !initialState?.isProfileComplete && !currentUser?.roles.includes('Admin')) {
      if (initialState.checkProfileCompleteFromLocalStorage!()) return;
      Modal.info({
        title: 'Welcome!',
        content: (
          <div>
            <p>Welcome to Nex Koala! 🎉</p>
            <p>Before you get started, please take a moment to complete your profile.</p>
          </div>
        ),
        okText: 'Go to Profile',
        onOk: () => {
          window.location.href = '/account';
        },
      });
    }
  }, [initialState, currentUser]);

  return (
    <GridContent>
      <>
        <Row
          gutter={[24, 24]}
          style={{
            marginBottom: 24,
          }}
        >
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <ProportionSales
                rangePickerValue={rangePickerValueSAGE}
                loading={loading}
                salesPieData={sageSubmissionRate || []}
                handleRangePickerChange={handleRangePickerSAGEChange}
                title={'SAGE Submission Rate'}
              />
            </Suspense>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <ProportionSales
                rangePickerValue={rangePickerValueLHDN}
                loading={loadingLhdn}
                salesPieData={lhdnSubmissionRate || []}
                handleRangePickerChange={handleRangePickerLHDNChange}
                title={'LHDN Submission Rate'}
              />
            </Suspense>
          </Col>
        </Row>
        <Suspense fallback={null}>
          <SubmissionHistoryList />
        </Suspense>
      </>
    </GridContent>
  );
};
export default Analysis;
