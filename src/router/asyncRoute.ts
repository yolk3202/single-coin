export const Layout = () => import("@/layout/index.vue");

export const asyncRoutes = [
  // 策略
  {
    path: "/startegy",
    component: Layout,
    redirect: "/startegy/manual",
    meta: {
      hidden: false,
      icon: "system",
      title: "跟盘策略",
    },
    children: [
      {
        path: "manual",
        name: "manual",
        component: () => import("@/views/startegy/manual/index.vue"),
        meta: {
          icon: "system",
          hidden: false,
          title: "手动画线",
        },
      },
      {
        path: "exchange",
        name: "exchange",
        component: () => import("@/views/startegy/exchange/index.vue"),
        meta: {
          icon: "system",
          hidden: false,
          title: "交易所",
        },
      },
    ],
  },
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
    path: "/coin_system",
    component: Layout,
    redirect: "/coin_system/order_tracking",
    meta: {
      icon: "system",
      hidden: false,
      title: "订单记录",
    },
    children: [
      {
        path: "order_tracking",
        name: "orderTracking",
        component: () => import("@/views/coinSystem/orderTracking/index.vue"),
        meta: {
          icon: "system",
          hidden: false,
          title: "订单记录",
        },
      },
    ],
  },
  {
    path: "/coin_system",
    component: Layout,
    redirect: "/coin_system/assets_record",
    meta: {
      icon: "system",
      hidden: false,
      title: "资产记录",
    },
    children: [
      //资产记录
      {
        path: "assets_record",
        name: "/assets_record",
        component: () => import("@/views/coinSystem/assetsRecord/index.vue"),
        meta: {
          icon: "system",
          hidden: false,
          title: "资产记录",
        },
      },
    ],
  },
  // 币对管理
  {
    path: "/coin",
    component: Layout,
    redirect: "/coin/manager",
    meta: {
      hidden: false,
      icon: "system",
      title: "币对管理",
    },
    children: [
      {
        path: "manager",
        name: "/manager",
        component: () => import("@/views/coin/manager/index.vue"),
        meta: {
          icon: "system",
          hidden: false,
          title: "币对管理",
        },
      },
    ],
  },
  // 交易所跟单
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
