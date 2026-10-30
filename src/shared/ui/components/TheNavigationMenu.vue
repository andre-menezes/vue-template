<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" class="navigation-menu" :temporary="!mdAndUp">
    <v-list class="pa-3" nav>
      <v-list-item
        v-for="item in menuItems"
        :key="item.route"
        :to="item.route"
        color="primary"
        rounded="lg"
        class="mb-1"
      >
        <template #prepend><v-icon :icon="item.icon" /></template>
        <v-list-item-title class="font-weight-medium">
          {{ $t(item.titleKey) }}

          <v-tooltip location="top" :text="$t('nav.blockedAccess')" color="surface" theme="dark">
            <template #activator="{ props: tooltipProps }">
              <v-chip
                v-if="!isAuthorized && item.requiresAuth"
                v-bind="tooltipProps"
                size="small"
                color="primary"
              >
                <v-icon icon="lock-fill" size="x-small"></v-icon>
              </v-chip>
            </template>
          </v-tooltip>
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <template #append>
      <div class="navigation-status ma-3 pa-3 d-flex justify-center align-center ga-2 rounded-lg">
        <v-icon icon="info" color="accent" />
        <span class="text-body-small">
          <span class="font-weight-semibold">{{ $t('common.currentVersion') }}:</span>
          {{ version }}
        </span>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import { version } from '@root/package.json';
import type { MenuItem } from '@typings/components';

const props = defineProps<{ modelValue: boolean; isAuthorized: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
const drawer = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

// Reativo ao redimensionamento (window.innerWidth não é).
const { mdAndUp } = useDisplay();
const rail = computed(() => !drawer.value && mdAndUp.value);

// Itens de navegação. Cada tela de documentação é adicionada aqui conforme é
// implementada (por entrega), evitando links para rotas ainda inexistentes.
const menuItems: MenuItem[] = [
  { titleKey: 'nav.home', route: '/', icon: 'dashboard', requiresAuth: false },
  {
    titleKey: 'nav.architecture',
    route: '/arquitetura',
    icon: 'account_tree',
    requiresAuth: false,
  },
  {
    titleKey: 'nav.onboarding',
    route: '/onboarding',
    icon: 'rocket_launch-fill',
    requiresAuth: false,
  },
  { titleKey: 'nav.components', route: '/componentes', icon: 'palette', requiresAuth: false },
  { titleKey: 'nav.conventions', route: '/convencoes', icon: 'checklist', requiresAuth: false },
  { titleKey: 'nav.decisions', route: '/decisoes', icon: 'gavel', requiresAuth: false },
  {
    titleKey: 'nav.protectedExample',
    route: '/exemplo-protegido',
    icon: 'lock',
    requiresAuth: true,
  },
];
</script>
