<template>
  <section data-cy="customers-page">
    <BasePageHeader
      :title="$t('customers.list.title')"
      :subtitle="$t('customers.list.description')"
    >
      <template #actions>
        <v-btn
          :to="{ name: 'CustomerCreate' }"
          color="primary"
          prepend-icon="person_add"
          data-cy="customer-create-btn"
        >
          {{ $t('customers.list.create') }}
        </v-btn>
      </template>
    </BasePageHeader>

    <form role="search" class="d-flex ga-2 mb-4" data-cy="customer-search" @submit.prevent="search">
      <v-text-field
        v-model="searchTerm"
        :label="$t('customers.list.searchLabel')"
        prepend-inner-icon="search"
        density="compact"
        hide-details
        clearable
        data-cy="customer-search-input"
        @click:clear="clearSearch"
      />
      <v-btn
        type="submit"
        variant="tonal"
        color="primary"
        height="40"
        data-cy="customer-search-btn"
      >
        {{ $t('customers.list.search') }}
      </v-btn>
    </form>

    <BaseErrorState
      v-if="error"
      :message="errorMessage(error)"
      retryable
      :retrying="isFetching"
      data-cy="customers-error"
      @retry="refetch"
    />
    <CustomerTable
      v-else
      :customers="data?.items ?? []"
      :total="data?.total ?? 0"
      :page="params.page"
      :page-size="params.pageSize"
      :loading="isFetching"
      @change-page="changePage"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useErrorMessage } from '@shared/composables/useErrorMessage';
import BaseErrorState from '@shared/ui/components/BaseErrorState.vue';
import BasePageHeader from '@shared/ui/components/BasePageHeader.vue';
import CustomerTable from '../components/CustomerTable.vue';
import { useCustomersQuery } from '../composables/useCustomersQuery';
import { parseListQuery, toListQuery } from '../list-query';
import type { CustomerListParams } from '../types';

const route = useRoute();
const router = useRouter();
const errorMessage = useErrorMessage();

// A URL é a fonte da verdade da página e da busca; a query reage a ela.
const params = computed(() => parseListQuery(route.query));
const { data, error, isFetching, refetch } = useCustomersQuery(params);

const searchTerm = ref(params.value.search ?? '');
// Voltar no histórico muda a busca da URL; o campo acompanha.
watch(
  () => params.value.search,
  (search) => (searchTerm.value = search ?? '')
);

function navigate(next: CustomerListParams): void {
  void router.push({ query: toListQuery(next) });
}

function changePage(options: { page: number; pageSize: number }): void {
  navigate({ ...params.value, ...options });
}

/** Uma busca nova sempre começa na primeira página. */
function search(): void {
  navigate({ page: 1, pageSize: params.value.pageSize, search: searchTerm.value.trim() });
}

function clearSearch(): void {
  searchTerm.value = '';
  search();
}
</script>
