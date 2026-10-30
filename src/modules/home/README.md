# modules/home

Modulo de entrada da aplicação com visão geral da base (dashboard inicial do template).

## Papel na arquitetura

- expor rota raiz
- demonstrar composição de tela por cards/componentes
- servir de referência para construcoes de views responsivas

## Organização local

- routes.ts: rota da feature
- views/HomeView.vue: container de página
- components: blocos visuais reutilizados nesta feature

## Exemplo de extensao da tela

Para adicionar um novo card de métrica, mantenha a regra de dados no container e passe props para componente:

```ts
const metrics = [
  ...metrics,
  {
    label: 'Pedidos',
    value: 42,
    detail: 'abertos hoje',
    icon: 'checklist',
    color: 'success',
  },
];
```
