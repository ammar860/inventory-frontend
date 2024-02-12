import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/auth/Login.vue"),
      meta: {
        layout: "full",
      },
    },
    {
      path: "/user",
      name: "User",
      component: () => import("@/views/user/User.vue"),
      meta: {
        pageTitle: "User",
        breadcrumb: [
          {
            text: "User",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_user",
      },
    },
    {
      path: "/role",
      name: "Role",
      component: () => import("@/views/role/Role.vue"),
      meta: {
        pageTitle: "Role",
        breadcrumb: [
          {
            text: "Role",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_role",
      },
    },
    {
      path: "/flats",
      name: "Flats",
      component: () => import("@/views/offrs-property/Property.vue"),
      meta: {
        pageTitle: "Offrs Property",
        breadcrumb: [
          {
            text: "Property",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_officer_property",
      },
    },
    {
      path: "*",
      redirect: "/login",
    },
  ],
});

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

export default router;
