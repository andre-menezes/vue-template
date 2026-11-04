<template>
  <v-card class="base-stat-card h-100 pa-5 pa-md-6" data-cy="stat-card">
    <div class="d-flex align-start justify-space-between ga-4">
      <div class="min-w-0">
        <strong class="base-stat-card__value d-block" data-cy="stat-card-value">{{ value }}</strong>
        <p class="text-body-2 text-medium-emphasis mt-2 mb-0">{{ label }}</p>
        <p v-if="detail" class="text-caption text-medium-emphasis mt-1 mb-0">{{ detail }}</p>
      </div>
      <v-icon v-if="icon" :icon="filledIcon" :color="color" size="28" aria-hidden="true" />
    </div>
  </v-card>
</template>

<script setup lang="ts">
/**
 * Cartão de indicador no estilo Vora (ADR-0047): o número em destaque, o
 * rótulo embaixo e o ícone preenchido à direita, na cor da categoria.
 */
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    value: string | number;
    label: string;
    detail?: string;
    /** Ícone do Material Symbols; aparece preenchido (sufixo `-fill`). */
    icon?: string;
    color?: string;
  }>(),
  { detail: undefined, icon: undefined, color: 'primary' }
);

/** Variante preenchida do ícone, sem repetir o sufixo se ele já vier. */
const filledIcon = computed(() =>
  props.icon?.endsWith('-fill') ? props.icon : `${props.icon}-fill`
);
</script>

<style scoped>
.base-stat-card__value {
  font-size: 36px;
  line-height: 44px;
  font-weight: 600;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}
</style>
