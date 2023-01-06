import { createRouter, createWebHistory } from "vue-router";
import Video from "../views/Video.vue";
import Home from "../views/Video.vue";

const routes = [
  {
    path: "/:id",
    name: "video",
    component: Video,
  },
  {
    path: "/",
    name: "home",
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
