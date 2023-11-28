import testApi from './test'
import onlineApi from './online'
import mockApi from './mock'
import defaultApi from './default'
import { modeMap } from '../configMap'
import { ApiType } from './types'

const api: ApiType = (() => {
  const mode = import.meta.env.MODE;
  switch (mode) {
    case modeMap.MOCK:
      return mockApi;
    case modeMap.TEST:
      return testApi;
    case modeMap.ONLINE:
      return onlineApi;
    case modeMap.DEV:
    default:
      return defaultApi;
  }
})();

export default api