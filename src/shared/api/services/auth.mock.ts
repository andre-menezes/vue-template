/**
 * Dados mockados de autenticação para uso enquanto o projeto ainda não possui
 * um módulo configurado no SegID.
 *
 * Ativado por `VITE_AUTH_MOCK=true` (padrão no template). Ao configurar o
 * SegID real, defina `VITE_AUTH_MOCK=false` — nada mais no código precisa mudar.
 */
import type { UserDataResponse as ApiUserDataResponse } from '@typings/user';

/** Usuário fake retornado no lugar de `GET /auth-backend/token/user`. */
export const mockUserData: ApiUserDataResponse = {
  nomeUsuario: 'John Doe',
  email: ['john.doe@prodemge.gov.br'],
  login: '00000000000',
  unidade: {
    id: 1,
    nome: 'SECRETARIA DE EDUCAÇÃO',
    codigo: 'SE1',
    cnpj: '',
    sigla: '',
  },
  outrasUnidades: [
    {
      id: 2,
      nome: 'INSTITUTO DE EDUCAÇÃO DE MINAS GERAIS',
      codigo: '001996',
      cnpj: '',
      sigla: 'SEE-ESCOLA',
    },
  ],
  roles: ['ARCH_PRODEMGE'],
  recursos: [],
  temMultiplasUnidades: true,
  autenticadoGovBR: true,
  contexto: 's1f6',
  matricula: '000000',
  nivelGovBR: 'PRATA',
  nomeSocial: '',
  recursosLiberados: [],
  routes: [],
};
