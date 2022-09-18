import request from './request'

const baseUrl = 'http://127.0.0.1:9001/v1' // 本地环境
// const baseUrl = 'https://api.account-notebook.liuxianyu.cn/v1' // 正式环境

const apis = {
  getOpenId (data) { return request.post(`${ baseUrl }/getOpenId`, data) },
}

export default apis;
