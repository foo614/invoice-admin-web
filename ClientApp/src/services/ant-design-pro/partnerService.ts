import httpClient from '../httpService';

/** 获取合作伙伴列表 GET /api/partners */
export async function getPartners(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return httpClient.get('/partners', {
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
  return httpClient.put(`/partners/${id}`, body, { ...options });
}

/** 新增合作伙伴 POST /api/partners */
export async function addPartner(body: API.PartnerListItem, options?: { [key: string]: any }) {
  return httpClient.post('/partners', body, { ...options });
}

/** 删除合作伙伴 DELETE /api/partners/:id */
export async function removePartner(id: string, options?: { [key: string]: any }) {
  return httpClient.delete(`/partners/${id}`, { ...options });
}
