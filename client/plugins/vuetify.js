import "vuetify/styles";
import { createVuetify } from "vuetify";
import '@mdi/font/css/materialdesignicons.css';

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    theme: {defaultTheme:'dark'},
  });
  app.vueApp.use(vuetify);
});
