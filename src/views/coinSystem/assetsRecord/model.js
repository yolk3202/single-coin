export const initRealTimeTableRow = [
    {label: "账户", prop: "account_id", slot:'account', width: 120},
    {label: "币种", prop: "coin", slot: "status", width: 140},
    {label: "数量", prop: "total", minWidth: 120, align: 'left'}
]

export const initFlowTableRow = [
    {label: "账户", prop: "account_id", slot:'account', minWidth: 120},
    {label: "币种", prop: "symbol", slot: "status", minWidth: 100},
    {label: "数量", prop: "total", minWidth: 120, align: 'left'},
    {label: "记录日期", prop: "account_date", minWidth: 120},
]

export const hourList = [
    {label:'按天查看', value:24},
    {label:'按4小时查看', value:4},
    {label:'按1小时查看', value:1}
]