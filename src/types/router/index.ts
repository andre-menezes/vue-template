/**
 * Meta fields de rota suportados pelo template (augmentation do vue-router).
 * Com isso, `route.meta.layout` é tipado em todo o projeto e valores inválidos
 * (ex.: `layout: 'vazio'`) falham no typecheck.
 */
import 'vue-router';

export type RouteLayout = 'default' | 'empty';

declare module 'vue-router' {
  interface RouteMeta {
    /** Layout da rota; ausente = `default` (header + navegação). */
    layout?: RouteLayout;
  }
}
