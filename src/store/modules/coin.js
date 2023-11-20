import { defineStore } from "pinia";
import { ref } from "vue";
import { getCoinDataApi, sendCoinDataApi } from "@/api/coin";
import { store } from "@/store";

export const useCoinStore = defineStore("coin", () => {
  let coinKline = ref({});
  let coinLine = ref({
    data:[],
  });


  // 获取数据
  function getCoinDataAction(options) {
    return new Promise((resolve, reject) => {
      getCoinDataApi(options)
        .then((res) => {
          console.log("获取初始化 response===>", res);
          if (res.code === 401 && res.message === "日期参数错误,实例: 2023-12-01") {
            coinKline.value = {
                                data:[
                                    [0.1,0.2,0.3,0.05],
                                    [0.15,0.1,0.2,0.05],
                                    [0.05,0.1,0.01,0.3],
                                ],
                                date:"2023-12-01",
                                x:[0,12,22]
                              };
            coinLine.value = {
                                data:[
                                    [0,0],[12,0],[23,0]
                                ],
                                date:"2023-12-01",
                                radio:1,
                                symbol:"ETH/USDT"
                              };
            resolve(res);
          }
          const {
            code,
            data: { kline, line },
            message,
          } = res;
          if (code === 200) {
            console.log('200 res ==>', res)
            coinKline.value = kline;
            coinLine.value = line;
            resolve(res);
          }
          reject(message);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  function sendCoinDataAction(options){
    return new Promise((resolve, reject) => {
      sendCoinDataApi(options)
        .then((res) => {
          console.log("提交 response ===>", res);
          // 如果接口吐 k线数据，在这里接回来
          const {
            code,
            data: { kline, line },
            message,
          } = res;
          if (code !== 200) {
            reject(message);
          }
          coinKline.value = kline;
          coinLine.value = line;
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  return {
    coinKline,
    coinLine,
    getCoinDataAction,
    sendCoinDataAction,
  };
});

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}