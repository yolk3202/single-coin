import statusConfig from './component/statusConfig.js';

export const statusList = statusConfig.statusList;
export const sideList = statusConfig.sideList;
export const orderTypeList = statusConfig.orderTypeList;

export const initTableRow = [
  { label: "订单号", prop: "order_id", minWidth: 120 },
  { label: "状态", prop: "status", slot:"status", minWidth: 100 },
  { label: "订单类型", prop: "order_type", minWidth: 100 },
  { label: "订单日期", prop: "order_date", minWidth: 120 },
  { label: "用英文", prop: "client_order_id", minWidth: 120 },
  { label: "价格", prop: "price", width: 150 },
  { label: "买卖方向", prop: "side", slot:"side", width: 100 },
  { label:'币对', prop:'symbol', minWidth:100 },
  { label: "数量", prop: "amount", width: 100 },
  // { label: "索引", prop: "id", minWidth: 100 },
  // { label: "UserID", prop: "userId", minWidth: 100 },
  // { label: "交易对象", prop: "tradingPartners", minWidth: 100 },
  // { label: "委托量", prop: "total", width: 120 },
  // { label: "成交额", prop: "turnover", width: 120 },
  // { label: "手续费", prop: "handingFee", width: 120 },
];
