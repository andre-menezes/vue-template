import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import pluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginVueI18n from '@intlify/eslint-plugin-vue-i18n';

// ---------------------------------------------------------------------------
// Regras de dependência entre camadas (ADR-0018), aplicadas com a regra nativa
// `no-restricted-imports` (sem plugin extra):
//
//   app     → modules*, shared, core, types   (*apenas via glob de rotas)
//   modules → shared, core, types             (nunca outro módulo)
//   shared  → core, types
//   core    → types
//   types   → nenhuma camada
//
// Cada bloco abaixo vale para os arquivos de uma camada. Como o flat config
// substitui (e não mescla) a regra quando dois blocos casam o mesmo arquivo,
// todo bloco inclui também as restrições comuns de alias.
// ---------------------------------------------------------------------------

/** Alias mais curto obrigatório: `@shared/x` em vez de `@/shared/x`. */
const aliasPatterns = [
  {
    group: ['@/app/*', '@/core/*', '@/modules/*', '@/shared/*', '@/types/*', '@/test/*'],
    message: 'Use o alias da camada (@app, @core, @modules, @shared, @typings, @test).',
  },
];

/** Monta a regra para uma camada proibindo os grupos informados. */
function forbidLayers(layerName, forbidden, extraPatterns = []) {
  return {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          ...aliasPatterns,
          ...forbidden.map(({ group, target }) => ({
            group,
            message: `A camada ${layerName} não pode importar de ${target} (ADR-0018).`,
          })),
          ...extraPatterns,
        ],
      },
    ],
  };
}

const APP = { group: ['@app/*', '**/app/**'], target: 'app' };
const MODULES = { group: ['@modules/*', '**/modules/**'], target: 'modules' };
const SHARED = { group: ['@shared/*', '**/shared/**'], target: 'shared' };
const CORE = { group: ['@core/*', '**/core/**'], target: 'core' };
const TEST = { group: ['@test/*', '**/test/**'], target: 'test' };

/**
 * Import relativo que sobe até `src/modules/` alcança outro módulo. Os padrões
 * casam com o texto do import, não com o caminho resolvido, então a regra
 * depende da profundidade do arquivo: em `src/modules/<m>/arquivo.ts` o limite
 * é `../`; em `src/modules/<m>/views/arquivo.ts`, `../../`; e assim por diante.
 */
const MODULE_MAX_DEPTH = 6;
const moduleDepthRules = Array.from({ length: MODULE_MAX_DEPTH }, (_, index) => {
  const depth = index + 1;
  return {
    files: [`src/modules/*/${'*/'.repeat(depth - 1)}*.{ts,vue}`],
    rules: forbidLayers(
      'modules',
      [APP, MODULES, TEST],
      [
        {
          group: [`${'../'.repeat(depth)}*`],
          message:
            'Um módulo não pode importar de outro módulo, nem por caminho relativo (ADR-0018).',
        },
      ]
    ),
  };
});

const layerRules = [
  { files: ['src/**/*.{ts,vue}'], rules: forbidLayers('src', []) },
  { files: ['src/app/**/*.{ts,vue}'], rules: forbidLayers('app', [MODULES, TEST]) },
  {
    // Entre módulos só se usa import relativo dentro do próprio módulo.
    files: ['src/modules/**/*.{ts,vue}'],
    rules: forbidLayers('modules', [APP, MODULES, TEST]),
  },
  ...moduleDepthRules,
  { files: ['src/shared/**/*.{ts,vue}'], rules: forbidLayers('shared', [APP, MODULES, TEST]) },
  {
    files: ['src/core/**/*.{ts,vue}'],
    rules: forbidLayers('core', [APP, MODULES, SHARED, TEST]),
  },
  {
    files: ['src/types/**/*.ts'],
    rules: forbidLayers('types', [APP, MODULES, SHARED, CORE, TEST]),
  },
];

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        // Injetado pelo `define` do `vite.config.ts` (declarado em `src/env.d.ts`).
        __APP_META__: 'readonly',
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  // Faz o vue-eslint-parser delegar o conteudo de <script lang="ts"> ao
  // parser do TypeScript, permitindo analisar sintaxe TS dentro dos .vue.
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  // Lint tipado: regras que dependem do type checker (promises soltas, `await`
  // em não-promise, acesso inseguro a `any`). Restrito ao código da aplicação
  // e do E2E, que têm tsconfig próprio; configs na raiz ficam só no lint base.
  // Só as regras: o parser já vem do bloco base (TS) e do eslint-plugin-vue
  // (vue-eslint-parser delegando ao TS), e não pode ser sobrescrito aqui.
  ...tseslint.configs.recommendedTypeChecked.map(({ languageOptions: _ignored, ...config }) => ({
    ...config,
    files: ['src/**/*.{ts,vue}', 'e2e/**/*.ts'],
  })),
  {
    files: ['src/**/*.{ts,vue}', 'e2e/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue'],
      },
    },
  },
  {
    // `expect(obj.metodo).toHaveBeenCalled()` passa o método solto de propósito,
    // e testes montam componentes inline para isolar o comportamento.
    files: ['src/test/**/*.ts'],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      'vue/one-component-per-file': 'off',
    },
  },
  eslintConfigPrettier,
  // Prettier: registramos o plugin manualmente em vez de usar
  // `pluginPrettier.configs.recommended`, pois esse preset ainda usa a chave
  // `extends` (formato eslintrc), incompatível com o flat config do ESLint 10.
  {
    plugins: { prettier: pluginPrettier },
  },
  {
    rules: {
      // Regras de qualidade (nao-estilo). A formatacao fica 100% a cargo do
      // Prettier; regras estilisticas do eslint-plugin-vue foram removidas
      // para evitar conflito com o Prettier (vide eslint-config-prettier).
      'prefer-const': 'error',
      'vue/block-order': [
        'error',
        {
          order: ['template', 'script', 'style'],
        },
      ],
      'vue/attribute-hyphenation': ['error', 'always'],
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-var-requires': 'error',
      'prettier/prettier': 'error',
    },
  },
  ...layerRules,
  // i18n: chaves usadas precisam existir em `pt-BR.json`, e o JSON não guarda
  // chaves órfãs. Texto fixo no template vira aviso para não bloquear trechos
  // técnicos (snippets, nomes de camada), que não são traduzidos.
  ...pluginVueI18n.configs['flat/recommended'],
  {
    files: ['src/**/*.{ts,vue}', 'src/**/locales/*.json'],
    settings: {
      'vue-i18n': {
        localeDir: './src/**/locales/*.json',
        messageSyntaxVersion: '^11.0.0',
      },
    },
    rules: {
      '@intlify/vue-i18n/no-missing-keys': 'error',
      '@intlify/vue-i18n/no-unused-keys': [
        'error',
        // `nav.*` chega ao `$t` por variável (`item.titleKey` no menu), que a
        // regra não consegue rastrear.
        { extensions: ['.ts', '.vue'], ignores: ['/^nav\\./'] },
      ],
      '@intlify/vue-i18n/no-raw-text': 'warn',
      '@intlify/vue-i18n/no-v-html': 'off',
    },
  },
];
