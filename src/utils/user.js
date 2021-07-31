import Taro from '@tarojs/taro'
import { showToast } from './index'
import { setStorage } from './updateData'

// 获取用户信息
const getUserProfile = () => {
    return new Promise((resolve) => {
        Taro.getUserProfile({
            desc: `云同步需要授权用户信息`,
            success: (res) => {
                const { userInfo } = res
                setStorage('userInfo', userInfo)
                resolve(userInfo)
            },
            fail: () => {
                showToast(`授权失败，请重试`)
                resolve()
            }
        })
    })
}

export {
    getUserProfile
}
