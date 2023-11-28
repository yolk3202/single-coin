const apiPre = '/m1/3538235-0-default/';

const api = {
    // 获取交易货币对
    GET_EXCHANGE_INFO:`${apiPre}get_exchange_info`, 
    // 获取数据库中的折线图和K线图
    FETCH_OHLCV:`${apiPre}fetch_ohlcv`, 
    // 创建K 线
    CREATE_OHLCV:`${apiPre}create_ohlcv`, 
    //获取最新价格
    GET_NEW_PRICE:`${apiPre}get_last_price`,

    // 币币系统-查询订单
    BI_SYSTEM_GET_ORDER:`${apiPre}order`,
    
    // 机器人管理-获取机器人配置
    ROBOT_ADMIN_GET_CONFIG: `${apiPre}bot`,
    // 机器人管理-机器人控制
    ROBOT_ADMIN_SWITCH: `${apiPre}bot/control`,
}

export default api