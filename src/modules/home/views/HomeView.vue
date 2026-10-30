<template>
  <section class="home-page py-6 py-md-8" data-cy="home-page">
    <div class="mb-8">
      <p class="text-overline text-primary font-weight-bold mb-2">{{ $t('home.eyebrow') }}</p>
      <h1 class="text-h4 text-md-h3 font-weight-bold mb-2" data-cy="home-title">
        {{ $t('home.title') }}
      </h1>
      <p class="text-body-1 text-medium-emphasis mb-0" style="max-width: 720px">
        {{ $t('home.description') }}
      </p>
    </div>

    <v-row class="mb-2">
      <v-col v-for="metric in metrics" :key="metric.label" cols="12" sm="6" xl="3">
        <MetricCard :metric="metric" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="8">
        <div class="mb-4">
          <p class="text-overline text-primary font-weight-bold mb-1">
            {{ $t('home.navEyebrow') }}
          </p>
          <h2 class="text-h6 font-weight-bold mb-0">{{ $t('home.navTitle') }}</h2>
        </div>
        <v-row>
          <v-col v-for="card in navCards" :key="card.route" cols="12" sm="6">
            <NavigationCard :card="card" />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" lg="4" class="mt-16">
        <WorkFlow :activity="activity" />
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import MetricCard from '../components/MetricCard.vue';
import NavigationCard from '../components/NavigationCard.vue';
import WorkFlow from '../components/WorkFlow.vue';
import packageJson from '@root/package.json';
import type { Activity, Metric } from '@typings/home';
import type { NavCard } from '@typings/docs';

const { t } = useI18n();

const runtimeDependencies = Object.entries(packageJson.dependencies);
const toolingDependencies = Object.entries(packageJson.devDependencies);
const totalDependencies = runtimeDependencies.length + toolingDependencies.length;

const metrics = computed<Metric[]>(() => [
  {
    label: t('home.metrics.totalDeps.label'),
    value: totalDependencies,
    detail: t('home.metrics.totalDeps.detail'),
    icon: 'deployed_code',
    color: 'primary',
  },
  {
    label: t('home.metrics.runtime.label'),
    value: runtimeDependencies.length,
    detail: t('home.metrics.runtime.detail'),
    icon: 'rocket_launch-fill',
    color: 'accent',
  },
  {
    label: t('home.metrics.tooling.label'),
    value: toolingDependencies.length,
    detail: t('home.metrics.tooling.detail'),
    icon: 'build',
    color: 'info',
  },
  {
    label: t('home.metrics.quality.label'),
    value: 'CI',
    detail: t('home.metrics.quality.detail'),
    icon: 'verified_user',
    color: 'warning',
  },
]);

const navCards = computed<NavCard[]>(() => [
  {
    title: t('home.cards.architecture.title'),
    description: t('home.cards.architecture.description'),
    icon: 'account_tree',
    color: 'primary',
    route: '/arquitetura',
  },
  {
    title: t('home.cards.onboarding.title'),
    description: t('home.cards.onboarding.description'),
    icon: 'rocket_launch-fill',
    color: 'accent',
    route: '/onboarding',
  },
  {
    title: t('home.cards.components.title'),
    description: t('home.cards.components.description'),
    icon: 'palette',
    color: 'info',
    route: '/componentes',
  },
  {
    title: t('home.cards.conventions.title'),
    description: t('home.cards.conventions.description'),
    icon: 'checklist',
    color: 'success',
    route: '/convencoes',
  },
  {
    title: t('home.cards.decisions.title'),
    description: t('home.cards.decisions.description'),
    icon: 'gavel',
    color: 'secondary',
    route: '/decisoes',
  },
  {
    title: t('home.cards.protectedExample.title'),
    description: t('home.cards.protectedExample.description'),
    icon: 'lock',
    color: 'warning',
    route: '/exemplo-protegido',
    requiresAuth: true,
  },
]);

const activity = computed<Activity[]>(() => [
  {
    title: t('home.workflow.install'),
    detail: 'npm install',
    icon: 'deployed_code',
    color: 'success',
  },
  {
    title: t('home.workflow.dev'),
    detail: 'npm run dev',
    icon: 'dns',
    color: 'secondary',
  },
  {
    title: t('home.workflow.lint'),
    detail: 'npm run lint',
    icon: 'code',
    color: 'primary',
  },
  {
    title: t('home.workflow.unitTests'),
    detail: 'npm run test',
    icon: 'science',
    color: 'warning',
  },
  {
    title: t('home.workflow.e2eTests'),
    detail: 'npm run test:e2e',
    icon: 'travel_explore',
    color: 'info',
  },
  {
    title: t('home.workflow.build'),
    detail: 'npm run build',
    icon: 'deployed_code_update',
    color: 'accent',
  },
]);
</script>
