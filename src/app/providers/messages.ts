/**
 * Mensagens de i18n da aplicação: o locale base de `app/locales` mais os
 * `locales/pt-BR.json` de cada módulo, descobertos por glob. Um módulo traz e
 * leva as próprias traduções; remover a pasta remove as mensagens junto.
 */
import ptBR from '@app/locales/pt-BR.json';

/**
 * Schema das mensagens, derivado do locale base. Fica junto do provider (e não
 * em `types/`) porque depende do JSON da camada `app` — `types` não importa
 * de nenhuma camada (ADR-0018).
 */
export type MessageSchema = typeof ptBR;

type MessageTree = { [key: string]: unknown };

const isTree = (value: unknown): value is MessageTree =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Junta dois dicionários; namespaces repetidos (ex.: `nav`) são mesclados. */
function mergeMessages(base: MessageTree, extra: MessageTree): MessageTree {
  const result: MessageTree = { ...base };
  for (const [key, value] of Object.entries(extra)) {
    const current = result[key];
    result[key] = isTree(current) && isTree(value) ? mergeMessages(current, value) : value;
  }
  return result;
}

const moduleMessages = import.meta.glob<MessageTree>('@/modules/*/locales/pt-BR.json', {
  eager: true,
  import: 'default',
});

export const ptBRMessages = Object.values(moduleMessages).reduce<MessageTree>(
  mergeMessages,
  ptBR
) as MessageSchema;
