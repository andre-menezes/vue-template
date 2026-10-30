export interface MenuItem {
  /** Chave i18n do rótulo do item (ex.: `nav.home`). */
  titleKey: string;
  route: string;
  icon: string;
  requiresAuth: boolean;
}
