import { createApp } from 'vue';
import { APP_NAME } from '@core/config';
import { registerPlugins } from '@app/providers/plugins';
import { registerErrorHandlers } from '@app/providers/errors';
import App from './App.vue';

const app = createApp(App);

registerErrorHandlers(app);
registerPlugins(app);

document.title = APP_NAME;

app.mount('#app');
