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
    const {date, symbol, radio} = options;
    console.log('radio===>', radio)
    let params = {
      date,
      symbol,
    }
    return new Promise((resolve, reject) => {
      getCoinDataApi(params)
        .then((res) => {
          const {
            code, data, message,
          } = res;
          console.log("获取初始化 response===>", res);
          if (code === 404 ) {
            coinKline.value = {
                                data:[
                                    [radio + 0.1,radio + 0.2,radio + 0.3,radio + 0.05],
                                    [radio + 0.15,radio + 0.1,radio + 0.2,radio + 0.05],
                                    [radio + 0.05,radio + 0.1,radio + 0.01,radio + 0.3],
                                    [radio + 0.1,radio + 0.2,radio + 0.3,radio + 0.05],
                                    [radio + 0.25,radio + 0.1,radio + 0.2,radio + 0.05],
                                    [radio + 0.05,radio + 0.1,radio + 0.01,radio + 0.3],
                                    [radio + 0.3,radio + 0.2,radio + 0.3,radio + 0.05],
                                    [radio + 0.1,radio + 0.2,radio + 0.3,radio + 0.05],
                                    [radio + 0.15,radio + 0.1,radio + 0.2,radio + 0.05],
                                    [radio + 0.05,radio + 0.1,radio + 0.01,radio + 0.3],
                                    [radio + 0.1,radio + 0.2,radio + 0.3,radio + 0.05],
                                    [radio + 0.25,radio + 0.1,radio + 0.2,radio + 0.05],
                                    [radio + 0.05,radio + 0.1,radio + 0.01,radio + 0.3],
                                    [radio + 0.3,radio + 0.2,radio + 0.3,radio + 0.05],
                                    [radio + 0.1,radio + 0.2,radio + 0.3,radio + 0.05],
                                    [radio + 0.15,radio + 0.1,radio + 0.2,radio + 0.05],
                                    [radio + 0.05,radio + 0.1,radio + 0.01,radio + 0.3],
                                    [radio + 0.1,radio + 0.2,radio + 0.3,radio + 0.05],
                                    [radio + 0.25,radio + 0.1,radio + 0.2,radio + 0.05],
                                    [radio + 0.05,radio + 0.1,radio + 0.01,radio + 0.3],
                                    [radio + 0.3,radio + 0.2,radio + 0.3,radio + 0.05],  
                                    [radio + 0.1,radio + 0.2,radio + 0.3,radio + 0.05],
                                    [radio + 0.25,radio + 0.1,radio + 0.2,radio + 0.05],
                                    [radio + 0.05,radio + 0.1,radio + 0.01,radio + 0.3],
                                    [radio + 0.3,radio + 0.2,radio + 0.3,radio + 0.05],                                                                                                           
                                ],
                                // date:"2023-12-01",
                                x:[1672531200,1672534800,1672538400,1672542000,1672545600,1672549200, 
                                   1672552800,1672556400,1672560000,1672563600,1672567200,1672570800,
                                   1672574400,1672578000,1672581600,1672585200,1672588800,1672592400,
                                   1672596000,1672599600,1672603200,1672606800,1672610400,1672614000,1672617540]
                              };
            coinLine.value = {
                                data:[
                                    [0,radio],[1,radio],[2,radio],[3,radio],[4,radio],
                                    [5,radio],[6,radio],[7,radio],[8,radio],[9,radio],
                                    [10,radio],[11,radio],[12,radio],[13,radio],[14,radio],
                                    [15,radio],[16,radio],[17,radio],[18,radio],[19,radio],
                                    [20,radio],[21,radio],[22,radio],[23,radio],[24,radio]
                                ],
                                // date:"2023-12-01",
                                radio:radio,
                                // symbol:"ETH/USDT"
                              };
            resolve(res);
          }
          
          if (code === 200) {
            console.log('200 res ==>', res)
            coinKline.value = data.kline;
            coinLine.value = data.line;
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
            code, data, message,
          } = res;
          if (code !== 200) {
            reject(message);
          }
          coinKline.value = data.kline;
          coinLine.value = data.line;
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
