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
          console.log("===>", res);
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

  function sendCoinDataAction(options){
    return new Promise((resolve, reject) => {
      sendCoinDataApi(options)
        .then((res) => {
          console.log("===>", res);
          // 如果接口吐 k线数据，在这里接回来
          // const {
          //   code,
          //   data: { kline, line },
          //   message,
          // } = res;
          // if (code !== 200) {
          //   reject(message);
          // }
          // coinKline.value = kline;
          // coinLine.value = line;
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