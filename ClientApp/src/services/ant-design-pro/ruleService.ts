import httpClient from '../httpService';

/** 获取规则列表 GET /api/rule */
export async function getRules(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return httpClient.get('/rule', {
    params: { ...params },
    ...options,
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(body: any, options?: { [key: string]: any }) {
  return httpClient.put('/rule', body, { ...options });
}

/** 新建规则 POST /api/rule */
export async function addRule(body: any, options?: { [key: string]: any }) {
  return httpClient.post('/rule', body, { ...options });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(id: string, options?: { [key: string]: any }) {
  return httpClient.delete(`/rule/${id}`, { ...options });
}
