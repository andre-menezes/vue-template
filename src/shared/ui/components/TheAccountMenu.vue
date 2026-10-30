<template>
  <v-card min-width="340" class="account-menu overflow-hidden">
    <template v-if="isLoggedIn">
      <v-list class="pa-0">
        <v-list-item class="pa-4" lines="three">
          <template #prepend>
            <v-avatar color="primary" size="46">
              <span class="font-weight-bold">{{ initials }}</span>
            </v-avatar>
          </template>

          <v-list-item-title class="text-body-medium text-high-emphasis font-weight-bold">
            {{ user?.nome || $t('account.defaultUser') }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ $t('account.cpf') }}: {{ user?.login || $t('common.notInformed') }}
          </v-list-item-subtitle>

          <v-list-item-subtitle>
            {{ user?.email?.[0] || $t('account.emailNotInformed') }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <v-divider color="white" :thickness="2" />

      <v-card-text class="account-unit pa-4">
        <v-list-subheader class="pa-0 mb-3 text-body-medium font-weight-bold text-high-emphasis">
          <v-icon color="primary" icon="domain" class="mr-2" />
          {{ $t('account.unitInfo') }}
        </v-list-subheader>

        <v-list-item class="pa-0 mb-3" lines="two">
          <v-list-item-title class="text-body-small text-medium-emphasis font-weight-semibold">
            {{ $t('account.unitCode') }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ user?.unidade?.codigo || $t('common.notInformed') }}
          </v-list-item-subtitle>
        </v-list-item>

        <v-list-item class="pa-0" lines="two">
          <v-list-item-title class="text-body-small text-medium-emphasis font-weight-semibold">
            {{ $t('account.unitName') }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ user?.unidade?.nome || $t('common.notInformed') }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-card-text>

      <v-divider color="white" :thickness="2" />

      <v-card-actions class="pa-3">
        <v-btn block variant="flat" color="primary" prepend-icon="logout" @click="emit('logout')">
          {{ $t('common.exit') }}
        </v-btn>
      </v-card-actions>
    </template>

    <template v-else>
      <v-list>
        <v-list-item
          prepend-icon="account_circle"
          :title="$t('account.loggedOutTitle')"
          :subtitle="$t('account.loggedOutSubtitle')"
        />
      </v-list>

      <v-card-actions class="pa-3 pt-0">
        <v-btn block color="primary" variant="flat" prepend-icon="login" @click="emit('login')">
          {{ $t('common.enter') }}
        </v-btn>
      </v-card-actions>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import type { UserDataResponse } from '@typings/store';

defineProps<{
  isLoggedIn: boolean;
  user: UserDataResponse | null;
  initials: string;
}>();

const emit = defineEmits<{
  login: [];
  logout: [];
}>();
</script>
