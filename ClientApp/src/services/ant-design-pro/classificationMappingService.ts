import httpClient from '../httpService';

// Define the API version
const API_VERSION = '/v1';

/** Get all Classification Mappings */
export async function getClassificationMappings(
  params?: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return httpClient.get(`${API_VERSION}/classification-mappings`, {
    params: { ...params },
    ...options,
  });
}

/** Get Classification Mapping by ID */
export async function getClassificationMappingById(id: string, options?: { [key: string]: any }) {
  return httpClient.get(`${API_VERSION}/classification-mappings/${id}`, { ...options });
}

/** Add a new Classification Mapping */
export async function addClassificationMapping(
  body: { lhdnClassificationCode: string; classificationId: number },
  options?: { [key: string]: any },
) {
  return httpClient.post(`${API_VERSION}/classification-mappings`, body, { ...options });
}

/** Update Classification Mapping */
export async function updateClassificationMapping(
  id: string,
  body: { lhdnClassificationCode: string; classificationId: number },
  options?: { [key: string]: any },
) {
  return httpClient.put(`${API_VERSION}/classification-mappings/${id}`, body, { ...options });
}

/** Delete a Classification Mapping */
export async function removeClassificationMapping(id: string, options?: { [key: string]: any }) {
  return httpClient.delete(`${API_VERSION}/classification-mappings/${id}`, { ...options });
}
