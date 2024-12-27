import httpClient from '../httpService';

// Define the API version
const API_VERSION = '/v1';

/** Get UOM List */
export async function getUoms(
  params: {
    current?: number;
    pageSize?: number;
    userId?: string;
  },
  options?: { [key: string]: any },
) {
  return httpClient.get(`${API_VERSION}/uoms`, {
    params: { ...params },
    ...options,
  });
}

/** Get UOM by ID */
export async function getUomById(id: string, options?: { [key: string]: any }) {
  return httpClient.get(`${API_VERSION}/uoms/${id}`, { ...options });
}

/** Add a new UOM */
export async function addUom(
  body: { code: string; description: string },
  options?: { [key: string]: any },
) {
  return httpClient.post(`${API_VERSION}/uoms`, body, { ...options });
}

/** Update an existing UOM */
export async function updateUom(
  id: string,
  body: { code: string; description: string },
  options?: { [key: string]: any },
) {
  return httpClient.put(`${API_VERSION}/uoms/${id}`, body, { ...options });
}

/** Delete a UOM */
export async function removeUom(id: string, options?: { [key: string]: any }) {
  return httpClient.delete(`${API_VERSION}/uoms/${id}`, { ...options });
}
