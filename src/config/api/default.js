const apiPre = '/api/'
const api = {
    FETCH_OHLCV:`${apiPre}fetch_ohlcv`, // 获取数据库中的折线图和K线图
    CREATE_OHLCV:`${apiPre}create_ohlcv`, // 创建K 线
    GET_EXCHANGE_INFO:`${apiPre}get_exchange_info`, // 获取交易货币对
    GET_NEW_PRICE:`${apiPre}get_last_price`, //获取最新价格
    // 币币系统-查询订单
    BI_SYSTEM_GET_ORDER:`${apiPre}order`,
}

export default api