# ADR-0047: Visual do template baseado no design Vora

- **Status:** Aceita
- **Data:** 2026-11-04
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0023 (fontes auto-hospedadas), ADR-0044 (paleta
  Agenda), ADR-0045 (componentes do design system), ADR-0046 (identidade
  visual)

## Contexto e problema

Depois da identidade visual da ADR-0046, Andre pediu que o template seguisse
o design do **Vora**, um kit de UI de dashboard SaaS (PSD e Figma) que ele
licenciou. O Vora tem uma linguagem própria: azul vivo, Poppins, cartões
brancos com sombra suave sobre fundo cinza claro, menu lateral com uma barra
no item ativo, indicadores com o número em destaque e controles segmentados.
Ele também pediu que o **raio de borda seja de 4px** em tudo. Como adotar o
Vora sem perder o que o template já garante (contraste AA, temas claro e
escuro, componentes `Base*`)?

## Drivers da decisão

- Fidelidade ao Vora nas cores, na fonte, nas superfícies e no menu.
- Raio de 4px em tudo, por pedido do Andre.
- Contraste AA nos dois temas (o Vora só tem o tema claro).
- Os componentes e as telas existentes continuam funcionando.

## Opções consideradas

- **Adotar a linguagem do Vora no tema, nos padrões e na casca, com raio de
  4px** — escolhida.
- **Copiar o Vora integralmente (raio de 12–16px, cabeçalho com busca e
  perfil)** — o raio contraria o pedido, e busca e perfil seriam controles
  sem função num template sem login.
- **Manter o design Agenda** — não atende ao pedido.

## Decisão

- **Paleta** (`vuetify.ts`): primary `#2953E8` (o azul do Vora), secondary
  `#09268A` (o azul-marinho das barras), accent ciano `#0B7FA0`; fundo
  `#F4F4F4`, superfície branca, `surface-light` `#F0F0F0` (trilho do
  controle segmentado), borda `#E4E4E7`; `primary-container` `#EEF2FF` (os
  botões tonais). Tons `-text` escurecidos para o AA. O tema escuro, que o
  Vora não tem, segue a mesma lógica com superfícies `#0E1015` e `#171A21` e
  primary `#7B95FF`. As cores de status e de evento da ADR-0044 continuam.
- **Fonte:** Poppins (`@fontsource/poppins`, pesos 400, 500 e 600) no lugar
  da Inter (`@fontsource-variable/inter` sai). A escala tipográfica da
  ADR-0045 continua.
- **Superfícies:** cartões sem borda e com a sombra curta e difusa do Vora
  (classe `.app-surface`, aplicada pelo padrão do `VCard`).
- **Raio de 4px em tudo:** chips (antes em pílula), menus e diálogos (antes
  8px), o trilho do controle segmentado, as tabelas da vitrine e o logo. Só
  avatares, rádios e o trilho do switch continuam redondos, porque o círculo
  é a forma deles, não um raio.
- **Menu lateral:** o item ativo fica com texto e ícone na cor primária,
  sem fundo, e uma barra de 4px na borda esquerda.
- **Cabeçalho:** 72px, com o botão de menu também no desktop (recolhe o
  menu para o modo rail).
- **Componentes novos** em `shared/ui`: `BaseStatCard` (indicador com o
  número em destaque e o ícone preenchido) e `BaseSegmentedControl`
  (trilho com a opção ativa em destaque). O `MetricCard` da vitrine passa a
  usar o `BaseStatCard`.
- **Fora:** a busca global e o perfil do cabeçalho do Vora, que dependem de
  funcionalidades que o template não tem.

## Consequências

### Positivas

- O template fica com o visual do kit que o Andre escolheu, nos dois temas.
- Dois componentes reutilizáveis de dashboard prontos.

### Negativas / trade-offs

- O Figma do design system Agenda deixa de ser a referência de cor, fonte e
  superfície; vale atualizar o Figma ou registrar que o código segue o Vora.
- A Poppins pesa mais que a Inter variável (três arquivos de peso).
- Os PSD e o Figma do Vora são de uso licenciado do Andre e não entram no
  repositório.

### Neutras

- As decisões de raio (ADR-0045), de estrutura da casca e da página inicial
  (ADR-0046) continuam; esta ADR muda cor, fonte, superfície e menu.

## Referências

- `src/app/providers/vuetify.ts`, `src/app/styles/main.scss`,
  `src/app/styles/settings.scss`, `src/shared/ui/components/BaseStatCard.vue`,
  `BaseSegmentedControl.vue`, `TheNavigationMenu.vue`, `TheAppHeader.vue`.
