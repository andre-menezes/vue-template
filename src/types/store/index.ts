import type { UserDataUnidadeResponse, UserRoleCodigo } from '@typings/user';
import type { ThemeName } from '@typings/theme';

export interface AppState {
  loading: boolean;
  theme: ThemeName;
}

export interface UserDataResponse {
  nome: string;
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

export interface UserState {
  userData: UserDataResponse | null;
  isAuthorized: boolean;
}
