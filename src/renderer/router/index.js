import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "lauch",
      component: require("@/pages/LaunchPage").default,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: require("@/pages/Dashboard").default,
    },
    {
      path: "/suspend",
      name: "suspend",
      component: require("@/pages/Suspend").default,
    },
    {
      path: "*",
      redirect: "/",
    },
  ],
});
