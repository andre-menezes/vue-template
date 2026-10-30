export interface TokenRequestParams {
  code: string;
  state?: string;
}

export interface OAuthSSCOptions {
  url: string;
  contexto: string;
  client_id: string;
  response_type: string;
  scope: string;
}

export interface OAuthSSCSignInOptions {
  route: string;
  unidade?: string;
}

/** Cliente OAuth do SSC (`@core/auth`): apenas redirecionamentos. */
export interface OAuthSSC {
  signIn(options: OAuthSSCSignInOptions): void;
  signOut(options: OAuthSSCSignInOptions): void;
}

/**
 * Motivo de falha exibido em `/erro-autenticacao?reason=<motivo>`.
 * A tela traduz o código via i18n; texto livre na URL não é aceito.
 */
export type AuthErrorReason = 'state_mismatch' | 'token_exchange_failed';
