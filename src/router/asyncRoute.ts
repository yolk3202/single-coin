export const Layout = () => import("@/layout/index.vue");

export const asyncRoutes = [
  // {
  //   path: "/coin_system",
  //   component: Layout,
  //   redirect: "/coin_system/order_tracking",
  //   meta: {
  //     hidden: false,
  //     icon: "system",
  //     title: "币币系统",
  //   },
  //   children: [
  //     {
  //       path: "order_tracking",
  //       name: "orderTracking",
  //       component: () => import("@/views/coinSystem/orderTracking/index.vue"),
  //       meta: {
  //         icon: "system",
  //         hidden: false,
  //         title: "订单查询",
  //       },
  //     },
  //     {
  //       path: "coin_pair_management",
  //       name: "coinPairManagement",
  //       component: () => import("@/views/coinSystem/coinPairManagement/index.vue"),
  //       meta: {
  //         icon: "system",
  //         hidden: false,
  //         title: "币对管理",
  //       },
  //     },
  //   ],
  // },
  {
    path: "/robot_system",
    component: Layout,
    redirect: "/robot_system/robot_control",
    meta: {
      hidden: false,
      icon: "system",
      title: "机器人管理",
    },
    children: [
      {
        path: "robot_control",
        name: "robotControl",
        component: () => import("@/views/robotSystem/robotControl/index.vue"),
        meta: {
          icon: "system",
          hidden: false,
          title: "机器人控制",
        },
      },
      
    ],
  }
];

export default asyncRoutes;
