<template>
  <BaseStatusChip
    :label="active ? $t('customers.status.active') : $t('customers.status.inactive')"
    :tone="active ? 'success' : 'neutral'"
    :icon="active ? 'check_circle' : 'block'"
    data-cy="customer-status"
  />
</template>

<script setup lang="ts">
import BaseStatusChip from '@shared/ui/components/BaseStatusChip.vue';

/** Situação do cliente no chip de status do design system (ADR-0045). */
defineProps<{ active: boolean }>();
</script>
