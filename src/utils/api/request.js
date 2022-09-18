import Taro from '@tarojs/taro'
import { showToast } from '../index'

// 封装公共请求方法
function request (url, data = { loading: false }, method = 'GET') {
  return new Promise((resolve, reject) => {
    // 请求带上 loading
    data.loading && Taro.showLoading({ title: '加载中...' })
    delete data.loading
    Taro.request({
      url,
      data,
      method,
      timeout: 20 * 1000,
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code !== 200) {
            showToast(res.data.message)
            reject(res || {})
          } else {
            resolve(res.data || {})
          }
        } else {
          showToast(res.data.message || res.statusCode.toString())
        }
        data.loading && Taro.hideLoading()
      },
      fail: err => {
        showToast('请求失败')

        reject(err)
        data.loading && Taro.hideLoading()
      }
    })
  })
}

// get 方法
function get (url, data) {
  return request(url, data, 'GET')
}

// post 方法
function post (url, data) {
  return request(url, data, 'POST')
}


export default {
  get,
  post,
}
