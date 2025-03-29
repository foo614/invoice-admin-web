import httpClient from '../httpService';

const API_VERSION = '/v1';

/** 获取合作伙伴列表 GET /api/partners */
export async function getPartners(
  params: {
    pageNumber?: number;
    pageSize?: number;
    name?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    licenseKey?: string;
    status?: boolean;
  },
  options?: { [key: string]: any },
) {
  return httpClient.get(`${API_VERSION}/partners`, {
    params: { ...params },
    ...options,
  });
}

/** 更新合作伙伴信息 PUT /api/partners/:id */
export async function updatePartner(
  id: string,
  body: Partial<API.PartnerListItem>,
  options?: { [key: string]: any },
) {
  return httpClient.put(`${API_VERSION}/partners/${id}`, body, { ...options });
}

/** 新增合作伙伴 POST /api/partners */
export async function addPartner(body: API.PartnerListItem, options?: { [key: string]: any }) {
  return httpClient.post(`${API_VERSION}/partners`, body, { ...options });
}

/** 删除合作伙伴 DELETE /api/partners/:id */
export async function removePartner(id: string, options?: { [key: string]: any }) {
  return httpClient.delete(`${API_VERSION}/partners/${id}`, { ...options });
}
