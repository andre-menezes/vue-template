# Prompt: Corrigir Bug

Use este prompt para acionar o agente na correção de um bug.

## Comando

```text
Corrija o bug descrito abaixo seguindo o workflow
agent/workflows/fix-bug.workflow.md.
```

## Variações

### Com spec de bug

```text
Corrija o bug descrito em docs/specs/BUG-001-login-redirect.md.
Siga o workflow de correção de bug.
```

### Com descrição direta

```text
Bug: ao clicar em "Sair", o usuário é redirecionado para /token mas o
estado da sessão na store não é limpo. Na próxima visita, o guard
considera a sessão válida e não solicita novo login.

Comportamento esperado: ao clicar em "Sair", o estado da sessão deve ser
limpo (cleanStorage) antes do redirect para o logout do SSC.

Corrija seguindo o workflow de correção de bug.
```

### Com stacktrace

```text
Bug: erro no console ao acessar /exemplo-protegido sem estar autenticado.

Erro: TypeError: Cannot read properties of null (reading 'nome')
Arquivo: src/shared/ui/components/TheAppHeader.vue:42

O componente tenta acessar userData.nome sem verificar null.
Corrija e adicione teste de regressão.
```

## O que o agente deve fazer

1. Ler `agent/core/CONTRACT.md` e `agent/core/PROCEDURE.md`.
2. Ler `agent/skills/vue-vuetify-dev/SKILL.md` e `agent/skills/testing/SKILL.md`.
3. Executar `agent/workflows/fix-bug.workflow.md`.
4. Entregar PR com correção + teste de regressão.
