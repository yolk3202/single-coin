import {modeMap} from './configMap.js'
import defaultConfig from './defaultConfig.js'

import api from './api'
const baseUrl = import.meta.env.VITE_APP_BASE_API;
const serverDomain = import.meta.env.VITE_APP_TARGET_URL;
const noTokenList = [
  api.LOGIN,
  api.REGISTER,
]

export default (()=>{
  const mode = import.meta.env.MODE;

  switch(mode){
    case modeMap.MOCK:
      return {
        ...defaultConfig,
        env:modeMap.MOCK,
        baseUrl,
        serverDomain,
        api,
        noTokenList,
      }
    case modeMap.TEST:
      return {
        ...defaultConfig,
        env:modeMap.TEST,
        baseUrl,
        serverDomain,
        api,
        noTokenList,
      }
    case modeMap.ONLINE:
      return {
        ...defaultConfig,
        env:modeMap.ONLINE,
        baseUrl,
        serverDomain,
        api,
        noTokenList,
      }
    case modeMap.DEV:
    default:
      return {
        ...defaultConfig,
        env:modeMap.DEV,
        baseUrl,
        api,
        noTokenList,
      }
  }
})()