# src

Esta pasta contém o código-fonte da aplicação, organizado por responsabilidade
arquitetural.

Guia central: [../docs/ARCHITECTURE-GUIDE.md](../docs/ARCHITECTURE-GUIDE.md)

## Estrutura

| Pasta      | Responsabilidade                              |
| ---------- | --------------------------------------------- |
| `app/`     | Inicialização, providers e rotas base         |
| `modules/` | Funcionalidades por domínio (features)        |
| `shared/`  | Recursos reutilizáveis entre módulos          |
| `core/`    | Base sem UI: config/env e constantes          |
| `test/`    | Testes automatizados (unitários e integração) |
| `types/`   | Contratos TypeScript centralizados            |

## Regras gerais

- Views de módulo orquestram fluxo, não infraestrutura.
- Acesso a backend acontece por services (`shared/api/services/`).
- Estado global/transversal acontece via stores (`shared/stores/`).
- Tipagem centralizada em `types/` — nunca inline.
- Lógica pura em `utils/`, com efeito lateral em `helpers/`, reativa em `composables/`.

## Exemplo de fluxo

```text
modules/home/views/HomeView.vue
  → chama service em shared/api/services
  → atualiza store em shared/stores quando necessário
  → renderiza componentes em modules/home/components
```

## Documentação local

Cada subpasta possui um README com regras, exemplos e instruções:

- [app/README.md](app/README.md)
- [core/README.md](core/README.md)
- [modules/README.md](modules/README.md)
- [shared/README.md](shared/README.md)
- [shared/api/README.md](shared/api/README.md)
- [types/README.md](types/README.md)
- [test/README.md](test/README.md)
