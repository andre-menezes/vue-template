<template>
  <v-app :theme="appStore.theme">
    <component :is="currentLayout">
      <router-view :key="route.name" />
    </component>
  </v-app>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@shared/stores/app.store';
import DefaultLayout from '@shared/ui/layouts/DefaultLayout.vue';
import EmptyLayout from '@shared/ui/layouts/EmptyLayout.vue';

const route = useRoute();
const appStore = useAppStore();

const currentLayout = computed(() => (route.meta.layout === 'empty' ? EmptyLayout : DefaultLayout));
</script>
