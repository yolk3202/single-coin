export const initTableRow = [
  {
    label: "币对",
    prop: "symbol",
    slot: "symbol",
    minWidth: 100,
    align: "left",
  },
  {
    label: "交易所配置",
    prop: "configList",
    slot: "config",
    minWidth: 240,
    align: "center",
  },
  {
    label: "状态",
    prop: "status",
    slot: "status",
    minWidth: 100,
    align: "left",
  },
  {
    label: "跟单类型",
    prop: "follow_type",
    slot: "strategy",
    minWidth: 100,
    align: "left",
  },
  {
    label: "操作",
    prop: "action",
    fixed: "right",
    width: 140,
    slot: "action",
  },
];

export const followStrategyList = [
  { value: "FOLLOW_PRICE", label: "跟价" },
  { value: "FOLLOW_TREND", label: "跟趋势" },
];

export const stateMap = {
  // 正常
  RUNNING: 1,
  // 停用
  STOPPED: 0,
};

export function dealWithData(data) {
  let result = [];
  data.forEach((item) => {
    result.push({ ...item, configList: JSON.parse(item.config) });
  });
  return result;
}
