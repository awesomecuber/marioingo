import Vue from "vue";
import VueRouter from "vue-router";
import Bingo from "../views/Bingo.vue";

Vue.use(VueRouter);

const routes = [
  {
    name: "bingo",
    path: "/",
    component: Bingo
  }
];

const router = new VueRouter({
  routes
});

export default router;
