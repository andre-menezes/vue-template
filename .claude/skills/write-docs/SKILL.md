---
name: write-docs
description: Cria ou atualiza documentação deste template — READMEs de camada, guias em docs/, ADRs (MADR), specs, CHANGELOG e JSDoc — em português e sem divergir do código. Use ao documentar uma mudança, registrar decisão arquitetural ou revisar docs.
---

# Documentação do projeto

As convenções de escrita, o mapa dos documentos e as regras de ADR, CHANGELOG
e specs estão em **`agent/skills/documentation/SKILL.md`** (fonte de verdade).
Leia esse arquivo antes de escrever. Esta skill define o procedimento.

## Procedimento

1. **Entender o que mudou.** Leia o código/diff que motiva a documentação.
   Documente só o que o código faz de fato; o que for intenção vai para
   `docs/ROADMAP.md` ou para uma spec.
2. **Escolher o destino** pela tabela "Mapa da documentação". Regra local de
   camada vai no `src/<camada>/README.md`; regra transversal no
   `docs/ARCHITECTURE-GUIDE.md`; decisão com alternativas vira ADR.
3. **Ler o documento de destino inteiro** e um vizinho do mesmo tipo, e seguir
   a mesma estrutura (título, frase de propósito, link "Voltar para o guia
   geral", tabelas, exemplos bom/mau).
4. **Achar todas as cópias do fato.** Antes de alterar um número, comando,
   caminho, versão ou regra, procure as outras ocorrências:

   ```bash
   grep -rn "<trecho do fato>" --include=*.md --include=*.json --include=*.vue --include=*.ts . \
     | grep -v node_modules
   ```

   Atualize todas no mesmo commit, inclusive as telas de documentação
   (`src/app/locales/pt-BR.json`, `src/modules/onboarding/steps.ts`).

5. **Escrever.** Português do Brasil com acentos, frases curtas, imperativo
   nas instruções, blocos de código com linguagem. Confira cada fato citado
   no repositório.
6. **Decisão arquitetural?** Crie a ADR seguindo a seção "ADR" da skill de
   documentação: próximo número livre em `docs/decisions/`, cabeçalho exato
   (`# ADR-XXXX: Título` e `- **Status:** ...`), índice do
   `docs/decisions/README.md` atualizado. Se a ADR substitui outra, atualize
   o status da antiga para `Substituída`.
7. **CHANGELOG.** Mudança relevante para quem usa o template → linha em
   `## [Não lançado]` na categoria correta.
8. **Adapters.** Arquivo novo em `agent/` → referencie nos adapters
   (`CLAUDE.md`, `.github/copilot-instructions.md`, `.kiro/steering/`,
   `.cursorrules`) como ponteiro, sem copiar o conteúdo.
9. **Validar.**

   ```bash
   npx prettier --check <arquivos .md alterados>
   npm run test   # obrigatório se mexeu em docs/decisions/ ou pt-BR.json
   ```

   Confira os links relativos novos (o arquivo de destino existe?).

10. **Commitar** só a documentação, em commit próprio:
    `docs(<escopo>): <descrição em português, imperativo, ≤ 72 chars>`
    (ex.: `docs(decisions): registrar ADR de cache de requisições`).

## Ao revisar documentação existente

Reporte, com `arquivo:linha`: fato divergente do código, link quebrado,
exemplo que viola as convenções atuais, ADR fora do formato, trecho em inglês
e duplicação que poderia ser um ponteiro. Corrija só se o usuário pedir.

## Não fazer

- Inventar comportamento, números ou comandos sem conferir no repositório.
- Criar documento novo quando cabe numa seção de um existente.
- Apagar ADR ou reescrever o histórico do CHANGELOG.
- Misturar docs com código de feature no mesmo commit.
