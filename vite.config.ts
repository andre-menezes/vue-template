/// <reference types="vite/client" />

// Plugins
import vue from '@vitejs/plugin-vue';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';
import dns from 'dns';
import vueDevTools from 'vite-plugin-vue-devtools';

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue({
      template: {
        transformAssetUrls,
      },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
    ...(mode === 'development' ? [vueDevTools()] : []),
  ],
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
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
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
      thresholds: {
        lines: 45,
        functions: 29,
        branches: 57,
        statements: 43,
      },
    },
  },
}));
