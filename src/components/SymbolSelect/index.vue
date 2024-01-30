<script setup>
import { getCoinPairList } from "@/api/coin";
const emit = defineEmits(["update:modelValue", "onChange"]);

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

let symbol = ref("");
watch(
  () => props.modelValue,
  (val) => {
    symbol.value = val;
  },
  { deep: true }
);

let coinList = ref([]); // 币种列表
// sessionStorage
const setSessionSymbol = (val) => {
  sessionStorage.setItem("symbol", val);
};
const getSessionSymbol = () => {
  return sessionStorage.getItem("symbol");
};
// 币种
function getCoinList() {
  getCoinPairList().then((res) => {
    const { code, data, message } = res;
    if (code === 200) {
      coinList.value = data || [];

      if (symbol.value) {
        return;
      }
      const initSymbol = getSessionSymbol();
      if (initSymbol) {
        symbol.value = initSymbol;
        sendSymbol(initSymbol);
        return;
      }
      const hasSymbol = data.some((item) => {
        return item.symbol === "BTKUSDT";
      });
      if (hasSymbol) {
        symbol.value = "BTKUSDT";
      } else {
        symbol.value = data[0].symbol;
      }
      sendSymbol(symbol.value);
    }
  });
}

const changeSymbol = (val) => {
  sendSymbol(val);
};

const sendSymbol = (val) => {
  emit("update:modelValue", val);
  emit("onChange", val);
  setSessionSymbol(val);
};

onMounted(() => {
  // 请求接口
  console.log("==>:初始化组件");
  getCoinList();
});
</script>
<template>
  <KeepAlive>
    <el-select
      v-model="symbol"
      placeholder="选择币种"
      filterable
      @change="changeSymbol"
    >
      <el-option
        v-for="item in coinList"
        :key="item.symbol"
        :value="item.symbol"
        :label="item.symbol"
      />
    </el-select>
  </KeepAlive>
</template>
