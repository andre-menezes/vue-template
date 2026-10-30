<template>
  <v-table
    density="comfortable"
    class="dependency-rules-table border rounded-lg"
    data-cy="dependency-rules"
  >
    <thead>
      <tr>
        <th class="text-left font-weight-bold">Camada</th>
        <th class="text-left font-weight-bold">Pode importar de</th>
        <th class="text-left font-weight-bold">Não pode importar de</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="rule in rules" :key="rule.layer">
        <td>
          <v-chip size="small" variant="tonal" color="primary">{{ rule.layer }}</v-chip>
        </td>
        <td class="text-medium-emphasis">{{ rule.canImport }}</td>
        <td class="text-medium-emphasis">{{ rule.cannotImport }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import type { DependencyRule } from '@typings/architecture';

defineProps<{
  rules: DependencyRule[];
}>();
</script>
