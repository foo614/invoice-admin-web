import httpClient from '../httpService';

/** 获取审计日志 GET /api/audit-logs */
export async function getAuditLogs(options?: { [key: string]: any }) {
  return httpClient.get('/audit-logs', { ...options });
}
