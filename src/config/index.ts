import { envMap } from './configMap.js'
import dev from './dev.js'
import prod from './prod.js'
import { ConfigType } from './types'

let configObj: ConfigType = {
  env: '',
  api: {},
  baseUrl: '',
  noTokenList: []
};

const config: ConfigType = (() => {
  const env = process.env.NODE_ENV;
  // console.log('env=====>', env)
  if (env === envMap.DEV) {
    configObj = { ...configObj, ...dev };
  }
  if (env === envMap.PROD) {
    configObj = { ...configObj, ...prod };
  }
  return configObj;
})();


export default config;
