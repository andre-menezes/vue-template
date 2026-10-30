import { createApp } from 'vue';
import { registerPlugins } from '@app/providers/plugins';
import { registerErrorHandlers } from '@app/providers/errors';
import App from './App.vue';

const app = createApp(App);

registerErrorHandlers(app);
registerPlugins(app);

app.mount('#app');
