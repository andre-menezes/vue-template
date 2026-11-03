import { describe, expect, it } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import CustomerForm from '@modules/customers/components/CustomerForm.vue';
import type { CustomerParams } from '@modules/customers/types';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

function mountForm(initialValues?: CustomerParams, errorMessage?: string) {
  return mountWithPlugins(CustomerForm, { props: { initialValues, saving: false, errorMessage } });
}

describe('CustomerForm', () => {
  it('começa vazio e ativo no cadastro', () => {
    const wrapper = mountForm();

    expect(
      wrapper.find<HTMLInputElement>('[data-cy="customer-name-input"] input').element.value
    ).toBe('');
    expect(
      wrapper.find<HTMLInputElement>('[data-cy="customer-active-input"] input').element.checked
    ).toBe(true);
  });

  it('preenche com os valores iniciais na edição', () => {
    const wrapper = mountForm({ name: 'Maria', email: 'm@x.com', phone: null, active: false });

    expect(
      wrapper.find<HTMLInputElement>('[data-cy="customer-email-input"] input').element.value
    ).toBe('m@x.com');
    expect(
      wrapper.find<HTMLInputElement>('[data-cy="customer-active-input"] input').element.checked
    ).toBe(false);
  });

  it('não envia com campos obrigatórios vazios e mostra as mensagens', async () => {
    const wrapper = mountForm();

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.emitted('submit')).toBeUndefined();
    expect(wrapper.text()).toContain('Campo obrigatório.');
  });

  it('não envia com e-mail inválido', async () => {
    const wrapper = mountForm();
    await wrapper.find('[data-cy="customer-name-input"] input').setValue('Maria');
    await wrapper.find('[data-cy="customer-email-input"] input').setValue('maria@');

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.emitted('submit')).toBeUndefined();
    expect(wrapper.text()).toContain('Informe um e-mail válido.');
  });

  it('envia os campos limpos, com telefone vazio como null', async () => {
    const wrapper = mountForm();
    await wrapper.find('[data-cy="customer-name-input"] input').setValue('  Maria Souza ');
    await wrapper.find('[data-cy="customer-email-input"] input').setValue(' maria@example.com ');
    await wrapper.find('[data-cy="customer-phone-input"] input').setValue('   ');

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.emitted('submit')).toEqual([
      [{ name: 'Maria Souza', email: 'maria@example.com', phone: null, active: true }],
    ]);
  });

  it('mantém o telefone informado', async () => {
    const wrapper = mountForm({ name: 'Maria', email: 'm@x.com', phone: null, active: true });
    await wrapper.find('[data-cy="customer-phone-input"] input').setValue(' 3199 ');

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.emitted('submit')?.[0]?.[0]).toMatchObject({ phone: '3199' });
  });

  it('envia a situação escolhida no switch', async () => {
    const wrapper = mountForm({ name: 'Maria', email: 'm@x.com', phone: null, active: true });
    await wrapper.find('[data-cy="customer-active-input"] input').setValue(false);

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.emitted('submit')?.[0]?.[0]).toMatchObject({ active: false });
  });

  it('mostra o erro da gravação e emite o cancelamento', async () => {
    const wrapper = mountForm(undefined, 'E-mail já cadastrado (HTTP 409)');

    await wrapper.find('[data-cy="customer-cancel-btn"]').trigger('click');

    expect(wrapper.find('[data-cy="customer-form-error"]').text()).toContain('HTTP 409');
    expect(wrapper.emitted('cancel')).toHaveLength(1);
  });
});
