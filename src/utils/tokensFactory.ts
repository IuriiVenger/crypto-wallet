import { deleteCookie, setCookie } from 'cookies-next';

import { auth } from '@/api/auth';
import { API } from '@/api/types';

export function setTokens({ access_token, refresh_token }: API.Auth.Tokens) {
  if (access_token && refresh_token) {
    setCookie('access_token', access_token);
    setCookie('refresh_token', refresh_token);
  }
}
export function deleteTokens() {
  deleteCookie('access_token');
  deleteCookie('refresh_token');
}

export async function refreshTokens(refreshToken: string) {
  const { data } = await auth.refresh.refresh_token(refreshToken);

  return data;
}