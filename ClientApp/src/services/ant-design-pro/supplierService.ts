import httpClient from '../httpService';

// Define the API version
const API_VERSION = '/v1';

/** Get Supplier List */
export async function getSuppliers(
    options?: { [key: string]: any },
) {
    return httpClient.get(`${API_VERSION}/suppliers`, {
        ...options,
    });
}