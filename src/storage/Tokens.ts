import Storage from './Storage';

enum Locals {
  ALL_TOKENS = 'all_tokens',
}

export interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
  membership_id: string;
}

export interface Tokens {
  accessToken: Token;
  refreshToken?: Token;
  bungieMembershipId: string;
}

export interface Token {
  /** The oauth token key */
  value: string;
  /** The token expires this many seconds after it is acquired. */
  expires: number;
  name: 'access' | 'refresh';
  /** A UTC epoch milliseconds timestamp representing when the token was acquired. */
  inception: number;
}

export default class TokenStorage extends Storage<Locals> {
  private static instance?: TokenStorage;

  private constructor() {
    super();
  }

  public static getInstance(): TokenStorage {
    if (!this.instance) {
      this.instance = new TokenStorage();
    }

    return this.instance;
  }
  public setAllTokens(token: Tokens) {
    this.set(Locals.ALL_TOKENS, JSON.stringify(token));
  }

  public getAllTokens(): Tokens | null {
    const allTokens = this.get(Locals.ALL_TOKENS);

    return allTokens ? JSON.parse(allTokens) : null;
  }

  public clear() {
    this.clearItems([Locals.ALL_TOKENS]);
  }
}
