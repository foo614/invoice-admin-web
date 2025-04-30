import httpClient from '../httpService';

const API_VERSION = '/v1';

export async function getSageSubmissionRate(
  params: {
    startDate?: string;
    endDate?: string;
  },
  options?: { [key: string]: any },
) {
  return httpClient.get(`${API_VERSION}/dashboard/sage/submission-rate`, {
    params: { ...params },
    ...options,
  });
}
