const apiPre = '/api/'
const api = {
    // 登录接口
    LOGIN: `${apiPre}user/login`,
    // 注册接口 
    REGISTER: `${apiPre}user/register`,
    // 获取当前用户信息接口
    GET_CURRENT_USER: `${apiPre}user/me`,
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

    // 获取操作日志列表
    GET_LOG_LIST: `${apiPre}audit_log/query`,
    // 获取操作日志详情
    GET_LOG_DETAIL: `${apiPre}audit_log/detail`,

    // 新增机器人配置
    ADD_ROBOT_CONFIG: `${apiPre}bot/createOrUpdate`,

    // 获取当前币机器人列表
    GET_CURRENT_BOT_LIST: `${apiPre}bot/list`,
}

export default api