/// <reference types="vite/client" />

// Plugins
import vue from '@vitejs/plugin-vue';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';
import { readFileSync } from 'node:fs';
import dns from 'dns';
import vueDevTools from 'vite-plugin-vue-devtools';

dns.setDefaultResultOrder('verbatim');

// Só os dados do `package.json` que a UI exibe. Importar o arquivo no código
// colocaria a lista inteira de dependências no bundle.
const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));
const appMeta = {
  version: packageJson.version,
  runtimeDependencies: Object.keys(packageJson.dependencies ?? {}).length,
  toolingDependencies: Object.keys(packageJson.devDependencies ?? {}).length,
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    __APP_META__: JSON.stringify(appMeta),
  },
  plugins: [
    vue({
      template: {
        transformAssetUrls,
      },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
      // Compila só o CSS dos componentes usados, já com as variáveis do projeto.
      styles: { configFile: 'src/app/styles/settings.scss' },
    }),
    // Pré-compila as mensagens de `src/app/locales` em build e usa o build
    // runtime-only do vue-i18n, sem o compilador de mensagens no bundle.
    VueI18nPlugin({
      include: [fileURLToPath(new URL('./src/app/locales/**', import.meta.url))],
      // Algumas mensagens das telas de documentação contêm HTML (renderizado
      // com `v-html`); sem isto o plugin recusa essas mensagens.
      strictMessage: false,
      // Todas as mensagens chegam pré-compiladas, então o compilador sai do bundle.
      dropMessageCompiler: true,
    }),
    ...(mode === 'development' ? [vueDevTools()] : []),
  ],
  optimizeDeps: {
    // O `vite-plugin-vuetify` importa os componentes sob demanda, então o Vite
    // só os descobre ao abrir cada rota e recarrega a página no meio do uso
    // (e dos testes E2E). Pré-otimizar todos na partida evita esses reloads.
    include: ['vuetify/components/*'],
  },
  resolve: {
    alias: {
      '@root': fileURLToPath(new URL('./', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
      '@core': fileURLToPath(new URL('./src/core', import.meta.url)),
      '@modules': fileURLToPath(new URL('./src/modules', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@typings': fileURLToPath(new URL('./src/types', import.meta.url)),
      '@test': fileURLToPath(new URL('./src/test', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (['vue', 'vue-router', 'pinia'].some((m) => id.includes(`/node_modules/${m}/`)))
            return 'vendor-vue';
          if (id.includes('/node_modules/vuetify/')) return 'vendor-vuetify';
          if (id.includes('/node_modules/vue-i18n/')) return 'vendor-i18n';
        },
      },
    },
  },
  server: {
    port: 9081,
    watch: {
      // Ignora diretórios de estado local de ferramentas (ex.: vfox) para
      // evitar erros EBUSY do file watcher ao observar SDKs instalados.
      ignored: ['**/.vfox/**'],
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    css: true,
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
    setupFiles: ['src/test/setup.ts'],
    include: ['src/test/**/*.spec.ts'],
    coverage: {
      provider: 'v8' as const,
      reporter: ['text', 'lcov', 'cobertura'],
      // Mede todo o código-fonte. Com `include` vazio, o v8 não reporta
      // nenhum arquivo e os thresholds deixam de ser aplicados.
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'src/test/**',
        'src/types/**',
        'src/**/*.d.ts',
        'src/app/main.ts',
        'src/shared/composables/index.ts',
        'src/shared/stores/index.ts',
      ],
      // Piso de cobertura (ratchet — ADR-0016): reflete a cobertura real atual
      // e só pode subir. Ao aumentar a cobertura, atualize estes valores.
      // Rebaixado uma única vez pela ADR-0021: a remoção da autenticação corporativa
      // tirou código bem testado do denominador (não houve perda de testes).
      thresholds: {
        lines: 29,
        functions: 19,
        branches: 51,
        statements: 28,
      },
    },
  },
}));
