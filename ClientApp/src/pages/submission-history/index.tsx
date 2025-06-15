import { PageContainer } from '@ant-design/pro-components';
import React from 'react';
import SubmissionHistoryList from './submissionHistoryList';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

const SubmissionHistory: React.FC = () => {
  return (
    <PageContainer title={
      <span>
        Submission History{' '}
        <Tooltip title="LHDN data retention 30 days">
          <QuestionCircleOutlined style={{ color: '#999', marginLeft: 8 }} />
        </Tooltip>
      </span>
    }>
      <SubmissionHistoryList />
    </PageContainer>
  );
};

export default SubmissionHistory;
