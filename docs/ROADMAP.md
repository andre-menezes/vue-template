# Roadmap — Próximos passos

Planejamento técnico dos próximos incrementos do template, na perspectiva de
arquitetura. Cada item segue o fluxo de branches a partir da `develop` e as
camadas do projeto (`types → service → store (se necessário) → view → components`; `utils` puro,
`helpers` com efeito, `composables` reativo).

Voltar para o índice: [README.md](README.md)

---

## Onde estamos

Consolidado na `develop` (ver `CHANGELOG.md`):

- Telas de documentação: Home (hub), Arquitetura, Onboarding, Componentes & UI,
  Convenções, Decisões (ADRs) e Exemplo autenticado.
- Autenticação OAuth/SSC centralizada no router, com mock por `VITE_AUTH_MOCK`
  e sessão em cookie `HttpOnly` (ADR-0014); tela de erro de autenticação.
- Camada HTTP (factory `createApiInstance` + ofetch), erros no padrão RFC 9457,
  download de arquivos binários (service + helper + utils).
- Qualidade: ESLint/Prettier, Husky, Vitest, Playwright, CI (GitHub Actions), ADRs 0001–0020.
- i18n **configurado e migrado** (`vue-i18n`, locale único `pt-BR`): todo texto
  de UI consolidado em `pt-BR.json` (ver `I18N-MIGRATION-PLAN.md`).

## Princípios de priorização

1. **Reduzir dívida antes de ampliar escopo** — fechar o que ficou pela metade
   (i18n, cobertura de testes dos utils novos) antes de novas features.
2. **Cada incremento é exemplar** — como é um template, cada adição vira
   referência de "o jeito certo"; prioriza clareza sobre completude.
3. **Sem novas dependências/padrões sem ADR** — decisões relevantes viram ADR.

---

## Fase 1 — Fechar dívidas (fundação) ✅ concluída

Objetivo: deixar o que já existe consistente e testado. **Todos os itens foram
entregues e mergeados na `develop`.**

| #   | Item                                    | Entregável                                                    | Camadas                            | Risco                       | Status       |
| --- | --------------------------------------- | ------------------------------------------------------------- | ---------------------------------- | --------------------------- | ------------ |
| 1.1 | **Migração i18n (pt-BR)**               | Executar o `I18N-MIGRATION-PLAN.md`, fatiado por tela         | `app/locales`, views, `types/i18n` | Médio (toca todas as telas) | ✅ Concluído |
| 1.2 | **Cobertura de testes dos utils novos** | Specs para `file-download`, `http-error` e helpers            | `test/`                            | Baixo                       | ✅ Concluído |
| 1.3 | **Teste do fluxo de download**          | Unit do service/helper + E2E opcional de um botão de download | `test/`, `cypress/`                | Baixo                       | ✅ Concluído |

> A regra de steering exige "sem código sem teste" — a Fase 1 quitou isso para o
> que foi adicionado recentemente (download, RFC 9457) e consolidou o i18n.
> A migração i18n foi fatiada em sete branches (fundação/globais, Home,
> Arquitetura, Onboarding, Componentes, Convenções e Decisões + Exemplo
> autenticado), cada uma validada por `lint + build + test` e com merge `--no-ff`
> na `develop`.

## Fase 2 — Completar a camada de dados (CRUD de referência)

Objetivo: o template demonstra camadas, mas não um fluxo de dados real de ponta
a ponta. Um módulo de exemplo `customers` (ou similar) fecha essa lacuna e vira
o "exemplo canônico" citado no Onboarding.

| #   | Item                            | Entregável                                                              | Camadas                                        | Risco |
| --- | ------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------- | ----- |
| 2.1 | **Módulo CRUD de exemplo**      | Listagem com paginação + detalhe + criar/editar/excluir                 | `types → service → store? → view → components` | Médio |
| 2.2 | **Padrão de paginação/filtros** | Tipos e util de paginação reutilizáveis (`DEFAULT_PAGE_SIZE` já existe) | `types/services`, `utils`                      | Baixo |
| 2.3 | **Upload de arquivo**           | Service + helper + util simétricos ao download (multipart)              | `shared/api`, `helpers`, `utils`               | Médio |
| 2.4 | **Estados de UI padronizados**  | Loading/empty/error como componentes compartilhados reutilizáveis       | `shared/ui`                                    | Baixo |

## Fase 3 — Experiência e robustez

Objetivo: padronizar feedback ao usuário e endurecer o tratamento de erros.

| #   | Item                               | Entregável                                                          | Camadas                               | Risco |
| --- | ---------------------------------- | ------------------------------------------------------------------- | ------------------------------------- | ----- |
| 3.1 | **Notificações (snackbar/toast)**  | Store + composable `useNotify` + render global                      | `shared/stores`, `composables`, `app` | Baixo |
| 3.2 | **Tratamento global de erro HTTP** | Interceptor/handler central mapeando RFC 9457 → notificação         | `shared/api`, `helpers`               | Médio |
| 3.3 | **Formulários + validação**        | Padrão de form com validação (avaliar lib em ADR) e exemplo no CRUD | `shared/ui`, `composables`            | Médio |
| 3.4 | **Acessibilidade (a11y)**          | Auditoria das telas (foco, labels, contraste) + ajustes             | transversal                           | Baixo |

## Fase 4 — Visão de longo prazo (multi-framework)

Objetivo: a visão declarada é aproveitar a arquitetura para React e Angular.
Isto é estratégico e precisa de decisão explícita (ADR) antes de execução.

| #   | Item                                | Entregável                                                               | Risco |
| --- | ----------------------------------- | ------------------------------------------------------------------------ | ----- |
| 4.1 | **ADR: estratégia multi-framework** | Decidir entre monorepo com núcleo agnóstico vs. templates irmãos         | Alto  |
| 4.2 | **Extrair núcleo agnóstico**        | Isolar o que é framework-agnóstico (tipos, contratos de API, convenções) | Alto  |
| 4.3 | **Prova de conceito React/Angular** | Reproduzir 1–2 telas na stack alvo validando a arquitetura               | Alto  |

---

## Sequência recomendada

```
Fase 1 (dívidas)  →  Fase 2 (dados/CRUD)  →  Fase 3 (UX/robustez)  →  Fase 4 (multi-framework)
```

A **Fase 1** está concluída (i18n migrado e testes dos utils novos cobertos),
deixando a base limpa. O próximo foco é a **Fase 2 (dados/CRUD)**, começando
pelo módulo CRUD de exemplo (2.1) que vira o "exemplo canônico" do Onboarding.

## Itens que exigem ADR antes de executar

- 2.3 Upload (se exigir lib de multipart específica).
- 3.1/3.2 Padrão de notificação + handler global de erro.
- 3.3 Biblioteca de formulários/validação.
- 4.x Toda a estratégia multi-framework.

## Fora de escopo (por ora)

- SSR/SSG (o template é SPA por decisão).
- Gerência de permissões finas por recurso além do que o SSC já fornece.
