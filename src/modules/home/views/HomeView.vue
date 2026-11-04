<template>
  <section data-cy="home-page">
    <v-card class="home-hero mb-6" :border="false" color="primary-container" variant="flat">
      <div class="home-hero__body pa-6 pa-sm-8 pa-md-10">
        <p class="text-overline text-primary-text mb-3">{{ $t('welcome.eyebrow') }}</p>
        <h1 class="text-h4 text-md-h2 mb-3" data-cy="home-title">
          {{ $t('welcome.title', { appName: APP_NAME }) }}
        </h1>
        <p class="text-body-1 mb-6" style="max-width: 600px">{{ $t('welcome.description') }}</p>
        <div class="d-flex flex-wrap ga-3">
          <v-btn
            v-if="hasDocs"
            :to="{ name: 'DocsHome' }"
            color="primary"
            size="large"
            prepend-icon="menu_book"
            data-cy="home-docs-link"
          >
            {{ $t('welcome.docsLink') }}
          </v-btn>
          <v-btn
            v-if="hasExample"
            :to="{ name: 'Customers' }"
            variant="outlined"
            color="primary-text"
            size="large"
            prepend-icon="group"
            data-cy="home-example-link"
          >
            {{ $t('welcome.exampleLink') }}
          </v-btn>
        </div>
      </div>
    </v-card>

    <h2 class="text-h6 mb-4">{{ $t('welcome.nextSteps') }}</h2>
    <v-row>
      <v-col v-for="step in steps" :key="step.hint" cols="12" md="4">
        <v-card class="h-100 pa-5" data-cy="home-step">
          <v-avatar color="primary-container" rounded="md" size="40" class="mb-4">
            <v-icon :icon="step.icon" color="primary-text" />
          </v-avatar>
          <h3 class="text-subtitle-1 mb-1">{{ step.title }}</h3>
          <p class="text-body-2 text-medium-emphasis mb-3">{{ step.description }}</p>
          <code class="text-caption">{{ step.hint }}</code>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { APP_NAME } from '@core/config';

const { t } = useI18n();

// A documentação e o CRUD de exemplo vivem nos módulos `showcase` e
// `customers`, que `pnpm template:clean` remove. Os links são resolvidos pelo
// nome da rota para não importar outro módulo, e somem com eles.
const router = useRouter();
const hasDocs = router.hasRoute('DocsHome');
const hasExample = router.hasRoute('Customers');

/** Primeiros passos de um projeto novo; continuam valendo após o clean. */
const steps = computed(() => [
  {
    icon: 'deployed_code',
    title: t('welcome.steps.module.title'),
    description: t('welcome.steps.module.description'),
    hint: 'src/modules/<nome>/',
  },
  {
    icon: 'task_alt',
    title: t('welcome.steps.test.title'),
    description: t('welcome.steps.test.description'),
    hint: 'pnpm test:coverage',
  },
  {
    icon: 'rocket_launch',
    title: t('welcome.steps.deploy.title'),
    description: t('welcome.steps.deploy.description'),
    hint: 'docker build -t app .',
  },
]);
</script>

<style scoped>
.home-hero {
  overflow: hidden;
}

/* Marca d'água da camada do logo: identidade sem disputar com o texto. */
.home-hero__body {
  position: relative;
  background-image: radial-gradient(
    circle at 100% 0%,
    rgba(var(--v-theme-primary), 0.14) 0,
    rgba(var(--v-theme-primary), 0) 55%
  );
}
</style>
