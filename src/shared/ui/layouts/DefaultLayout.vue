<template>
  <TheAppHeader @toggle-navigation="navigationOpen = !navigationOpen" />
  <TheNavigationMenu v-model="navigationOpen" />
  <v-main>
    <v-container max-width="1440" class="pb-10"><slot></slot></v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
import TheAppHeader from '../components/TheAppHeader.vue';
import TheNavigationMenu from '../components/TheNavigationMenu.vue';

const { mdAndUp } = useDisplay();

// Aberto no desktop; no mobile o drawer é temporário (overlay) e começa
// fechado, sendo aberto pelo botão de menu do header.
const navigationOpen = ref(mdAndUp.value);
</script>
