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
  },
  {
    path: "/robot_config",
    component: Layout,
    redirect: "/robot_config/robot_control",
    meta: {
      hidden: false,
      icon: "system",
      title: "机器人配置",
    },
    children: [
      {
        path: "near_plate",
        name: "nearPlate",
        component: () => import("@/views/robotConfig/nearPlate/index.vue"),
        meta: {
          icon: "system",
          hidden: false,
          title: "近盘机器人",
        },
      },
      {
        path: "far_plate",
        name: "farPlate",
        component: () => import("@/views/robotConfig/farPlate/index.vue"),
        meta: {
          icon: "system",
          hidden: false,
          title: "远盘机器人",
        },
      },
      {
        path: "draw_line",
        name: "drawLine",
        component: () => import("@/views/robotConfig/drawLine/index.vue"),
        meta: {
          icon: "system",
          hidden: false,
          title: "对敲机器人",
        },
      },
      {
        path: "big_order",
        name: "bigOrder",
        component: () => import("@/views/robotConfig/bigOrder/index.vue"),
        meta: {
          icon: "system",
          hidden: false,
          title: "大单机器人",
        },
      }, 
    ],
  },
  {
    path: "/log",
    component: Layout,
    redirect: "/log/manager",
    meta: {
      hidden: false,
      icon: "system",
      title: "操作日志管理",
    },
    children: [
      {
        path: "manager",
        name: "manager",
        component: () => import("@/views/log/manager/index.vue"),
        meta: {
          icon: "system",
          hidden: false,
          title: "操作日志",
        },
      },
      
    ],
  }
];

export default asyncRoutes;
