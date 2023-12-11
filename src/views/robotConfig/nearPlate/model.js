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
    layer_count: 0, // 层数
    sell_order_price_spread: 0, // 卖盘盘口价差
    buy_order_price_spread: 0, // 买盘盘口价差
    sell_order_step_length: 0, //卖盘步长
    buy_order_step_length: 0, // 买盘步长
    minimum_point_spread: 0, // 最小点差
    minimum_volume: 0, // 最小量
    maximum_volume: 0, //最大量
    update_frequency_ms: 100, // 更新频率
    quote_expiration_time_ms: 100, // 报价过期时间
}