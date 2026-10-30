<template>
  <v-app-bar theme="dark" class="app-header px-2 px-sm-4" elevation="2" height="64">
    <v-app-bar-nav-icon class="d-md-none" @click="emit('toggleNavigation')" />
    <div class="d-none d-sm-flex align-center ga-3">
      <BaseLogo class="logo" />
      <v-app-bar-title class="text-title-medium font-weight-bold pa-0">
        {{ APP_NAME }}
      </v-app-bar-title>
    </div>

    <v-spacer />

    <v-row class="flex-grow-0 ga-4" no-gutters align="center">
      <TheHeaderActions
        :theme="theme"
        :is-logged-in="isLoggedIn"
        :user="user"
        :initials="initials"
        @switch-theme="toggleTheme"
        @login="login"
        @logout="logout"
      />
    </v-row>
  </v-app-bar>
</template>

<script setup lang="ts">
import { APP_NAME } from '@core/config';
import { useSession, useTheme } from '@shared/composables';
import BaseLogo from './BaseLogo.vue';
import TheHeaderActions from './TheHeaderActions.vue';

const { isLoggedIn, user, initials, login, logout } = useSession();
const { theme, toggleTheme } = useTheme();

const emit = defineEmits<{
  toggleNavigation: [];
}>();
</script>
