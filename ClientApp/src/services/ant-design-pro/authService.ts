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