# ADR-0014: Persistência de sessão em cookie HttpOnly

- **Status:** Aceita
- **Data:** 2026-09-01
- **Decisores:** Time de frontend
- **Relacionadas:** ADR-0003 (Autenticação OAuth/SSC no router guard)

## Contexto e problema

A sessão do usuário (tokens) era persistida em `localStorage`, sob a chave
`auth_storage`, e o token era lido pelo JavaScript para montar o header
`Authorization: Bearer` em cada requisição. O `localStorage` é acessível a
qualquer script na origem (exposto a XSS) e o token trafega no código do
cliente. Como este projeto é um template para novos sistemas, queremos
estabelecer, desde já, o padrão mais seguro de persistência de sessão. Como
persistir a sessão de forma segura e preparar o backend para acompanhar?

## Drivers da decisão

- Segurança: token inacessível ao JavaScript (mitiga roubo via XSS).
- Definir um padrão-alvo para novos projetos, "puxando" o backend para ele.
- Atributos de segurança nativos de cookie (`HttpOnly`, `SameSite`, `Secure`).
- Manter o template funcional sem backend real (mock de autenticação).

## Opções consideradas

- **Manter em `localStorage`** — simples, mas exposto a XSS e sem atributos de
  segurança.
- **Cookie definido no cliente (legível por JS)** — ganha `SameSite`/`Secure`,
  mas o token continua acessível ao JavaScript.
- **Cookie `HttpOnly` emitido pelo backend** — o token não é acessível ao JS; o
  navegador envia o cookie automaticamente. Exige que o backend passe a emitir o
  cookie (`Set-Cookie`) e que o cliente use `credentials: 'include'`.

## Decisão

Adotamos o **cookie `HttpOnly` emitido pelo backend** como padrão de persistência
de sessão. O frontend é preparado para esse modelo:

- As instâncias HTTP usam `credentials: 'include'`; o cookie de sessão é enviado
  automaticamente pelo navegador.
- O cliente **não** lê nem grava o token, e **não** monta o header
  `Authorization` manualmente.
- A validade da sessão é determinada pelo backend: em rota protegida, o guard
  chama o endpoint de dados do usuário; sucesso = sessão válida, falha (ex.: 401)
  = sem sessão, disparando o login.
- No callback `/token?code=...`, o backend troca o code por tokens e responde com
  `Set-Cookie` (HttpOnly); o cliente apenas dispara a troca.

Essa decisão é intencionalmente à frente do backend atual: o backend
ainda não emite o cookie de sessão, então o **mock de autenticação**
(`VITE_AUTH_MOCK=true`) mantém o template funcional enquanto o backend não se
adéqua. O contrato aqui registrado obriga essa adequação.

## Consequências

### Positivas

- Token inacessível ao JavaScript — reduz a superfície de XSS.
- O cliente deixa de gerenciar token/expiração: menos estado e menos código.
- Padrão de segurança definido para todos os novos projetos do template.

### Negativas / trade-offs

- Depende do backend emitir o cookie `HttpOnly` e habilitar CORS com
  credenciais; até lá, só funciona com o mock de autenticação.
- O cliente não conhece a expiração do token (não há refresh proativo no
  frontend); a renovação/expiração é responsabilidade do backend.

### Neutras

- O `persistentStore` deixa de guardar tokens e passa a conter apenas
  preferências de UX. O `localStorage` segue em uso para tema e idioma.

## Referências

- `src/shared/api/instances/index.ts` — `credentials: 'include'` nas requisições.
- `src/app/providers/router.ts` — guard valida a sessão pelo backend.
- `src/shared/stores/persistent.store.ts` — sem gerência de tokens no cliente.
- `src/shared/api/services/auth.service.ts` — troca de code e dados do usuário.
- ADR-0003 — fluxo de autenticação no router guard.
