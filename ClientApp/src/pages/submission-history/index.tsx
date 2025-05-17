import { PageContainer } from '@ant-design/pro-components';
import React from 'react';
import SubmissionHistoryList from './submissionHistoryList';

const SubmissionHistory: React.FC = () => {
  return (
    <PageContainer title={'Submission History'}>
      <SubmissionHistoryList />
    </PageContainer>
  );
};

export default SubmissionHistory;
