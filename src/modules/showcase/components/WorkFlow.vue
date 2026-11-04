<template>
  <!-- Painel de destaque da marca: fundo primary-container, sem gradiente (ADR-0046). -->
  <v-card
    class="workflow-card h-100 d-flex flex-column justify-space-between"
    color="primary-container"
    variant="flat"
    :border="false"
  >
    <v-card-title class="pa-4 pb-0">
      <v-card-subtitle opacity="1" class="font-weight-bold text-primary-text px-0">
        {{ $t('docsHome.workflow.eyebrow') }}
      </v-card-subtitle>

      <p class="text-h6 mb-0">{{ $t('docsHome.workflow.title') }}</p>
    </v-card-title>

    <v-card-text class="pa-5 pa-md-6">
      <v-row class="d-flex flex-column ga-4">
        <v-col
          v-for="item in activity"
          :key="item.detail"
          class="d-flex align-center ga-3 pb-4 activity-row"
        >
          <v-avatar color="surface" size="34">
            <v-icon size="18" :icon="item.icon" :color="item.color" />
          </v-avatar>
          <div>
            <p class="text-body-2 font-weight-semibold mb-1">{{ item.title }}</p>
            <code class="text-caption">{{ item.detail }}</code>
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions class="pa-4">
      <v-btn block color="primary" variant="flat" to="/onboarding">
        {{ $t('docsHome.workflow.cta') }}
        <v-icon end icon="arrow_forward" />
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Activity } from '../types';

const { activity } = defineProps<{
  activity: Activity[];
}>();
</script>
