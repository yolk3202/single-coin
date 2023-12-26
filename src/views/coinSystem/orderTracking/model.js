import statusConfig from './component/statusConfig.js';

export const statusList = statusConfig.statusList;
export const sideList = statusConfig.sideList;
export const orderTypeList = statusConfig.orderTypeList;

export const initTableRow = [
  { label: "订单号", prop: "order_id", width: 180 },
  { label:'UserId', prop:'account_id', width:180},
  { label:'状态', prop:'status', minWidth:120},
  { label:'创建时间', prop:'time', slot:'timeStamp', width:160},
  { label:'类型', prop:'type', width:100},
  { label:'交易对', prop:'symbol_id', minWidth:120},
  { label:'方向', prop:'side', slot:'side', width:100},
  { label:'价格', prop:'price', minWidth:120},
  { label:'委托量', prop:'orig_qty', minWidth:120},
  { label:'成交额', prop:'executed_amount', minWidth:120},
  { label:'手续费', prop:'fee', minWidth:120},
];
