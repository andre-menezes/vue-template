<template>
  <section class="protected-example-page py-6 py-md-8" data-cy="protected-example-page">
    <div class="mb-8">
      <p class="text-overline text-warning font-weight-bold mb-2">
        <v-icon icon="lock" size="small" class="mr-1" />
        {{ $t('protectedExample.eyebrow') }}
      </p>
      <h1 class="text-h4 text-md-h3 font-weight-bold mb-2" data-cy="protected-example-title">
        {{ $t('protectedExample.title') }}
      </h1>
      <p class="text-body-1 text-medium-emphasis mb-0" style="max-width: 760px">
        {{ $t('protectedExample.description') }}
      </p>
    </div>

    <DocSection
      :title="$t('protectedExample.user.title')"
      :description="$t('protectedExample.user.description')"
      icon="account_circle"
      anchor="usuario"
    >
      <v-card variant="outlined" data-cy="user-data">
        <v-list v-if="userData" lines="two" class="bg-transparent">
          <v-list-item v-for="field in userFields" :key="field.label" :title="field.value">
            <template #prepend>
              <v-icon :icon="field.icon" color="primary" class="mr-3" />
            </template>
            <v-list-item-subtitle>{{ field.label }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <v-card-text v-else class="text-medium-emphasis">
          {{ $t('protectedExample.user.empty') }}
        </v-card-text>
      </v-card>

      <div v-if="roles.length" class="mt-4">
        <p class="text-subtitle-2 font-weight-bold mb-2">
          {{ $t('protectedExample.user.rolesTitle') }}
        </p>
        <div class="d-flex flex-wrap ga-2">
          <v-chip
            v-for="role in roles"
            :key="role"
            color="accent"
            variant="tonal"
            prepend-icon="badge"
          >
            {{ role }}
          </v-chip>
        </div>
      </div>
    </DocSection>

    <DocSection
      :title="$t('protectedExample.guard.title')"
      :description="$t('protectedExample.guard.description')"
      icon="shield"
      anchor="guard"
    >
      <FlowSteps :steps="guardFlow" />

      <ShowcaseCard
        :title="$t('protectedExample.guard.showcaseTitle')"
        :description="$t('protectedExample.guard.showcaseDescription')"
        :code="routeCode"
        language="ts"
        class="mt-4"
      >
        <template #preview>
          <v-chip color="warning" variant="tonal" prepend-icon="lock">requiresAuth: true</v-chip>
          <v-chip color="primary" variant="tonal" prepend-icon="shield">beforeResolveGuard</v-chip>
        </template>
      </ShowcaseCard>
    </DocSection>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@shared/stores/user.store';
import DocSection from '@shared/ui/components/DocSection.vue';
import ShowcaseCard from '@shared/ui/components/ShowcaseCard.vue';
import FlowSteps from '@shared/ui/components/FlowSteps.vue';
import type { FlowStep } from '@typings/docs';

const { t } = useI18n();
const userStore = useUserStore();
const userData = computed(() => userStore.userData);
const roles = computed(() => userData.value?.roles ?? []);

const userFields = computed(() => {
  const data = userData.value;
  if (!data) return [];

  return [
    { label: t('protectedExample.user.name'), value: data.nome, icon: 'person' },
    { label: t('protectedExample.user.login'), value: data.login, icon: 'badge' },
    { label: t('protectedExample.user.email'), value: data.email?.join(', ') || '—', icon: 'mail' },
    {
      label: t('protectedExample.user.unit'),
      value: `${data.unidade.codigo} - ${data.unidade.nome}`,
      icon: 'apartment',
    },
  ];
});

const guardFlow = computed<FlowStep[]>(() => [
  {
    order: 1,
    title: t('protectedExample.guard.step1.title'),
    description: t('protectedExample.guard.step1.description'),
    icon: 'lock',
  },
  {
    order: 2,
    title: t('protectedExample.guard.step2.title'),
    description: t('protectedExample.guard.step2.description'),
    icon: 'key',
  },
  {
    order: 3,
    title: t('protectedExample.guard.step3.title'),
    description: t('protectedExample.guard.step3.description'),
    icon: 'login',
  },
  {
    order: 4,
    title: t('protectedExample.guard.step4.title'),
    description: t('protectedExample.guard.step4.description'),
    icon: 'person',
  },
]);

const routeCode = `const routes: RouteRecordRaw[] = [
  {
    path: '/exemplo-protegido',
    name: 'ProtectedExample',
    component: () => import('./views/ProtectedExampleView.vue'),
    meta: { requiresAuth: true },
  },
];`;
</script>
