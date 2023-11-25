export const statusList = [
  { label: "OPEN", value: "open" },
  { label: "CLOSED", value: "closed" },
  { label: "CANCELED", value: "canceled" },
];

export const statusMap = {
  open: "open",
  closed: "closed",
  canceled: "canceled",
};

export const sideList =[
  { label: "SELL", value: "SELL" },
  { label: "BUY", value: "BUY" },
];

export const sideMap = {
  sell: "SELL",
  buy: "BUY",
};

export const orderTypeList = [
  { label: "LIMIT", value: "limit" },
  { label: "MARKET", value: "market" },
]

export const orderMap = {
  limit: "limit",
  market: "market",
}
export default {
  statusList,
  statusMap,
  sideList,
  sideMap,
  orderTypeList,
  orderMap,
};