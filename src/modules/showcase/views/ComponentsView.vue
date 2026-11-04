<template>
  <section class="components-page" data-cy="components-page">
    <div class="mb-8">
      <p class="text-overline text-primary-text font-weight-bold mb-2">
        {{ $t('components.eyebrow') }}
      </p>
      <h1 class="text-h4 text-md-h3 font-weight-bold mb-2" data-cy="components-title">
        {{ $t('components.title') }}
      </h1>
      <p class="text-body-1 text-medium-emphasis mb-0" style="max-width: 760px">
        {{ $t('components.description') }}
      </p>
    </div>

    <DocSection
      :title="$t('components.palette.title')"
      :description="$t('components.palette.description')"
      icon="palette"
      anchor="tema"
    >
      <v-row>
        <v-col v-for="color in themeColors" :key="color" cols="6" sm="4" md="2">
          <v-sheet :color="color" rounded height="88" class="pa-2">
            <v-row>
              <v-col cols="12">
                <span class="text-caption font-weight-medium">{{ color }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <span class="d-flex justify-end text-caption text-uppercase" style="opacity: 0.85">
                  {{ colorHex(color) }}
                </span>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
    </DocSection>

    <DocSection
      :title="$t('components.buttons.title')"
      :description="$t('components.buttons.description')"
      icon="smart_button"
      anchor="botoes"
    >
      <ShowcaseCard
        :title="$t('components.buttons.showcaseTitle')"
        :description="$t('components.buttons.showcaseDescription')"
        :code="buttonCode"
        language="vue"
      >
        <template #preview>
          <v-btn color="primary" variant="flat">{{ $t('components.buttons.primary') }}</v-btn>
          <v-btn color="primary" variant="tonal">{{ $t('components.buttons.tonal') }}</v-btn>
          <v-btn color="primary" variant="outlined">{{ $t('components.buttons.outlined') }}</v-btn>
          <v-btn color="primary" variant="text">{{ $t('components.buttons.text') }}</v-btn>
          <v-btn
            color="primary"
            icon="favorite"
            :aria-label="$t('components.buttons.favoriteAria')"
          />
        </template>
      </ShowcaseCard>
    </DocSection>

    <DocSection
      :title="$t('components.chips.title')"
      :description="$t('components.chips.description')"
      icon="sell"
      anchor="chips"
    >
      <ShowcaseCard
        :title="$t('components.chips.showcaseTitle')"
        :description="$t('components.chips.showcaseDescription')"
        :code="chipCode"
        language="vue"
      >
        <template #preview>
          <v-chip color="success" variant="tonal" prepend-icon="check_circle">
            {{ $t('components.chips.approved') }}
          </v-chip>
          <v-chip color="warning" variant="tonal" prepend-icon="schedule">
            {{ $t('components.chips.pending') }}
          </v-chip>
          <v-chip color="error" variant="tonal" prepend-icon="cancel">
            {{ $t('components.chips.blocked') }}
          </v-chip>
          <v-chip color="info-text" variant="outlined">v4.0.0</v-chip>
        </template>
      </ShowcaseCard>
    </DocSection>

    <DocSection
      :title="$t('components.alerts.title')"
      :description="$t('components.alerts.description')"
      icon="notifications_active"
      anchor="alertas"
    >
      <ShowcaseCard
        :title="$t('components.alerts.showcaseTitle')"
        :description="$t('components.alerts.showcaseDescription')"
        :code="alertCode"
        language="vue"
      >
        <template #preview>
          <div class="d-flex flex-column ga-3 flex-grow-1">
            <v-alert type="success" variant="tonal" :text="$t('components.alerts.success')" />
            <v-alert type="warning" variant="tonal" :text="$t('components.alerts.warning')" />
            <v-alert type="error" variant="tonal" :text="$t('components.alerts.error')" />
          </div>
        </template>
      </ShowcaseCard>
    </DocSection>

    <DocSection
      :title="$t('components.apiError.title')"
      :description="$t('components.apiError.description')"
      icon="report"
      anchor="erro-api"
    >
      <p class="text-body-2 text-medium-emphasis mb-4">
        {{ $t('components.apiError.intro') }}
        <a
          href="https://www.rfc-editor.org/rfc/rfc9457"
          target="_blank"
          rel="noopener"
          class="text-primary-text"
        >
          RFC 9457
        </a>
      </p>
      <ShowcaseCard
        :title="$t('components.apiError.showcaseTitle')"
        :description="$t('components.apiError.showcaseDescription')"
        :code="apiErrorCode"
        language="ts"
      >
        <template #preview>
          <div class="d-flex flex-column ga-3 flex-grow-1">
            <v-alert
              closable
              type="error"
              variant="tonal"
              icon="cancel"
              :title="problem.title"
              :text="apiErrorMessage"
            />
            <CodeBlock :code="problemJson" language="json" filename="problem+json" />
          </div>
        </template>
      </ShowcaseCard>
    </DocSection>

    <DocSection
      :title="$t('components.cards.title')"
      :description="$t('components.cards.description')"
      icon="dashboard"
      anchor="cartoes"
    >
      <ShowcaseCard
        :title="$t('components.cards.showcaseTitle')"
        :description="$t('components.cards.showcaseDescription')"
        :code="cardCode"
        language="vue"
      >
        <template #preview>
          <v-card variant="tonal" color="primary" width="280">
            <v-card-item>
              <template #prepend>
                <v-avatar color="primary" variant="flat" size="40">
                  <v-icon icon="widgets" />
                </v-avatar>
              </template>
              <v-card-title class="text-subtitle-1 font-weight-bold">
                {{ $t('components.cards.previewTitle') }}
              </v-card-title>
            </v-card-item>
            <v-card-text>{{ $t('components.cards.previewText') }}</v-card-text>
            <v-card-actions>
              <v-btn color="primary" variant="text" append-icon="arrow_forward">
                {{ $t('components.cards.previewAction') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </ShowcaseCard>
    </DocSection>
    <DocSection
      :title="$t('components.designSystem.title')"
      :description="$t('components.designSystem.description')"
      icon="calendar_month"
      anchor="design-system"
    >
      <div class="d-flex flex-column ga-6">
        <ShowcaseCard
          :title="$t('components.designSystem.status.title')"
          :description="$t('components.designSystem.status.description')"
          :code="statusCode"
          language="vue"
        >
          <template #preview>
            <BaseStatusChip
              :label="$t('components.designSystem.status.confirmed')"
              tone="success"
            />
            <BaseStatusChip :label="$t('components.designSystem.status.pending')" tone="warning" />
            <BaseStatusChip :label="$t('components.designSystem.status.cancelled')" tone="error" />
            <BaseStatusChip :label="$t('components.designSystem.status.draft')" tone="neutral" />
            <BaseAvatar name="Ana Souza" />
            <BaseAvatar name="Bruno Lima" />
            <BaseAvatar name="Carla Costa" :size="32" />
          </template>
        </ShowcaseCard>

        <ShowcaseCard
          :title="$t('components.designSystem.stats.title')"
          :description="$t('components.designSystem.stats.description')"
          :code="statsCode"
          language="vue"
        >
          <template #preview>
            <div class="d-flex flex-column ga-4 flex-grow-1">
              <BaseSegmentedControl
                v-model="period"
                :label="$t('components.designSystem.stats.periodLabel')"
                :options="periodOptions"
              />
              <v-row>
                <v-col cols="12" sm="6">
                  <BaseStatCard
                    :value="period === 'month' ? 78 : 18"
                    :label="$t('components.designSystem.stats.projects')"
                    icon="star"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <BaseStatCard
                    :value="period === 'month' ? 214 : 52"
                    :label="$t('components.designSystem.stats.contacts')"
                    icon="person"
                    color="secondary"
                  />
                </v-col>
              </v-row>
            </div>
          </template>
        </ShowcaseCard>

        <ShowcaseCard
          :title="$t('components.designSystem.events.title')"
          :description="$t('components.designSystem.events.description')"
          :code="eventCode"
          language="vue"
        >
          <template #preview>
            <div class="d-flex flex-column ga-2 flex-grow-1" style="max-width: 360px">
              <BaseEventBlock
                time="09:00 – 10:00"
                :title="$t('components.designSystem.events.meeting')"
                :subtitle="$t('components.designSystem.events.online')"
                hue="indigo"
              />
              <BaseEventBlock
                time="10:30"
                :title="$t('components.designSystem.events.content')"
                hue="violet"
              />
              <BaseEventBlock
                time="12:00"
                :title="$t('components.designSystem.events.lunch')"
                hue="green"
                compact
              />
            </div>
          </template>
        </ShowcaseCard>

        <ShowcaseCard
          :title="$t('components.designSystem.page.title')"
          :description="$t('components.designSystem.page.description')"
          :code="pageCode"
          language="vue"
        >
          <template #preview>
            <BasePageHeader
              class="flex-grow-1 mb-0"
              :title="$t('components.designSystem.page.header')"
              :subtitle="$t('components.designSystem.page.subtitle')"
            >
              <template #actions>
                <v-btn
                  color="error"
                  variant="tonal"
                  prepend-icon="delete"
                  data-cy="ds-confirm-open"
                  @click="confirmOpen = true"
                >
                  {{ $t('components.designSystem.page.delete') }}
                </v-btn>
              </template>
            </BasePageHeader>
            <BaseConfirmDialog
              v-model="confirmOpen"
              :title="$t('components.designSystem.page.confirmTitle')"
              :message="$t('components.designSystem.page.confirmMessage')"
              :confirm-label="$t('components.designSystem.page.delete')"
              tone="error"
              @confirm="confirmOpen = false"
            />
          </template>
        </ShowcaseCard>
      </div>
    </DocSection>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTheme } from 'vuetify';
import DocSection from '../components/DocSection.vue';
import ShowcaseCard from '../components/ShowcaseCard.vue';
import CodeBlock from '../components/CodeBlock.vue';
import { useErrorMessage } from '@shared/composables';
import BaseAvatar from '@shared/ui/components/BaseAvatar.vue';
import BaseConfirmDialog from '@shared/ui/components/BaseConfirmDialog.vue';
import BaseEventBlock from '@shared/ui/components/BaseEventBlock.vue';
import BasePageHeader from '@shared/ui/components/BasePageHeader.vue';
import BaseSegmentedControl from '@shared/ui/components/BaseSegmentedControl.vue';
import BaseStatCard from '@shared/ui/components/BaseStatCard.vue';
import BaseStatusChip from '@shared/ui/components/BaseStatusChip.vue';
import type { ProblemDetails } from '@typings/http';

const theme = useTheme();
const { t } = useI18n();
const confirmOpen = ref(false);

const period = ref<'week' | 'month'>('month');
const periodOptions = computed(() => [
  { value: 'week' as const, label: t('components.designSystem.stats.week') },
  { value: 'month' as const, label: t('components.designSystem.stats.month') },
]);

/** Retorna o hexadecimal da cor no tema ativo (adapta-se a light/dark). */
function colorHex(color: string): string {
  const value = theme.current.value.colors[color];
  return typeof value === 'string' ? value : '';
}

// Exemplo de corpo de erro no padrão RFC 9457 retornado por uma API.
const problem: ProblemDetails = {
  type: 'https://api.exemplo.gov.br/erros/saldo-insuficiente',
  title: 'Saldo insuficiente',
  status: 422,
  detail: 'A conta não possui saldo para concluir a transferência.',
  instance: '/contas/123/transferencias',
};

// A mensagem exibida no alerta é derivada pelo mesmo helper usado em produção.
const errorMessage = useErrorMessage();
const apiErrorMessage = computed(() => errorMessage({ status: problem.status, data: problem }));

const problemJson = JSON.stringify(problem, null, 2);

const apiErrorCode = `import { useI18n } from 'vue-i18n';
import { useErrorMessage } from '@shared/composables';
import BaseAvatar from '@shared/ui/components/BaseAvatar.vue';
import BaseConfirmDialog from '@shared/ui/components/BaseConfirmDialog.vue';
import BaseEventBlock from '@shared/ui/components/BaseEventBlock.vue';
import BasePageHeader from '@shared/ui/components/BasePageHeader.vue';
import BaseSegmentedControl from '@shared/ui/components/BaseSegmentedControl.vue';
import BaseStatCard from '@shared/ui/components/BaseStatCard.vue';
import BaseStatusChip from '@shared/ui/components/BaseStatusChip.vue';
import { transferRequest } from '../api/account.service';

const { t } = useI18n();
const errorMessage = useErrorMessage();

async function transfer(): Promise<void> {
  try {
    await transferRequest(params);
  } catch (error) {
    // Extrai detail/title do corpo application/problem+json (RFC 9457);
    // sem eles, usa o texto traduzido informado (ou os padrões errors.*).
    alertMessage.value = errorMessage(error, { unexpected: t('transfer.failed') });
  }
}`;

const themeColors = [
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'error',
  'surface',
];

const buttonCode = `<v-btn color="primary" variant="flat">Primário</v-btn>
<v-btn color="primary" variant="tonal">Tonal</v-btn>
<v-btn color="primary" variant="outlined">Outline</v-btn>
<v-btn color="primary" variant="text">Texto</v-btn>
<v-btn color="primary" icon="favorite" aria-label="Favoritar" />`;

const chipCode = `<v-chip color="success" variant="tonal" prepend-icon="check_circle">Aprovado</v-chip>
<v-chip color="warning" variant="tonal" prepend-icon="schedule">Pendente</v-chip>
<v-chip color="error" variant="tonal" prepend-icon="cancel">Bloqueado</v-chip>
<v-chip color="info-text" variant="outlined">v4.0.0</v-chip>`;

const alertCode = `<v-alert type="success" variant="tonal" text="Feature publicada com sucesso." />
<v-alert type="warning" variant="tonal" text="Há mudanças não commitadas." />
<v-alert type="error" variant="tonal" text="Falha ao carregar os dados." />`;

const cardCode = `<v-card variant="tonal" color="primary">
  <v-card-item>
    <template #prepend>
      <v-avatar color="primary" variant="flat" size="40">
        <v-icon icon="widgets" />
      </v-avatar>
    </template>
    <v-card-title>Módulo</v-card-title>
  </v-card-item>
  <v-card-text>Feature isolada por domínio.</v-card-text>
  <v-card-actions>
    <v-btn color="primary" variant="text" append-icon="arrow_forward">Abrir</v-btn>
  </v-card-actions>
</v-card>`;

// Componentes do design system Agenda (ADR-0045).
const statusCode = `<BaseStatusChip label="Confirmado" tone="success" />
<BaseStatusChip label="Pendente" tone="warning" icon="schedule" />
<BaseAvatar name="Ana Souza" />           <!-- iniciais e cor estáveis pelo nome -->
<BaseAvatar name="Ana Souza" decorative /> <!-- ao lado do nome escrito -->`;

const statsCode = `<BaseSegmentedControl v-model="periodo" label="Período" :options="opcoes" />
<BaseStatCard :value="78" label="Projetos" icon="star" />
<BaseStatCard :value="214" label="Contatos" icon="person" color="secondary" />`;

const eventCode = `<BaseEventBlock time="09:00 – 10:00" title="Reunião com cliente" subtitle="Online" hue="indigo" />
<BaseEventBlock time="12:00" title="Almoço" hue="green" compact />
<BaseEventBlock time="15:30" title="Academia" hue="teal" clickable @select="abrir" />`;

const pageCode = `<BasePageHeader title="Clientes" subtitle="32 cadastrados">
  <template #actions>
    <v-btn color="primary" prepend-icon="person_add">Novo cliente</v-btn>
  </template>
</BasePageHeader>

<BaseConfirmDialog
  v-model="aberto"
  title="Excluir cliente"
  message="Esta ação não pode ser desfeita."
  confirm-label="Excluir"
  tone="error"
  :loading="excluindo"
  @confirm="excluir"
/>`;
</script>
