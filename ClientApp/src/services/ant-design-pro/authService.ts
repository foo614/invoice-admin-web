import httpClient from '../httpService';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return httpClient.get('/api/currentUser', { ...options });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return httpClient.post('/login/outLogin', { ...options });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return httpClient.post('/api/Account/authenticate', body, { ...options });
}

export async function resetPassword(data: { password: string; code: string }) {
  return httpClient.post('/api/account/reset-password', {
    method: 'POST',
    data,
  });
}

export async function forgotPassword(body: { email: string }, options?: { [key: string]: any }) {
  return httpClient.post('/api/account/forgot-password', body, { ...options });
}
