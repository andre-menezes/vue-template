<template>
  <v-form ref="form" data-cy="customer-form" @submit.prevent="onSubmit">
    <v-alert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      class="mb-4"
      :text="errorMessage"
      data-cy="customer-form-error"
    />
    <v-text-field
      v-model="fields.name"
      :label="$t('customers.fields.name')"
      :rules="[required]"
      autocomplete="name"
      class="mb-2"
      data-cy="customer-name-input"
    />
    <v-text-field
      v-model="fields.email"
      :label="$t('customers.fields.email')"
      :rules="[required, validEmail]"
      type="email"
      autocomplete="email"
      class="mb-2"
      data-cy="customer-email-input"
    />
    <v-text-field
      v-model="fields.phone"
      :label="$t('customers.fields.phone')"
      :hint="$t('customers.form.optional')"
      persistent-hint
      type="tel"
      autocomplete="tel"
      class="mb-2"
      data-cy="customer-phone-input"
    />
    <v-switch
      v-model="fields.active"
      :label="$t('customers.form.activeLabel')"
      color="primary"
      inset
      data-cy="customer-active-input"
    />
    <div class="d-flex ga-2 justify-end">
      <v-btn
        variant="text"
        :disabled="saving"
        data-cy="customer-cancel-btn"
        @click="emit('cancel')"
      >
        {{ $t('customers.form.cancel') }}
      </v-btn>
      <v-btn type="submit" color="primary" :loading="saving" data-cy="customer-submit-btn">
        {{ $t('customers.form.save') }}
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { reactive, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import type { VForm } from 'vuetify/components';
import type { CustomerParams } from '../types';

const props = defineProps<{
  /** Valores iniciais; ausente no cadastro. */
  initialValues?: CustomerParams;
  saving: boolean;
  /** Erro da última gravação (ex.: e-mail já cadastrado), já traduzido. */
  errorMessage?: string | null;
}>();

const emit = defineEmits<{
  submit: [params: CustomerParams];
  cancel: [];
}>();

const { t } = useI18n();
const form = useTemplateRef<VForm>('form');

// Cópia local: editar o formulário não altera o objeto recebido por prop.
const fields = reactive({
  name: props.initialValues?.name ?? '',
  email: props.initialValues?.email ?? '',
  phone: props.initialValues?.phone ?? '',
  active: props.initialValues?.active ?? true,
});

/**
 * Validação simples com as `rules` do Vuetify. A biblioteca de formulários e
 * validação do template ainda será escolhida em ADR (roadmap 3.3); o servidor
 * continua validando e a resposta de erro aparece no alerta.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const required = (value: string): true | string =>
  value.trim() !== '' || t('customers.form.required');

const validEmail = (value: string): true | string =>
  EMAIL_PATTERN.test(value.trim()) || t('customers.form.invalidEmail');

async function onSubmit(): Promise<void> {
  const result = await form.value?.validate();
  if (!result?.valid) return;

  const phone = fields.phone.trim();
  emit('submit', {
    name: fields.name.trim(),
    email: fields.email.trim(),
    phone: phone === '' ? null : phone,
    active: fields.active,
  });
}
</script>
