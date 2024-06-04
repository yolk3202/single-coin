export interface ApiType {
  [x: string]: String;
}

export interface ConfigType {
  env: String;
  baseUrl: String;
  noTokenList: Array<String>;
}
