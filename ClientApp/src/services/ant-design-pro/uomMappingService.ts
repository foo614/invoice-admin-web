import httpClient from '../httpService';

// Define the API version
const API_VERSION = '/v1';

/** Get all UOM Mappings */
export async function getUomMappings(
  params?: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return httpClient.get(`${API_VERSION}/uom-mappings`, {
    params: { ...params },
    ...options,
  });
}

/** Get UOM Mapping by ID */
export async function getUomMappingById(id: string, options?: { [key: string]: any }) {
  return httpClient.get(`${API_VERSION}/uom-mappings/${id}`, { ...options });
}

/** Add a new UOM Mapping */
export async function addUomMapping(
  body: { lhdnUomCode: string; uomId: number },
  options?: { [key: string]: any },
) {
  return httpClient.post(`${API_VERSION}/uom-mappings`, body, { ...options });
}

/** Update UOM Mapping */
export async function updateUomMapping(
  id: string,
  body: { lhdnUomCode: string; uomId: number },
  options?: { [key: string]: any },
) {
  return httpClient.put(`${API_VERSION}/uom-mappings/${id}`, body, { ...options });
}

/** Delete a UOM Mapping */
export async function removeUomMapping(id: string, options?: { [key: string]: any }) {
  return httpClient.delete(`${API_VERSION}/uom-mappings/${id}`, { ...options });
}
