#!/usr/bin/env node
/**
 * Remove a vitrine de documentação do template (módulo `showcase`) para
 * começar um projeto novo (ADR-0026).
 *
 * Apaga o módulo, os testes dele e este próprio script, e tira o
 * `template:clean` do package.json. A página inicial (`modules/home`) e toda a
 * infraestrutura (app, core, shared, types) continuam.
 *
 * Uso: `pnpm template:clean`
 */
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);

const targets = ['src/modules/showcase', 'src/test/showcase', 'e2e/showcase'];

for (const target of targets) {
  const path = fileURLToPath(new URL(target, root));
  if (existsSync(path)) {
    rmSync(path, { recursive: true });
    console.log(`removido: ${target}`);
  }
}

const packagePath = fileURLToPath(new URL('package.json', root));
const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
delete packageJson.scripts['template:clean'];
writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
console.log('removido: script template:clean do package.json');

rmSync(fileURLToPath(import.meta.url));
console.log('removido: scripts/template-clean.mjs');

console.log(`
Pronto. Próximos passos:
  1. Ajuste src/modules/home/views/HomeView.vue para a sua tela inicial.
  2. Revise README.md, CHANGELOG.md e docs/ para o novo projeto.
  3. Rode: pnpm lint && pnpm build && pnpm test`);
