import { HttpClientConfig } from 'bungie-api-ts/http';
import TokenStorage, { Token, Tokens } from './storage/TokenStorage';

export const API_KEY = process.env.REACT_APP_BUNGIE_API_KEY || '';
export const CLIENT_ID = process.env.REACT_APP_BUNGIE_CLIENT_ID || '';
export const CLIENT_SECRET = process.env.REACT_APP_BUNGIE_CLIENT_SECRET || '';
export const REDIRECT_URI = process.env.REACT_APP_BUNGIE_REDIRECT_URI || '';

export const BUNGIE_ROOT = 'https://www.bungie.net';
export const BUNGIE_API_ROOT = `${BUNGIE_ROOT}/Platform`;

export async function getActiveToken(): Promise<Tokens> {
  const allTokens = TokenStorage.getInstance().getAllTokens();

  if (!allTokens) {
    TokenStorage.getInstance().clear();
  }

  const accessTokenIsValid = allTokens && !hasTokenExpired(allTokens.accessToken);
  if (accessTokenIsValid) return allTokens;

  const refreshTokenIsValid = allTokens && !hasTokenExpired(allTokens.refreshToken);
  if (!refreshTokenIsValid) {
    console.log('We need to fetch a new token here');
  }

  try {
    if (allTokens?.refreshToken) return await getAccessTokenFromRefreshToken(allTokens.refreshToken);
    throw new Error();
  } catch (e) {
    throw new Error('I dunno');
  }
}

export async function $httpAuthenticated(config: HttpClientConfig): Promise<Response> {
  const token = await getActiveToken();

  if (!token) {
    console.error('We need a new token');
    throw new Error('Some token error');
  }
  const headers = {
    authorization: `Bearer ${token.accessToken.value}`,
    'x-api-key': API_KEY,
  };

  let url = config.url;
  if (config.params) {
    // strip out undefined params keys. bungie-api-ts creates them for optional endpoint parameters
    for (const key in config.params) {
      typeof config.params[key] === 'undefined' && delete config.params[key];
    }
    url = `${url}?${new URLSearchParams(config.params as Record<string, string>).toString()}`;
  }

  return fetch(url, {
    method: config.method,
    body: config.body,
    headers,
  }).then((response) => response.json());
}

export async function $http(config: HttpClientConfig): Promise<Response> {
  return fetch(config.url, {
    method: config.method,
    body: config.body,
  }).then((res) => res.json());
}

export function getAccessTokenFromCode(code: string): Promise<void> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });
  return fetch(`${BUNGIE_API_ROOT}/app/oauth/token/`, { method: 'POST', body })
    .then((res) => res.json())
    .then(handleAccessToken)
    .then((tokens) => TokenStorage.getInstance().setAllTokens(tokens));
}

function handleAccessToken(
  response:
    | {
        access_token: string;
        expires_in: number;
        membership_id: string;
        refresh_token?: string;
        refresh_expires_in: number;
      }
    | undefined,
): Tokens {
  if (response?.access_token) {
    const data = response;
    const inception = Date.now();
    const accessToken: Token = {
      value: data.access_token,
      expires: data.expires_in,
      name: 'access',
      inception,
    };

    const tokens: Tokens = {
      accessToken,
      bungieMembershipId: data.membership_id,
    };

    if (data.refresh_token) {
      tokens.refreshToken = {
        value: data.refresh_token,
        expires: data.refresh_expires_in,
        name: 'refresh',
        inception,
      };
    }

    return tokens;
  } else {
    throw new Error('No tokens');
  }
}

export function getAccessTokenFromRefreshToken(refreshToken: Token): Promise<Tokens> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken.value,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  return Promise.resolve(
    fetch(`${BUNGIE_API_ROOT}/app/oauth/token/`, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
      .then((response) => (response.ok ? response.json() : Promise.reject(response)))
      .then(handleAccessToken)
      .then((token) => {
        TokenStorage.getInstance().setAllTokens(token);
        return token;
      }),
  );
}

function hasTokenExpired(token?: Token): boolean {
  if (!token) return true;

  const expires = token.expires * 1000 + token.inception;
  const now = Date.now();

  return now > expires;
}
