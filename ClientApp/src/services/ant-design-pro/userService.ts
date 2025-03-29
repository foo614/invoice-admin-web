import httpClient from '../httpService';

/** 获取通知 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return httpClient.get('/notices', { ...options });
}
