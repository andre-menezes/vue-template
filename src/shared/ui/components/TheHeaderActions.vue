<template>
  <v-btn
    class="mr-1"
    variant="text"
    :aria-label="
      theme === 'dark' ? $t('header.activateLightTheme') : $t('header.activateDarkTheme')
    "
    :icon="theme === 'dark' ? 'light_mode' : 'dark_mode'"
    @click="emit('switchTheme')"
  />

  <v-menu location="bottom end" :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn v-bind="props" icon variant="text" :aria-label="$t('header.openUserMenu')">
        <v-avatar color="primary" size="38">
          <span class="font-weight-bold">{{ initials }}</span>
        </v-avatar>
      </v-btn>
    </template>

    <TheAccountMenu
      :is-logged-in="isLoggedIn"
      :user="user"
      :initials="initials"
      @login="emit('login')"
      @logout="emit('logout')"
    />
  </v-menu>
</template>

<script setup lang="ts">
import type { UserDataResponse } from '@typings/store';
import TheAccountMenu from './TheAccountMenu.vue';

defineProps<{
  theme: 'light' | 'dark';
  isLoggedIn: boolean;
  user: UserDataResponse | null;
  initials: string;
}>();

const emit = defineEmits<{
  switchTheme: [];
  login: [];
  logout: [];
}>();
</script>
