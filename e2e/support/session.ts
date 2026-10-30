import type { Page } from '@playwright/test';
import type { UserDataResponse } from '@typings/user';

/** Usuário mockado padrão retornado pelo endpoint de dados do usuário. */
const defaultUser: UserDataResponse = {
  nomeUsuario: 'John Doe',
  email: ['john.doe@example.com'],
  login: '12345678910',
  unidade: {
    id: 1,
    nome: 'PRODEMGE',
    codigo: '5050',
  },
  roles: ['ARCH_PRODEMGE'],
  recursos: [''],
  temMultiplasUnidades: false,
  outrasUnidades: [
    {
      id: 2,
      nome: 'SECRETARIA DE EDUCAÇÃO',
      codigo: 'SE1',
    },
    {
      id: 3,
      nome: 'EE CELSO MACHADO',
      codigo: '001074',
    },
  ],
  autenticadoGovBR: true,
  contexto: 's1f6',
  matricula: '123456',
  nivelGovBR: 'PRATA',
  nomeSocial: '',
  recursosLiberados: [''],
  routes: [''],
};

/**
 * Mocka uma sessão autenticada para testar rotas protegidas (`meta.requiresAuth`).
 *
 * A sessão usa um cookie `HttpOnly` emitido pelo backend, inacessível ao JS. O
 * guard do router valida a sessão pelo endpoint de dados do usuário
 * (`GET /auth-backend/authorization/user`): resposta 200 = sessão válida. Esta
 * função intercepta esse endpoint retornando o mock.
 *
 * Observação: o `webServer` do Playwright sobe o Vite com `VITE_AUTH_MOCK=true`,
 * então o guard usa o usuário mockado sem chamar o backend, e o intercepto é
 * apenas defensivo.
 *
 * Deve ser chamada **antes** do `page.goto()` da rota protegida.
 *
 * @param overrides Campos do usuário a sobrescrever no mock padrão.
 */
export async function mockUserSession(
  page: Page,
  overrides: Partial<UserDataResponse> = {}
): Promise<void> {
  const user: UserDataResponse = { ...defaultUser, ...overrides };

  await page.route('**/auth-backend/authorization/user', (route) =>
    route.fulfill({ status: 200, json: user })
  );
}
