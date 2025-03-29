import httpClient from '../httpService';

const API_VERSION = '/v1';

export async function getUserProfile(
  params: {
    email: string;
  },
  options?: { [key: string]: any },
) {
  return httpClient.get(`${API_VERSION}/profile`, {
    params: { ...params },
    ...options,
  });
}

export async function updateUserProfile(
    id: string,
    body: Partial<API.ProfileItem>,
    options?: { [key: string]: any },
  ) {
    return httpClient.put(`${API_VERSION}/profile/${id}`, body, { ...options });
  }
