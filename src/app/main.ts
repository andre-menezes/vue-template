import { createApp } from 'vue';
import { APP_NAME } from '@core/config';
import { registerPlugins } from '@app/providers/plugins';
import App from './App.vue';

const app = createApp(App);

registerPlugins(app);

document.title = APP_NAME;

app.mount('#app');
