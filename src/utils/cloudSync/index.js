import Taro from '@tarojs/taro'
import { setStorage } from '../updateData'
import { aesEncrypt, aesDecrypt } from './crypto'

// 备份前加密账号和密码
const getBackupData = () => {
    let tagList = Taro.getStorageSync('tagList') || []
    let accountList = Taro.getStorageSync('accountList') || []

    tagList = tagList.filter(item => item.id !== 'all')
    accountList = accountList.map(item => {
        return {
            ...item,
            username: aesEncrypt(item.username),
            password: aesEncrypt(item.password),
        }
    })
    return {
        tagList,
        accountList
    }
}

// 下载后解密账号和密码
const getDownloadData = (list) => {
    let accountList = list.map(item => {
        return {
            ...item,
            username: aesDecrypt(item.username),
            password: aesDecrypt(item.password),
        }
    })
    console.log(222, accountList)
}

export {
    getBackupData
}
