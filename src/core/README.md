# core

Camada base da aplicação: código sem dependência de UI, stores ou services,
consumido por todas as outras camadas. Introduzida pela
[ADR-0018](../../docs/decisions/ADR-0018-camada-core-e-regras-de-camada.md).

Voltar para o guia geral: [../../docs/ARCHITECTURE-GUIDE.md](../../docs/ARCHITECTURE-GUIDE.md)

## Regra de dependência

`core` importa apenas de `types`. Nunca de `app`, `modules` ou `shared` — o
ESLint (`no-restricted-imports`) reprova a violação.

## Subpastas

| Pasta     | Responsabilidade                                                       |
| --------- | ---------------------------------------------------------------------- |
| `config/` | Constantes e leitura centralizada de env vars (`@core/config`)         |
| `auth/`   | Cliente OAuth do SSC (URLs de login/logout) e `state`/nonce (RF-FE-06) |

## Configuração de ambiente (`config/index.ts`)

Todas as variáveis de ambiente são lidas exclusivamente neste arquivo via o
helper `getEnvVar`. Nenhum outro arquivo do projeto deve acessar
`import.meta.env` diretamente (exceção: flags do próprio Vite como
`import.meta.env.DEV`/`BASE_URL` nos providers).

```ts
// core/config/index.ts
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (!value) {
    throw new Error(`[Config Error]: A variável de ambiente ${key} não foi definida.`);
  }
  return value;
};

export const API_BASE_URL = getEnvVar('VITE_API_BACKEND');
export const APP_NAME = getEnvVar('VITE_APP_NAME');
```

### Exemplo — bom código (adicionar nova env var)

```ts
// 1. Adicionar no .env.example (e no .env.test, com valor fictício)
// VITE_ANALYTICS_ID=UA-XXXXXXX

// 2. Adicionar em core/config/index.ts
export const ANALYTICS_ID = getEnvVar('VITE_ANALYTICS_ID');

// 3. Consumir via import
import { ANALYTICS_ID } from '@core/config';
```

Por que é bom: centraliza a leitura, falha rápido se a variável não existir,
e todo o projeto consome a constante tipada — nunca a string de env.

### Exemplo — mau código (acessar env direto no componente)

```ts
// RUIM: import.meta.env espalhado pelo código
const apiUrl = import.meta.env.VITE_API_BACKEND;
const response = await fetch(`${apiUrl}/users`);
```

Por que é ruim: duplica a leitura em cada arquivo, não falha se a variável
estiver undefined e viola a centralização.

## Autenticação (`auth/`)

- `createOAuthSSC(options)` retorna `signIn`/`signOut`, que **apenas montam a
  URL e redirecionam**. Não limpam stores nem chamam o backend.
- `criarState`/`validarState` geram e validam o nonce do `state` (ADR-0017).
- A orquestração (limpar a sessão local, `DELETE /authorization`, redirecionar)
  fica em `@shared/helpers/session` (`startLogin`, `endSession`), exposta aos
  componentes pelo composable `useSession`.

**Regras:**

- Componentes nunca chamam `createOAuthSSC` diretamente — use `useSession()`.
- Configuração do SSC vem de `@core/config` (nunca de env direto).
- O callback do OAuth é a rota `/token` (layout vazio), tratada pelo guard.
