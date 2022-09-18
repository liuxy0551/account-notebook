import Taro from '@tarojs/taro'

// 封装公共请求方法
function request (url, data = { loading: false }, method = 'GET') {
  return new Promise((resolve, reject) => {
    // 请求带上 loading
    data.loading && Taro.showLoading({ title: '加载中...' })
    delete data.loading
    Taro.request({
      url,
      data,
      // header: { authorization: `Bearer ${ wepy.store.getters['user/token'] }` },
      method,
      timeout: 20 * 1000,
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code !== 200) {
            Taro.toast(res.data.message)
            reject(res || {})
          } else {
            resolve(res.data || {})
          }
        } else {
          Taro.toast(res.data.message || res.statusCode.toString())
        }
        data.loading && Taro.hideLoading()
      },
      fail: err => {
        Taro.toast('请求失败')

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
