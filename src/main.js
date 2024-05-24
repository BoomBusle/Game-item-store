import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import VueCookies from 'vue-cookies';
import vue3GoogleLogin from 'vue3-google-login'
import vueTelegramLogin from 'vue-telegram-login';

const app = createApp(App);
app.use(vue3GoogleLogin, {
    clientId: '858976589298-if4gf8ghht8pv1034ql6a261vu1k71nd.apps.googleusercontent.com'
  })
app.use(router);
app.use(vueTelegramLogin);
app.use(VueCookies);
app.mount('#app');