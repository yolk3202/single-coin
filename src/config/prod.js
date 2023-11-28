import {modeMap} from './configMap.js'
import defaultConfig from './defaultConfig.js'
import api from './api'

const baseUrl = import.meta.env.VITE_APP_TARGET_URL;
const serverDomain = import.meta.env.VITE_APP_TARGET_URL;


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
      }
    case modeMap.TEST:
      return {
        ...defaultConfig,
        env:modeMap.TEST,
        baseUrl,
        serverDomain,
        api,
      }
    case modeMap.ONLINE:
      return {
        ...defaultConfig,
        env:modeMap.ONLINE,
        baseUrl,
        serverDomain,
        api,
      }
    case modeMap.DEV:
    default:
      return {
        ...defaultConfig,
        env:modeMap.DEV,
        baseUrl,
        serverDomain,
        api,
      }
  }
})()