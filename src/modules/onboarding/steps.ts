import type { ComposerTranslation } from 'vue-i18n';
import type { OnboardingFaq, OnboardingStep } from '@typings/onboarding';

/**
 * Passos, checklist e FAQ do guia de onboarding.
 *
 * Os textos (título, descrição, perguntas) vêm do i18n via `t`; os snippets de
 * código, nomes de arquivo e referências permanecem fixos (conteúdo técnico).
 *
 * Mantidos em um arquivo `.ts` separado (não dentro do `<script>` da view)
 * porque os exemplos de código contêm a tag `</script>`, que quebraria o
 * parser de Single File Component se estivesse embutida no `.vue`.
 */
export function buildOnboardingSteps(t: ComposerTranslation): OnboardingStep[] {
  return [
    {
      title: t('onboarding.steps.module.title'),
      description: t('onboarding.steps.module.description'),
      language: 'ts',
      filename: 'src/modules/customers/routes.ts',
      reference: 'src/modules/README.md',
      code: `import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('./views/CustomersView.vue'),
  },
];

export default routes;`,
    },
    {
      title: t('onboarding.steps.types.title'),
      description: t('onboarding.steps.types.description'),
      language: 'ts',
      filename: 'src/types/customer/index.ts',
      reference: 'src/types/README.md',
      code: `export interface Customer {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

export interface CreateCustomerParams {
  name: string;
  email: string;
}`,
    },
    {
      title: t('onboarding.steps.service.title'),
      description: t('onboarding.steps.service.description'),
      language: 'ts',
      filename: 'src/shared/api/services/customer.service.ts',
      reference: 'src/shared/api/README.md',
      code: `import { httpClient } from '@shared/api/instances';
import type { Customer, CreateCustomerParams } from '@typings/customer';

export function getCustomersRequest(): Promise<Customer[]> {
  return httpClient.get<Customer[]>('/customers');
}

export function createCustomerRequest(params: CreateCustomerParams): Promise<Customer> {
  return httpClient.post<Customer>('/customers', { body: params });
}`,
    },
    {
      title: t('onboarding.steps.view.title'),
      description: t('onboarding.steps.view.description'),
      language: 'vue',
      filename: 'src/modules/customers/views/CustomersView.vue',
      reference: 'src/shared/ui/README.md',
      code: [
        '<script setup lang="ts">',
        "import { ref, onMounted } from 'vue';",
        "import { getCustomersRequest } from '@shared/api/services/customer.service';",
        "import type { Customer } from '@typings/customer';",
        "import CustomerList from '../components/CustomerList.vue';",
        '',
        'const customers = ref<Customer[]>([]);',
        'const loading = ref(false);',
        '',
        'onMounted(async () => {',
        '  loading.value = true;',
        '  customers.value = await getCustomersRequest();',
        '  loading.value = false;',
        '});',
        '</' + 'script>',
      ].join('\n'),
    },
    {
      title: t('onboarding.steps.components.title'),
      description: t('onboarding.steps.components.description'),
      language: 'vue',
      filename: 'src/modules/customers/components/CustomerList.vue',
      code: [
        '<script setup lang="ts">',
        "import type { Customer } from '@typings/customer';",
        '',
        'defineProps<{',
        '  customers: Customer[];',
        '  loading: boolean;',
        '}>();',
        '</' + 'script>',
      ].join('\n'),
    },
    {
      title: t('onboarding.steps.tests.title'),
      description: t('onboarding.steps.tests.description'),
      language: 'ts',
      filename: 'src/test/services/customer.spec.ts',
      reference: 'src/test/README.md',
      code: `import { describe, expect, it, vi } from 'vitest';
import { getCustomersRequest } from '@shared/api/services/customer.service';
import { httpClient } from '@shared/api/instances';

vi.mock('@shared/api/instances', () => ({
  httpClient: { get: vi.fn() },
}));

it('retorna lista de clientes', async () => {
  const mock = [{ id: 1, name: 'Empresa A', email: 'a@a.com', active: true }];
  vi.mocked(httpClient.get).mockResolvedValue(mock);

  const result = await getCustomersRequest();

  expect(result).toEqual(mock);
});`,
    },
    {
      title: t('onboarding.steps.validate.title'),
      description: t('onboarding.steps.validate.description'),
      language: 'bash',
      code: `npm run lint          # sem erros de lint
npm run build         # typecheck + build sem erros
npm run test          # testes unitários passando`,
    },
  ];
}

export function buildOnboardingChecklist(t: ComposerTranslation): string[] {
  return [
    t('onboarding.checklist.module'),
    t('onboarding.checklist.routes'),
    t('onboarding.checklist.types'),
    t('onboarding.checklist.service'),
    t('onboarding.checklist.view'),
    t('onboarding.checklist.components'),
    t('onboarding.checklist.unitTest'),
    t('onboarding.checklist.e2eTest'),
    t('onboarding.checklist.lint'),
    t('onboarding.checklist.build'),
    t('onboarding.checklist.test'),
    t('onboarding.checklist.commit'),
  ];
}

export function buildOnboardingFaqs(t: ComposerTranslation): OnboardingFaq[] {
  return [
    {
      question: t('onboarding.faqs.sharedLogic.question'),
      answer: t('onboarding.faqs.sharedLogic.answer'),
    },
    {
      question: t('onboarding.faqs.store.question'),
      answer: t('onboarding.faqs.store.answer'),
    },
    {
      question: t('onboarding.faqs.crossModule.question'),
      answer: t('onboarding.faqs.crossModule.answer'),
    },
    {
      question: t('onboarding.faqs.env.question'),
      answer: t('onboarding.faqs.env.answer'),
    },
  ];
}
