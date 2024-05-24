import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue")
  },
  {
    path: "/catalog",
    name: "catalog",
    component: () => import("../views/CatalogView.vue")
  },
  {
    path: "/registration",
    name: "registration",
    component: () => import("../forms/SignUpForm.vue")
  },
  {
    path: "/user-account",
    name: "user-account",
    component: () => import("../views/UserAccountViev.vue")
  },
  {
    path: "/order",
    name: "order",
    component: () => import("../views/OrderView.vue")
  },
  {
    path: "/reviews",
    name: "reviews",
    component: () => import("../views/ReviewView.vue")
  },
  {
    path: "/products/:productId",
    name: "product",
    component: () => import("../forms/CardForm.vue")
  },
  {
    path: "/adminpanel",
    name: "adminpanel",
    component: () => import("../views/AdminView.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
