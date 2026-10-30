/**
 * src/app/providers/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com
 */

// Styles
import '@fontsource-variable/inter';
import 'vuetify/styles';
import '@app/styles/icons.scss';
import '@app/styles/main.scss';

import { createVuetify } from 'vuetify';
import { pt } from 'vuetify/locale';
import { aliases, ms } from './icons';
import type { AppThemeDefinition } from '@typings/theme';

const palette = {
  primary: '#FF8066',
  secondary: '#6D8CFF',

  'primary-variant': '#ff80661a',
  'secondary-variant': '#6d8cff1a',
  'light-grey': '#f1f1f16c',
};

const lightTheme: AppThemeDefinition = {
  dark: false,
  colors: {
    ...palette,

    background: '#F4F7FB',
    surface: '#FFFFFF',

    accent: '#00B8A9',
    error: '#C1121F',
    warning: '#F4A261',
    info: '#1677FF',
    success: '#168A63',

    'accent-variant': '#00b8a905',
    'on-accent-variant': '#000000',
    'surface-variant': '#E7ECF31a',
    'error-variant': '#c1121f1a',
    'warning-variant': '#f4a2611a',
    'info-variant': '#1677ff1a',
    'success-variant': '#168a631a',
  },
};

const darkTheme: AppThemeDefinition = {
  dark: true,
  colors: {
    ...palette,

    background: '#080D1C',
    surface: '#111A31',

    accent: '#42E8D3',
    error: '#FF6B6B',
    warning: '#FFD166',
    info: '#73A9FF',
    success: '#62D5A5',

    'accent-variant': '#42e8d31a',
    'on-accent-variant': '#FFFFFF',
    'surface-variant': '#1C2945',
    'error-variant': '#ff6b6b1a',
    'warning-variant': '#ffd1661a',
    'info-variant': '#73a9ff1a',
    'success-variant': '#62d5a51a',
  },
};

/**
 * Cria a instância do Vuetify da aplicação. Exportada para que os testes
 * montem componentes com o mesmo tema, ícones e locale.
 *
 * https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
 */
export function createAppVuetify() {
  return createVuetify({
    icons: {
      defaultSet: 'ms',
      aliases,
      sets: {
        ms,
      },
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: lightTheme,
        dark: darkTheme,
      },
    },
    locale: {
      locale: 'pt',
      messages: { pt },
    },
  });
}

export default createAppVuetify();
