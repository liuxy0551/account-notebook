import request from './request'

// const baseUrl = 'http://127.0.0.1:9001/v1' // 本地环境
const baseUrl = 'https://api.account-notebook.liuxianyu.cn/v1' // 正式环境

const apis = {
  getOpenId (data) { return request.post(`${ baseUrl }/getOpenId`, data) },
  getUserInfo (params) { return request.get(`${ baseUrl }/getUserInfo`, params) },
  updateUserInfo (data) { return request.post(`${ baseUrl }/updateUserInfo`, data) },
  updateUserAutoSync (data) { return request.post(`${ baseUrl }/updateUserAutoSync`, data) },
  getAccountList (params) { return request.get(`${ baseUrl }/getAccountList`, params) },
  getTagList (params) { return request.get(`${ baseUrl }/getTagList`, params) },
  updateAccountData (data) { return request.post(`${ baseUrl }/updateAccountData`, data) },
  updateTagData (data) { return request.post(`${ baseUrl }/updateTagData`, data) },
}

export default apis;
