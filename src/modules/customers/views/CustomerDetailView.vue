<template>
  <section class="py-6" data-cy="customer-detail-page">
    <v-btn
      :to="{ name: 'Customers' }"
      variant="text"
      prepend-icon="arrow_back"
      class="mb-4 px-0"
      data-cy="customer-back-link"
    >
      {{ $t('customers.detail.back') }}
    </v-btn>

    <v-progress-linear v-if="isPending" indeterminate color="primary" />
    <v-alert
      v-else-if="error"
      :type="isNotFoundError(error) ? 'info' : 'error'"
      variant="tonal"
      :text="isNotFoundError(error) ? $t('customers.detail.notFound') : errorMessage(error)"
      data-cy="customer-detail-error"
    />
    <template v-else-if="customer">
      <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
        <h1 class="text-h4 font-weight-bold mb-0" data-cy="customer-detail-title">
          {{ customer.name }}
        </h1>
        <div class="d-flex ga-2">
          <v-btn
            :to="{ name: 'CustomerEdit', params: { id } }"
            variant="tonal"
            color="primary"
            prepend-icon="edit"
            data-cy="customer-edit-btn"
          >
            {{ $t('customers.detail.edit') }}
          </v-btn>
          <v-btn
            variant="tonal"
            color="error"
            prepend-icon="delete"
            data-cy="customer-delete-btn"
            @click="openDeleteDialog"
          >
            {{ $t('customers.detail.delete') }}
          </v-btn>
        </div>
      </div>

      <CustomerDetails :customer="customer" />

      <CustomerDeleteDialog
        v-model="deleteDialogOpen"
        :customer-name="customer.name"
        :deleting="deleteMutation.isPending.value"
        :error-message="deleteMutation.error.value && errorMessage(deleteMutation.error.value)"
        @confirm="confirmDelete"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useErrorMessage } from '@shared/composables/useErrorMessage';
import CustomerDeleteDialog from '../components/CustomerDeleteDialog.vue';
import CustomerDetails from '../components/CustomerDetails.vue';
import { useDeleteCustomerMutation } from '../composables/useCustomerMutations';
import { useCustomerQuery } from '../composables/useCustomerQuery';
import { isNotFoundError } from '../errors';

const props = defineProps<{ id: number }>();

const router = useRouter();
const errorMessage = useErrorMessage();

const { data: customer, error, isPending } = useCustomerQuery(() => props.id);
const deleteMutation = useDeleteCustomerMutation();
const deleteDialogOpen = ref(false);

function openDeleteDialog(): void {
  // Um erro de uma tentativa anterior não aparece ao reabrir o diálogo.
  deleteMutation.reset();
  deleteDialogOpen.value = true;
}

function confirmDelete(): void {
  deleteMutation.mutate(props.id, {
    onSuccess: () => void router.push({ name: 'Customers' }),
  });
}
</script>
