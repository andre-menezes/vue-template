<template>
  <section class="py-6" data-cy="customer-form-page">
    <h1 class="text-h4 font-weight-bold mb-6" data-cy="customer-form-title">
      {{ isEdit ? $t('customers.form.editTitle') : $t('customers.form.createTitle') }}
    </h1>

    <v-progress-linear v-if="isEdit && isPending" indeterminate color="primary" />
    <v-alert
      v-else-if="error"
      :type="isNotFoundError(error) ? 'info' : 'error'"
      variant="tonal"
      :text="isNotFoundError(error) ? $t('customers.detail.notFound') : errorMessage(error)"
      data-cy="customer-form-load-error"
    />
    <v-card v-else variant="outlined" max-width="640" class="pa-4 pa-sm-6">
      <CustomerForm
        :initial-values="customer"
        :saving="saving"
        :error-message="saveError"
        @submit="save"
        @cancel="cancel"
      />
    </v-card>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useErrorMessage } from '@shared/composables/useErrorMessage';
import CustomerForm from '../components/CustomerForm.vue';
import { useCustomerQuery } from '../composables/useCustomerQuery';
import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} from '../composables/useCustomerMutations';
import { isNotFoundError } from '../errors';
import type { Customer, CustomerParams } from '../types';

/** Com `id` (rota `CustomerEdit`) edita; sem `id` (rota `CustomerCreate`) cadastra. */
const props = defineProps<{ id?: number }>();

const router = useRouter();
const errorMessage = useErrorMessage();

const isEdit = computed(() => props.id !== undefined);
const { data: customer, error, isPending } = useCustomerQuery(() => props.id ?? null);

const createMutation = useCreateCustomerMutation();
const updateMutation = useUpdateCustomerMutation();

const saving = computed(() => createMutation.isPending.value || updateMutation.isPending.value);
const saveError = computed(() => {
  const failure = createMutation.error.value ?? updateMutation.error.value;
  return failure ? errorMessage(failure) : null;
});

function showDetail({ id }: Customer): void {
  void router.push({ name: 'CustomerDetail', params: { id } });
}

function save(params: CustomerParams): void {
  if (props.id === undefined) {
    createMutation.mutate(params, { onSuccess: showDetail });
  } else {
    updateMutation.mutate({ id: props.id, params }, { onSuccess: showDetail });
  }
}

function cancel(): void {
  void router.push(
    props.id === undefined
      ? { name: 'Customers' }
      : { name: 'CustomerDetail', params: { id: props.id } }
  );
}
</script>
