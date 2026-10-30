export type UserRoleCodigo = 'ARCH_PRODEMGE';

export interface UserDataUnidadeResponse {
  id?: number;
  nome: string;
  codigo: string;
  cnpj?: string;
  sigla?: string;
}

export interface UserDataResponse {
  nomeUsuario: string;
  email: string[];
  login: string;
  unidade: UserDataUnidadeResponse;
  roles: UserRoleCodigo[];
  recursos?: string[];
  temMultiplasUnidades: boolean;
  outrasUnidades?: UserDataUnidadeResponse[];
  autenticadoGovBR?: boolean;
  contexto?: string;
  matricula?: string | number;
  nivelGovBR?: string;
  nomeSocial?: string;
  recursosLiberados?: string[];
  routes?: string[];
}
