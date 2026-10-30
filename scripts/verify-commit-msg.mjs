// Validador de mensagem de commit (Conventional Commits em português).
// Referência: docs/COMMIT-CONVENTIONS.md
// Uso: node scripts/verify-commit-msg.mjs <caminho-do-arquivo-da-mensagem>

import { readFileSync } from 'node:fs';

const TYPES = [
  'feat',
  'fix',
  'docs',
  'refactor',
  'test',
  'chore',
  'style',
  'perf',
  'ci',
  'revert',
  'build',
  'wip',
];

const MAX_HEADER_LENGTH = 72;

// Formato: tipo(escopo opcional)!: descrição
// Ex.: feat(auth): implementar refresh de token
const PATTERN = new RegExp(`^(${TYPES.join('|')})(\\([a-z0-9-]+\\))?!?: .+`);

function fail(message) {
  console.error('\n\x1b[31m✖ Commit rejeitado\x1b[0m');
  console.error(message);
  console.error('\nFormato esperado: tipo(escopo): descrição em português');
  console.error(`Tipos válidos: ${TYPES.join(', ')}`);
  console.error('Exemplos:');
  console.error('  feat(auth): implementar refresh automático de token');
  console.error('  fix(http): corrigir header ausente após refresh');
  console.error('  docs: atualizar guia de contribuição');
  console.error('\nDetalhes em docs/COMMIT-CONVENTIONS.md\n');
  process.exit(1);
}

const messagePath = process.argv[2];

if (!messagePath) {
  fail('Caminho do arquivo de mensagem não informado ao hook.');
}

const raw = readFileSync(messagePath, 'utf8');

// Ignora comentários (linhas iniciadas por #) e captura a primeira linha útil.
const header = raw.split('\n').find((line) => line.trim() !== '' && !line.startsWith('#'));

if (!header) {
  fail('A mensagem de commit está vazia.');
}

// Permite mensagens geradas por merge/revert automáticos do Git.
if (/^(Merge|Revert)\b/.test(header)) {
  process.exit(0);
}

if (header.length > MAX_HEADER_LENGTH) {
  fail(
    `A primeira linha tem ${header.length} caracteres (máximo ${MAX_HEADER_LENGTH}).\n` +
      `Linha: "${header}"`
  );
}

if (!PATTERN.test(header)) {
  fail(`A mensagem não segue o padrão Conventional Commits.\nLinha: "${header}"`);
}

if (/\.\s*$/.test(header)) {
  fail('A descrição não deve terminar com ponto final.');
}

process.exit(0);
