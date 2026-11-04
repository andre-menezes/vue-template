<template>
  <BaseStatCard
    :value="metric.value"
    :label="metric.label"
    :detail="metric.detail"
    :icon="metric.icon"
    :color="metric.color"
  />
</template>

<script setup lang="ts">
import BaseStatCard from '@shared/ui/components/BaseStatCard.vue';
import type { Metric } from '../types';

defineProps<{
  metric: Metric;
}>();
</script>
