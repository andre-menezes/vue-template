import { createApp } from 'vue';
import { registerPlugins } from '@app/providers/plugins';
import App from './App.vue';

const app = createApp(App);

registerPlugins(app);

app.mount('#app');
