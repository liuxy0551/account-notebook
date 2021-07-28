import Taro from '@tarojs/taro'
import { setStorage } from './updateData'

// 获取用户信息
const getUserInfo = (detail) => {
    console.log(44444, { ...detail })
}

export {
    getUserInfo
}
