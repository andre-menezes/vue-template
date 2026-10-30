# ADR-0003: Autenticação OAuth/SSC centralizada no router guard

- **Status:** Aceita
- **Data:** 2026-08-28
- **Decisores:** Time de frontend
- **Relacionadas:** ADR-0002, ADR-0004

## Contexto e problema

A aplicação autentica usuários via OAuth do Sistema de Segurança Corporativa
(SSC). É necessário garantir que rotas protegidas só sejam acessadas com sessão
válida, tratar o retorno do provedor e restaurar a sessão em recargas de página.
Onde concentrar essa lógica de autenticação?

## Drivers da decisão

- Ponto único de verificação de sessão a cada navegação.
- Fail fast: barrar acesso antes de renderizar a rota.
- Restauração de sessão previsível após reload.

## Opções consideradas

- **Guard centralizado no Router** (`beforeResolveGuard`) — verifica sessão a
  cada navegação e orquestra o fluxo OAuth.

> Não há alternativa documentada (por exemplo, verificação por componente ou
> middleware por rota). A decisão foi herdada da concepção do template.

## Decisão

Concentramos a autenticação no `beforeResolveGuard` do Vue Router. A rota
`/token` recebe o `code` do SSC e o backend o troca por tokens, emitindo um
cookie de sessão `HttpOnly` (ver ADR-0014); rotas com `meta.requiresAuth` sem token
válido redirecionam para o login SSC; falhas redirecionam para
`/erro-autenticacao`; o destino original é salvo em `sessionStorage` para
redirecionamento após o login.

## Consequências

### Positivas

- Regra de acesso única e consistente para toda a aplicação.
- Sessão restaurada automaticamente em recargas.

### Negativas / trade-offs

- O guard concentra responsabilidade e complexidade; mudanças no fluxo de auth
  passam obrigatoriamente por ele.

### Neutras

- Acoplamento ao provedor OAuth SSC e às suas variáveis de ambiente.

## Referências

- `docs/ARCHITECTURE-GUIDE.md` — Fluxo de autenticação, Composição de rotas.
- `src/app/providers/router.ts` — implementação do guard.
- `src/shared/stores/persistent.store.ts` — persistência de tokens.
