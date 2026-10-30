# app

Camada de bootstrap e composição global da aplicação.

Voltar para o guia geral: [../../docs/ARCHITECTURE-GUIDE.md](../../docs/ARCHITECTURE-GUIDE.md)

## Responsabilidades

- Inicializar a aplicação (`main.ts`).
- Registrar plugins globais (`providers/`).
- Guard de autenticação do Router (`providers/router.ts`) e registro do
  handler global de 401 (`providers/plugins.ts`).
- Definir rotas base da aplicação (`routes.ts`).
- Selecionar layout dinamicamente (`App.vue`).

## Subpastas

| Pasta        | Responsabilidade                                   |
| ------------ | -------------------------------------------------- |
| `locales/`   | Mensagens de internacionalização (pt-BR)           |
| `providers/` | Registro de plugins (Pinia, i18n, Router, Vuetify) |
| `styles/`    | SCSS global                                        |
| `views/`     | Views de uso global (token callback, erro, 404)    |

Configuração de ambiente e o cliente OAuth ficam na camada `core`
([../core/README.md](../core/README.md)), que não depende de `app`.

## Registro de plugins (`providers/plugins.ts`)

Os plugins são registrados em ordem específica (Pinia primeiro para que i18n
e Router possam usar stores no setup):

```ts
import type { App } from 'vue';
import pinia from './pinia';
import i18n from './i18n';
import vuetify from './vuetify';
import router from './router';

export function registerPlugins(app: App) {
  app.use(pinia);
  // 401 em chamadas de dados inicia o login (inversão de dependência — ADR-0018).
  setUnauthorizedHandler(startLogin);
  app.use(i18n);
  app.use(router);
  app.use(vuetify);
}
```

### Exemplo — bom código (adicionar novo plugin)

```ts
// 1. Criar providers/analytics.ts
import { ANALYTICS_ID } from '@core/config';

export default {
  install() {
    // inicialização do analytics
  },
};

// 2. Registrar em providers/plugins.ts
import analytics from './analytics';

export function registerPlugins(app: App) {
  app.use(pinia);
  app.use(i18n);
  app.use(router);
  app.use(vuetify);
  app.use(analytics); // novo plugin adicionado por último
}
```

### Exemplo — mau código (plugin com side effect descontrolado)

```ts
// RUIM: plugin que executa lógica pesada no install sem contexto
export default {
  install() {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        window.__APP_CONFIG__ = data; // variável global não tipada
      });
  },
};
```

Por que é ruim: side effect assíncrono no `install` sem controle de erro,
variável global sem tipagem, impossível testar, e a app pode renderizar
antes do fetch resolver.

## Autenticação no guard (`providers/router.ts`)

O `beforeResolveGuard` valida o `state` e troca o `code` em `/token`, e
carrega o usuário em rotas com `meta.requiresAuth`. Para iniciar o login usa
`startLogin()` de `@shared/helpers/session`. Detalhes do cliente OAuth em
[../core/README.md](../core/README.md).

## Rotas base (`routes.ts`)

Rotas que não pertencem a nenhum módulo de domínio (callback auth, 404):

```ts
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/token',
    name: 'AuthTokenCallback',
    component: () => import('@app/views/TokenCallbackView.vue'),
    meta: { layout: 'empty' },
  },
];

export default routes;
```

## App.vue — Seleção de layout

```vue
<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '@shared/ui/layouts/DefaultLayout.vue';
import EmptyLayout from '@shared/ui/layouts/EmptyLayout.vue';

const route = useRoute();
const currentLayout = computed(() => (route.meta.layout === 'empty' ? EmptyLayout : DefaultLayout));
</script>
```
