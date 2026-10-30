# Skill: Documentação

## Objetivo

Criar e manter a documentação do projeto (guias, READMEs de camada, ADRs,
specs, CHANGELOG e comentários de código) de forma consistente, em português e
sem divergir do código.

## Mapa da documentação

| Documento                                                                                       | Conteúdo                                     | Quando mexer                         |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------ |
| `README.md`                                                                                     | Visão geral e primeiros passos               | Setup ou comandos mudaram            |
| `CONTRIBUTING.md`                                                                               | Fluxo, branches, commits, hooks, MR          | Processo de contribuição mudou       |
| `CHANGELOG.md`                                                                                  | Mudanças por versão (Keep a Changelog)       | Toda mudança relevante               |
| `docs/ARCHITECTURE-GUIDE.md`                                                                    | Índice central: camadas, fluxos, convenções  | Regra arquitetural ou fluxo mudou    |
| `docs/ONBOARDING.md`                                                                            | Passo a passo de criação de feature          | Ordem/forma de criar feature mudou   |
| `docs/COMMIT-CONVENTIONS.md`                                                                    | Formato de commit                            | Tipos/escopos mudaram                |
| `docs/CODE-REVIEW-CHECKLIST.md`                                                                 | Critérios de review                          | Novo critério de qualidade           |
| `docs/decisions/ADR-XXXX-*.md`                                                                  | Decisões arquiteturais (MADR)                | Decisão arquitetural nova ou revista |
| `docs/specs/FEAT-XXX-*.md`                                                                      | Specs de feature/bug                         | Antes de implementar                 |
| `docs/ROADMAP.md`                                                                               | Próximos passos                              | Fase concluída ou replanejada        |
| `src/<camada>/README.md`                                                                        | Regras locais da camada, exemplos bons/ruins | Padrão da camada mudou               |
| `agent/`                                                                                        | Núcleo agêntico (fonte de verdade da IA)     | Processo ou padrão do agente mudou   |
| Adapters (`CLAUDE.md`, `.claude/`, `.cursorrules`, `.kiro/`, `.github/copilot-instructions.md`) | Ponteiros para `agent/`                      | Arquivo novo em `agent/`             |

## Convenções de escrita

- **Idioma**: português do Brasil, UTF-8, com acentuação. Nomes de código,
  arquivos, tipos de commit e termos técnicos consagrados ficam em inglês.
- **Tom**: direto e objetivo, frases curtas, imperativo nas instruções
  ("Crie", "Use", "Nunca").
- **Estrutura de um README/guia**:
  1. `# Título`
  2. Uma ou duas frases dizendo o propósito.
  3. Link de volta: `Voltar para o guia geral: [../../docs/ARCHITECTURE-GUIDE.md](../../docs/ARCHITECTURE-GUIDE.md)`
     (caminho relativo ao arquivo).
  4. Seções `##` separadas por `---` em guias longos.
- **Tabelas** para regras, mapeamentos e comparações; listas para passos.
- **Blocos de código** sempre com linguagem (`ts`, `vue`, `bash`, `text`).
  Exemplos devem compilar com os padrões atuais (aliases, `defineProps<T>()`,
  sem `any`).
- **Exemplos bom/mau**: títulos `## Exemplo — bom código (...)` e
  `## Exemplo — mau código (...)`, seguidos de "Por que é bom:" / "Por que é
  ruim:" e, no mau, a correção.
- **Referências**: cite arquivos com caminho em crase (`src/core/config/index.ts`)
  e decisões pelo id com link (`[ADR-0018](../../docs/decisions/ADR-0018-...)`).
- **Marcadores de severidade** (checklists): ⚠️ bloqueante, 💡 sugestão.
- **Formatação**: o Prettier formata `.md` no pre-commit (`printWidth` 100).
  Quebre parágrafos em ~80 colunas como o restante dos docs.
- Não invente fatos: todo número, comando, caminho ou versão citado deve ser
  conferido no repositório (`package.json`, `vite.config.ts`, código).

## Uma fonte de verdade por fato

Fatos repetidos em vários arquivos divergem. Ao documentar:

- Prefira **apontar** para a fonte em vez de copiar (os adapters de IDE só
  apontam para `agent/` — ADR-0006).
- Quando a repetição já existe, atualize **todas** as ocorrências no mesmo
  commit. Procure com `grep -rn "<fato>" --include=*.md .` e nos `.vue`/`.json`.
  Exemplos de fatos repetidos hoje:
  - Thresholds de cobertura: `vite.config.ts` (fonte), `src/test/README.md`,
    `CONTRIBUTING.md`, `docs/ARCHITECTURE-GUIDE.md`, `agent/skills/testing/SKILL.md`.
  - Versão do Node: `.nvmrc`, `.tool-versions`, `package.json#engines`,
    `CONTRIBUTING.md`, ADR vigente.
  - Regras de camada: `eslint.config.mjs` (fonte), `docs/ARCHITECTURE-GUIDE.md`,
    `CONTRIBUTING.md`, `src/*/README.md`.
- O template tem **telas de documentação** (`/arquitetura`, `/onboarding`,
  `/componentes`, `/convencoes`, `/decisoes`). Se a regra alterada aparece
  numa delas, atualize também os textos em `src/app/locales/pt-BR.json` e os
  dados do módulo (ex.: `src/modules/onboarding/steps.ts`).

## ADR (decisão arquitetural)

Siga `docs/decisions/README.md`. Resumo:

1. Copie `agent/templates/adr.md` para
   `docs/decisions/ADR-XXXX-<slug>.md` (próximo número, 4 dígitos; slug
   kebab-case em português).
2. Cabeçalho **exato** — a tela `/decisoes` e o teste
   `src/test/modules/adrIndex.spec.ts` leem esse formato:

   ```markdown
   # ADR-0021: Título curto da decisão

   - **Status:** Proposta
   - **Data:** AAAA-MM-DD
   - **Decisores:** ...
   - **Relacionadas:** ADR-YYYY ou "nenhuma"
   ```

   Status válidos: `Proposta`, `Aceita`, `Substituída`, `Descontinuada`.

3. Preencha todas as seções (Contexto e problema, Drivers, Opções
   consideradas, Decisão, Consequências, Referências). Se não houve
   alternativa avaliada, declare isso; não invente opções.
4. Remova o bloco de instruções do template.
5. Adicione a linha na tabela de índice de `docs/decisions/README.md`.
6. ADR nunca é apagada: para reverter, crie uma nova e marque a antiga como
   `Substituída` (citando a substituta).
7. Decisão trivial ou local não precisa de ADR.

## CHANGELOG

- Formato [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) + SemVer.
- Entradas em `## [Não lançado]`, na categoria certa: **Adicionado**,
  **Alterado**, **Descontinuado**, **Removido**, **Corrigido**, **Segurança**.
- Uma linha por mudança, no ponto de vista de quem usa o template, citando
  arquivos/ADRs em crase quando ajudar.
- Refactor puramente interno pode ser omitido.

## Specs

- `docs/specs/FEAT-XXX-<slug>.md` ou `BUG-XXX-<slug>.md`, a partir de
  `agent/templates/feature-spec.md`, com todas as seções preenchidas.
- O que não estiver definido fica marcado como dúvida, não como suposição.

## Comentários no código

- JSDoc em português em funções exportadas, services, tipos e contratos
  (`/** ... */`), com `@param`, `@returns` e `@example` quando úteis
  (ver `src/shared/api/services/report.service.ts`, `src/types/docs/index.ts`).
- Comentário explica o **porquê** (restrição, decisão, ADR), não o óbvio.
- Cabeçalho de arquivo só quando o arquivo tem decisões não evidentes
  (ver `src/app/providers/i18n.ts`).

## Não fazer

- Documentar comportamento que o código não tem (ou que é só intenção).
- Copiar regra de um documento para outro sem necessidade.
- Deixar exemplo de código que viola as convenções atuais.
- Misturar mudança de documentação com feature/refactor no mesmo commit.
- Escrever documentação em inglês (exceto termos técnicos e código).
