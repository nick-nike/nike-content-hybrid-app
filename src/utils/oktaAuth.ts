import { OKTA_CONFIG, CODE_VERIFIER_KEY } from '../constants/auth';
import type { OktaResponse } from '../@types/auth';

// 生成随机字符串
const generateRandomString = (length: number): string => {
  const array = new Uint8Array(Math.ceil(length / 2));
  crypto.getRandomValues(array);
  return Array.from(array, dec => `0${dec.toString(16)}`.substr(-2)).join('').slice(0, length);
};

// 生成 code verifier
const generateCodeVerifier = (): string => {
  return encodeURIComponent(generateRandomString(43)).slice(0, 128);
};

// Base64 URL 编码
const base64URLEncode = (input: string): string => {
  return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

// 生成 code challenge
const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const buffer = new TextEncoder().encode(verifier);
  const arrayBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hash = String.fromCharCode.apply(null, new Uint8Array(arrayBuffer) as any);
  return base64URLEncode(hash);
};

// 重定向到 OKTA 登录页面
export const redirectToOktaLogin = async (): Promise<void> => {
  const codeVerifier = generateCodeVerifier();
  localStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);
  
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  const params = new URLSearchParams({
    client_id: OKTA_CONFIG.CLIENT_ID,
    redirect_uri: OKTA_CONFIG.REDIRECT_URI,
    response_type: 'code',
    state: 'auth',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    scope: OKTA_CONFIG.SCOPE
  });
  
  window.location.assign(`${OKTA_CONFIG.AUTH_URL}/v1/authorize?${params.toString()}`);
};

// 通过授权码获取 Token
export const getTokenByCode = async (code: string): Promise<OktaResponse> => {
  const codeVerifier = localStorage.getItem(CODE_VERIFIER_KEY) || '';
  
  const params = new URLSearchParams({
    code,
    code_verifier: codeVerifier,
    grant_type: 'authorization_code',
    redirect_uri: OKTA_CONFIG.REDIRECT_URI,
    client_id: OKTA_CONFIG.CLIENT_ID
  });
  
  try {
    const response = await fetch(`${OKTA_CONFIG.AUTH_URL}/v1/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });
    
    const data = await response.json();
    localStorage.removeItem(CODE_VERIFIER_KEY);
    return data;
  } catch (error) {
    localStorage.removeItem(CODE_VERIFIER_KEY);
    throw error;
  }
};

// 刷新 Token
export const refreshToken = async (refreshToken: string): Promise<OktaResponse> => {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    redirect_uri: OKTA_CONFIG.REDIRECT_URI,
    client_id: OKTA_CONFIG.CLIENT_ID,
    scope: OKTA_CONFIG.SCOPE,
    refresh_token: refreshToken
  });
  
  const response = await fetch(`${OKTA_CONFIG.AUTH_URL}/v1/token`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });
  
  return response.json();
};

// 撤销 Token
export const revokeToken = async (token: string): Promise<void> => {
  const params = new URLSearchParams({
    token,
    client_id: OKTA_CONFIG.CLIENT_ID
  });
  
  await fetch(`${OKTA_CONFIG.AUTH_URL}/v1/revoke`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });
};