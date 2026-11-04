<template>
  <v-btn-toggle
    :model-value="modelValue"
    mandatory
    density="comfortable"
    class="base-segmented pa-1"
    :aria-label="label"
    data-cy="segmented-control"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-btn
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      variant="text"
      class="base-segmented__option"
      :data-cy="`segmented-option-${option.value}`"
    >
      {{ option.label }}
    </v-btn>
  </v-btn-toggle>
</template>

<script setup lang="ts" generic="TValue extends string">
/**
 * Controle segmentado no estilo Vora (ADR-0047): um trilho cinza com a opção
 * escolhida em destaque, para alternar a visão (dia, semana, mês) ou um
 * filtro. Sempre há uma opção selecionada.
 */
defineProps<{
  modelValue: TValue;
  options: { value: TValue; label: string }[];
  /** Nome do grupo para o leitor de tela. */
  label: string;
}>();

const emit = defineEmits<{ 'update:modelValue': [value: TValue] }>();
</script>

<style scoped>
.base-segmented {
  align-self: flex-start;
  width: fit-content;
  height: auto !important;
  background: rgb(var(--v-theme-surface-light));
  border-radius: 8px;
}

.base-segmented__option {
  border-radius: 4px !important;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-weight: 500;
}

.base-segmented__option.v-btn--active {
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  box-shadow: 0 1px 3px rgba(15, 15, 15, 0.12);
}

.base-segmented__option.v-btn--active :deep(.v-btn__overlay) {
  opacity: 0;
}
</style>
