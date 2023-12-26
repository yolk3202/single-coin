export const initTableRow = [
  { label: "账户id", prop: "account_id", slot: 'account', width: 120 },
  { label: "账户uid", prop: "account_uid",  width: 140 },
  { label: "账户uname", prop: "account_uname", minWidth: 120, align: 'left' },
  { label: "币id", prop: "id", minWidth: 120, align: 'left' },
  { label: "币对", prop: "symbol", minWidth: 120, align: 'left' },
  { label: "状态", prop: "status", slot: "status", minWidth: 120, align: 'left' },
  { label: "跟盘策略", prop: "tracking_strategy", slot: "strategy", minWidth: 120, align: 'left' },
  {
    label: "操作", prop: "action",
    fixed: "right",
    width: 100,
    slot: "action",
  }
]

export const trackingStrategyList = [
  { value: 'DRAW_LINE', label: '画线' },
]