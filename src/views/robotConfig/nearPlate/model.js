export const robotInfo = {
    id:'',
    name: '近盘机器人',
    value: 'near_plate',
    bot_type: 'near_plate',
    create_time:'',
    update_time:'',
    symbol:'',
    status: 0,
    loading: true,
    config:null,
}

export const defaultConfig = {
    layer_count: undefined, // 层数
    sell_order_price_spread: undefined, // 卖盘盘口价差
    buy_order_price_spread: undefined, // 买盘盘口价差
    sell_order_step_length: undefined, //卖盘步长
    buy_order_step_length: undefined, // 买盘步长
    minimum_point_spread: undefined, // 最小点差
    minimum_volume: undefined, // 最小量
    maximum_volume: undefined, //最大量
    update_frequency_ms: undefined, // 更新频率
    quote_expiration_time_ms: undefined, // 报价过期时间
}