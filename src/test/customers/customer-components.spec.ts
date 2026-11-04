import { describe, expect, it } from 'vitest';
import { flushPromises, type VueWrapper } from '@vue/test-utils';
import { VDataTableServer } from 'vuetify/components';
import CustomerDetails from '@modules/customers/components/CustomerDetails.vue';
import CustomerStatusChip from '@modules/customers/components/CustomerStatusChip.vue';
import CustomerTable from '@modules/customers/components/CustomerTable.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';
import { buildCustomer } from './fixtures';
import { createCustomersRouter } from './router';

describe('CustomerStatusChip', () => {
  it('mostra a situação do cliente', () => {
    expect(mountWithPlugins(CustomerStatusChip, { props: { active: true } }).text()).toContain(
      'Ativo'
    );
    expect(mountWithPlugins(CustomerStatusChip, { props: { active: false } }).text()).toContain(
      'Inativo'
    );
  });
});

describe('CustomerDetails', () => {
  it('mostra e-mail, telefone e data de cadastro no formato do locale', () => {
    const wrapper = mountWithPlugins(CustomerDetails, { props: { customer: buildCustomer() } });

    expect(wrapper.find('[data-cy="customer-email"]').text()).toBe('maria@example.com');
    expect(wrapper.find('[data-cy="customer-phone"]').text()).toBe('(31) 99999-0000');
    expect(wrapper.text()).toContain('15/03/2026');
  });

  it('indica telefone não informado', () => {
    const wrapper = mountWithPlugins(CustomerDetails, {
      props: { customer: buildCustomer({ phone: null }) },
    });

    expect(wrapper.find('[data-cy="customer-phone"]').text()).toBe('Não informado');
  });
});

describe('CustomerTable', () => {
  async function mountTable(props: { page?: number; pageSize?: number } = {}) {
    const router = await createCustomersRouter();
    const wrapper = mountWithPlugins(CustomerTable, {
      props: {
        customers: [buildCustomer(), buildCustomer({ id: 8, name: 'João Lima', active: false })],
        total: 30,
        page: props.page ?? 1,
        pageSize: props.pageSize ?? 10,
        loading: false,
      },
      global: { plugins: [router] },
    });
    await flushPromises();
    return wrapper;
  }

  const emitOptions = (wrapper: VueWrapper, page: number, itemsPerPage: number) =>
    wrapper.findComponent(VDataTableServer).vm.$emit('update:options', { page, itemsPerPage });

  it('lista os clientes com link para o detalhe', async () => {
    const wrapper = await mountTable();
    const links = wrapper.findAll('[data-cy="customer-link"]');

    expect(links.map((link) => link.text())).toEqual(['Maria Souza', 'João Lima']);
    expect(links[0]?.attributes('href')).toBe('/customers/7');
    expect(wrapper.text()).toContain('15/03/2026');
    expect(wrapper.text()).toContain('Inativo');
  });

  it('mostra o estado vazio sem clientes', async () => {
    const router = await createCustomersRouter();
    const wrapper = mountWithPlugins(CustomerTable, {
      props: { customers: [], total: 0, page: 1, pageSize: 10, loading: false },
      global: { plugins: [router] },
    });
    await flushPromises();

    expect(wrapper.get('[data-cy="empty-state-title"]').text()).toBe('Nenhum cliente encontrado.');
  });

  it('não emite nada quando as opções não mudam (montagem)', async () => {
    const wrapper = await mountTable();

    emitOptions(wrapper, 1, 10);

    expect(wrapper.emitted('changePage')).toBeUndefined();
  });

  it('emite a nova página', async () => {
    const wrapper = await mountTable();

    emitOptions(wrapper, 3, 10);

    expect(wrapper.emitted('changePage')).toEqual([[{ page: 3, pageSize: 10 }]]);
  });

  it('volta à primeira página ao trocar o tamanho da página', async () => {
    const wrapper = await mountTable({ page: 2 });

    emitOptions(wrapper, 2, 25);

    expect(wrapper.emitted('changePage')).toEqual([[{ page: 1, pageSize: 25 }]]);
  });
});
