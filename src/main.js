import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import VueSocketIO from "vue-socket.io";
import SocketIO from "socket.io-client";
import config from "./scripts/config.js";

Vue.config.productionTip = false;

Vue.use(
  new VueSocketIO({
    connection: SocketIO(config.SOCKET_URL)
  })
);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
