---
name: vue-vuetify-components
description: Cria ou altera componentes, views e layouts Vue 3 + Vuetify 4 deste template (SFC com script setup, props tipadas, i18n, data-cy, tema). Use ao criar/editar qualquer arquivo .vue em src/.
---

# Componentes Vue 3 + Vuetify 4

Skill de execução para criar ou alterar arquivos `.vue` seguindo os padrões do
projeto. As regras abaixo são um resumo operacional; em caso de divergência,
vale a fonte de verdade:

- `agent/skills/vue-vuetify-dev/SKILL.md` — padrões Vue + Vuetify + TS
- `src/shared/ui/README.md` — apresentacional vs container, prefixos `The`/`Base`
- `src/modules/README.md` — estrutura de módulo, rotas, meta fields
- `docs/decisions/ADR-0012-vuetify-como-ui.md` e `ADR-0013-material-symbols-icones.md`
- `docs/I18N-MIGRATION-PLAN.md` — decisões de i18n (arrays traduzidos via `computed`)

Antes de escrever, leia **um componente parecido já existente** e copie o
estilo dele (ex.: `src/modules/home/components/MetricCard.vue`,
`src/shared/ui/components/ShowcaseCard.vue`).

## 1. Decidir onde o componente mora

| Situação                                                        | Destino                            |
| --------------------------------------------------------------- | ---------------------------------- |
| Página de rota (busca dados, chama service/store)               | `src/modules/<módulo>/views/`      |
| Bloco visual usado só por um módulo                             | `src/modules/<módulo>/components/` |
| Componente genérico, **sem regra de domínio**, usado por vários | `src/shared/ui/components/`        |
| Estrutura de página (chrome)                                    | `src/shared/ui/layouts/`           |

- Componente compartilhado singleton → prefixo `The` (`TheAppHeader`); base
  reutilizável → prefixo `Base` (`BaseLogo`).
- Nome do arquivo em PascalCase; view termina em `View` (`CustomersView.vue`).
- Se precisar de regra de negócio de um módulo, **não** vai para `shared/ui`.
- Módulo nunca importa de outro módulo; `shared` nunca importa de `modules`/`app`
  (o `npm run lint` reprova — ADR-0018). Se não estiver claro em qual camada a
  lógica fica, **pergunte** (política anti-achismo, `agent/core/CONTRACT.md`).

## 2. Esqueleto do SFC

Ordem obrigatória dos blocos: `<template>` → `<script setup lang="ts">` → `<style scoped>`
(regra `vue/block-order`).

```vue
<template>
  <v-card variant="outlined" class="h-100" data-cy="customer-card">
    <v-card-item>
      <v-card-title class="text-subtitle-1 font-weight-bold">{{ customer.name }}</v-card-title>
    </v-card-item>
    <v-card-actions>
      <v-btn
        color="primary"
        variant="tonal"
        data-cy="customer-select"
        @click="emit('select', customer.id)"
      >
        {{ $t('customers.select') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Customer } from '@typings/customer';

defineProps<{ customer: Customer }>();
const emit = defineEmits<{ select: [id: number] }>();
</script>
```

### Props e emits

- Sempre `defineProps<T>()` e `defineEmits<T>()` com generics; nunca a forma runtime.
- Contratos de props reutilizáveis ficam em `src/types/<contexto>/index.ts`
  (ex.: `ShowcaseCardProps` em `@typings/docs`). Interface PascalCase, sem prefixo `I`.
- Sem `any`; use `unknown` + narrowing se preciso.
- Eventos customizados em **camelCase** no `defineEmits` (`switchTheme`), nunca
  kebab-case (regra `vue/custom-event-name-casing`).
- `v-model` em componente: prop `modelValue` + emit `'update:modelValue'`, com
  `computed` get/set (ver `TheNavigationMenu.vue`).
- Desestruturação de props (`const { code } = defineProps<...>()`) é aceita
  quando o valor é usado no script (ver `CodeBlock.vue`).

### Apresentacional vs container

- **Componente apresentacional**: só props, emits e slots. Sem fetch, sem store,
  sem efeito lateral. Prefira slots a props complexas.
- **View container**: chama service/store/composable, controla `loading`/erro e
  passa dados por props. Não chama `ofetch` direto nem monta credenciais.
- Lógica de regra de negócio sai do template para `computed` (ou helper/util).

### Imports

- Alias mais curto: `@shared/`, `@core/`, `@app/`, `@typings/`, `@modules/`,
  `@test/`, `@root/`. Nunca `@/shared/...` ou `@root/src/...`.
- Dentro do próprio módulo, import relativo (`../components/X.vue`).
- `import type` para tipos.
- Nunca `import.meta.env` fora de `@core/config`.

## 3. Textos de UI (i18n)

- Todo texto visível vem do `vue-i18n`: `$t('namespace.chave')` no template
  (`globalInjection: true`), `const { t } = useI18n()` no script.
- Chaves em `src/app/locales/pt-BR.json`, agrupadas pelo namespace do módulo
  (`home`, `architecture`, `components`, ...) ou `common` para textos globais.
- Arrays de dados traduzidos são montados na **view** com
  `computed<T[]>(() => [...t('...')])`; o componente recebe o texto pronto.
- Não traduzir dado técnico: snippets de código, nomes de camada, ícones, ids.
- Frase com marcação inline (`<code>`) usa `<i18n-t>` com slots nomeados.
- Se precisar de uma chave nova, adicione-a no `pt-BR.json` no mesmo commit.

## 4. Vuetify

- Componentes `v-*` são auto-importados (`vite-plugin-vuetify`); não importe.
- Cores **só por token do tema** (`color="primary"`, `accent`, `info`,
  `success`, `error`, `warning`, `surface`, e variantes `*-variant`) definidos
  em `src/app/providers/vuetify.ts`. Nada de hex no template.
- Em CSS scoped, use as variáveis do tema:
  `rgba(var(--v-theme-on-surface), 0.15)`. Teste no tema light **e** dark.
- Layout e espaçamento com o grid (`v-row`/`v-col` com `cols`/`sm`/`md`/`lg`)
  e classes utilitárias (`pa-5`, `mb-4`, `ga-2`, `d-flex`, `h-100`,
  `text-medium-emphasis`, `font-weight-bold`, `text-h4`...). Evite CSS próprio
  quando há utilitária.
- Comportamento responsivo em script: `useDisplay()` do Vuetify
  (`mdAndUp`, etc.), nunca `window.innerWidth`.
- Ícones Material Symbols pela ligatura, sem prefixo: `icon="settings"`,
  `prepend-icon="home"`. Preenchido: sufixo `-fill` (`lock-fill`) ou classe
  `ms-fill`. Catálogo: https://fonts.google.com/icons
- Listas grandes: `v-virtual-scroll` ou paginação.

## 5. Acessibilidade e testabilidade

- Botão só com ícone exige `aria-label` (ver `CodeBlock.vue`).
- Ícone decorativo com `aria-hidden="true"`.
- Inputs com `label`.
- `data-cy` em kebab-case nos elementos que testes vão usar: raiz da página
  (`<contexto>-page`), título (`<contexto>-title`), ações e itens de lista
  (``:data-cy="`customer-${customer.id}`"``). E2E usa `getByTestId`.

## 6. Rotas (quando criar uma view nova)

`src/modules/<módulo>/routes.ts` exporta `default` um `RouteRecordRaw[]`, com
`component: () => import('./views/XView.vue')` e `meta` quando preciso
(ex.: `layout: 'empty'`; campos aceitos em `src/types/router`). É auto-descoberto; não registre manualmente. Se a tela
precisar aparecer no menu, adicione o item em `TheNavigationMenu.vue`.

## 7. Fechamento

1. Crie/atualize o teste do componente — use a skill `write-tests`.
2. Rode `npm run lint && npm run build && npm run test`.
3. Corrija a causa de qualquer erro (sem fix cego) e rode de novo.

## Não fazer

- `defineProps({...})` runtime, `any`, tipos inline repetidos.
- Fetch, store ou `ofetch` em componente apresentacional.
- Texto de UI fixo no template.
- Cor hex ou CSS que ignora o tema dark.
- Componente de domínio em `shared/ui/`.
- Instalar biblioteca de UI/ícones nova sem aprovação (exige ADR).
