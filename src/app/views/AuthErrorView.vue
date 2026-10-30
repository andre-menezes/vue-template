<template>
  <section
    class="d-flex align-center justify-center px-4 px-sm-6 py-6 py-md-16"
    data-cy="auth-error-page"
  >
    <v-card max-width="520" class="pa-6 pa-sm-8 text-center" rounded="xl">
      <v-img
        :src="errorIllustration"
        :alt="$t('authError.illustrationAlt')"
        max-height="220"
        class="mx-auto mb-6"
        data-cy="auth-error-illustration"
      />

      <p class="text-overline text-error font-weight-bold mb-1">{{ $t('authError.eyebrow') }}</p>
      <h1 class="text-h5 text-sm-h4 font-weight-bold mb-4">{{ $t('authError.title') }}</h1>

      <v-alert
        type="error"
        variant="tonal"
        class="text-left mb-6"
        :text="message"
        data-cy="auth-error-message"
      />

      <p class="text-body-2 text-medium-emphasis mb-6">{{ $t('authError.hint') }}</p>

      <v-btn color="primary" size="large" prepend-icon="home" to="/">
        {{ $t('common.backToHome') }}
      </v-btn>

      <p class="text-caption text-medium-emphasis mt-6 mb-0">
        <a
          href="https://storyset.com/worker"
          target="_blank"
          rel="noopener"
          class="text-medium-emphasis"
        >
          {{ $t('authError.illustrationCredit') }}
        </a>
      </p>
    </v-card>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import errorIllustration from '@shared/assets/illustrations/authentication_fail.svg';
import type { AuthErrorReason } from '@typings/auth';

const route = useRoute();
const { t } = useI18n();

// Apenas códigos conhecidos são traduzidos; qualquer outro valor (inclusive
// texto livre injetado na URL) cai na mensagem padrão.
const reasonMessageKeys: Record<AuthErrorReason, string> = {
  state_mismatch: 'authError.reasons.stateMismatch',
  token_exchange_failed: 'authError.reasons.tokenExchangeFailed',
};

const message = computed(() => {
  const reason = route.query['reason'];
  const key =
    typeof reason === 'string' && Object.hasOwn(reasonMessageKeys, reason)
      ? reasonMessageKeys[reason as AuthErrorReason]
      : 'authError.defaultMessage';
  return t(key);
});
</script>
