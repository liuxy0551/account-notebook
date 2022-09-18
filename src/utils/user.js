import Taro from '@tarojs/taro'
import { getTimeStr, showToast } from './index'
import { setStorage } from './updateData'
import API from './api'

// 获取用户信息
const getUserProfile = async () => {
    return new Promise((resolve, reject) => {
        Taro.getUserProfile({
            desc: `云同步需要授权用户信息`,
            success: async ({ userInfo }) => {
                setStorage('userInfo', userInfo)
                uploadUserInfo(userInfo)
                resolve(userInfo)
            },
            fail: (err) => {
                console.log(`授权失败，请重试`, err)
                showToast(`授权失败，请重试`)
                reject()
            }
        })
    })
}

// 是否支付过、自动同步
const getCloudIsPayAutoSync = async () => {
    const _openid = Taro.getStorageSync('_openid')
    const { data: userInfo } = await API.getUserInfo({ _openid })
    let isPay = !!userInfo?.isPay
    let autoSync = isPay ? !!userInfo?.autoSync : false
    return {
        isPay,
        autoSync
    }
}

// 上传用户信息
const uploadUserInfo = async (userInfo) => {
    const _openid = Taro.getStorageSync('_openid')
    const { nickName } = userInfo
    const data = {
        userInfo,
        nickName,
        _openid,
        updateTime: getTimeStr()
    }
    API.updateUserInfo(data)
}

export {
    getUserProfile,
    getCloudIsPayAutoSync
}
