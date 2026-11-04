<template>
  <section data-cy="customer-detail-page">
    <v-btn
      :to="{ name: 'Customers' }"
      variant="text"
      prepend-icon="arrow_back"
      class="mb-4 px-0"
      data-cy="customer-back-link"
    >
      {{ $t('customers.detail.back') }}
    </v-btn>

    <BaseLoadingState v-if="isPending" />
    <BaseEmptyState
      v-else-if="error && isNotFoundError(error)"
      :title="$t('customers.detail.notFound')"
      :description="$t('customers.detail.notFoundDescription')"
      icon="person_off"
      data-cy="customer-detail-error"
    />
    <BaseErrorState
      v-else-if="error"
      :message="errorMessage(error)"
      retryable
      :retrying="isFetching"
      data-cy="customer-detail-error"
      @retry="refetch"
    />
    <template v-else-if="customer">
      <BasePageHeader :title="customer.name" :subtitle="customer.email">
        <template #prepend>
          <BaseAvatar :name="customer.name" :size="56" decorative />
        </template>
        <template #actions>
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
        </template>
      </BasePageHeader>

      <CustomerDetails :customer="customer" />

      <BaseConfirmDialog
        v-model="deleteDialogOpen"
        :title="$t('customers.delete.title')"
        :message="$t('customers.delete.message', { name: customer.name })"
        :confirm-label="$t('customers.delete.confirm')"
        tone="error"
        :loading="deleteMutation.isPending.value"
        :error-message="deleteMutation.error.value && errorMessage(deleteMutation.error.value)"
        @confirm="confirmDelete(customer.name)"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useErrorMessage } from '@shared/composables/useErrorMessage';
import { useNotify } from '@shared/composables/useNotify';
import BaseAvatar from '@shared/ui/components/BaseAvatar.vue';
import BaseConfirmDialog from '@shared/ui/components/BaseConfirmDialog.vue';
import BaseEmptyState from '@shared/ui/components/BaseEmptyState.vue';
import BaseErrorState from '@shared/ui/components/BaseErrorState.vue';
import BaseLoadingState from '@shared/ui/components/BaseLoadingState.vue';
import BasePageHeader from '@shared/ui/components/BasePageHeader.vue';
import CustomerDetails from '../components/CustomerDetails.vue';
import { useDeleteCustomerMutation } from '../composables/useCustomerMutations';
import { useCustomerQuery } from '../composables/useCustomerQuery';
import { isNotFoundError } from '../errors';

const props = defineProps<{ id: number }>();

const router = useRouter();
const errorMessage = useErrorMessage();
const notify = useNotify();
const { t } = useI18n();

const { data: customer, error, isPending, isFetching, refetch } = useCustomerQuery(() => props.id);
const deleteMutation = useDeleteCustomerMutation();
const deleteDialogOpen = ref(false);

function openDeleteDialog(): void {
  // Um erro de uma tentativa anterior não aparece ao reabrir o diálogo.
  deleteMutation.reset();
  deleteDialogOpen.value = true;
}

function confirmDelete(name: string): void {
  deleteMutation.mutate(props.id, {
    onSuccess: () => {
      notify.success(t('customers.notify.deleted', { name }));
      void router.push({ name: 'Customers' });
    },
  });
}
</script>
