import httpClient from '../httpService';

// Define the API version
const API_VERSION = '/v1';

/** Get classification List */
export async function getClassifications(
  params: {
    pageNumber?: number;
    pageSize?: number;
    userId?: string;
  },
  options?: { [key: string]: any },
) {
  return httpClient.get(`${API_VERSION}/classifications`, {
    params: { ...params },
    ...options,
  });
}

/** Get classification by ID */
export async function getClassificationById(id: string, options?: { [key: string]: any }) {
  return httpClient.get(`${API_VERSION}/classifications/${id}`, { ...options });
}

/** Add a new classification */
export async function addClassification(
  body: { code: string; description: string; userId: string },
  options?: { [key: string]: any },
) {
  return httpClient.post(`${API_VERSION}/classifications`, body, { ...options });
}

/** Update an existing classification */
export async function updateClassification(
  id: string,
  body: { code: string; description: string },
  options?: { [key: string]: any },
) {
  return httpClient.put(`${API_VERSION}/classifications/${id}`, body, { ...options });
}

/** Delete a classification */
export async function removeClassification(id: string, options?: { [key: string]: any }) {
  return httpClient.delete(`${API_VERSION}/classifications/${id}`, { ...options });
}
