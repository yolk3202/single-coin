export interface ApiType {
  [x: string]: String;
}

export interface ConfigType {
  env: String;
  api: ApiType;
  baseUrl: String;
}