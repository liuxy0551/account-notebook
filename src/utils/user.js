import Taro from '@tarojs/taro'
import { getTimeStr, showToast } from './index'
import { setStorage } from './updateData'

const DB = Taro.cloud.database()

// 获取用户信息
const getUserProfile = async () => {
    return new Promise((resolve, reject) => {
        Taro.getUserProfile({
            desc: `云同步需要授权用户信息`,
            success: async (res) => {
                const { userInfo } = res
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
    const { result: _openid } = await Taro.cloud.callFunction({ name: 'getOpenId' })
    const { data: userList = [] } = await DB.collection('userList').where({ _openid }).get()
    const userInfo = userList[0]
    let isPay = !!userInfo?.isPay
    let autoSync = isPay ? !!userInfo?.autoSync : false
    return {
        isPay,
        autoSync
    }
}

// 上传用户信息
const uploadUserInfo = async (userInfo) => {
    const { result: _openid } = await Taro.cloud.callFunction({ name: 'getOpenId' })
    const data = {
        userInfo,
        updateTime: getTimeStr()
    }

    const res = await DB.collection('userList').where({
        _openid
    }).update({
        data
    })
    if (res?.stats?.updated !== 0) return
    DB.collection('userList').add({
        data
    })
}

export {
    getUserProfile,
    getCloudIsPayAutoSync
}
