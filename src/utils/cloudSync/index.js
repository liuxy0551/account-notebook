import Taro from '@tarojs/taro'
import { getTimeStr, showToast } from '../index'
import { setStorage } from '../updateData'
import { aesEncrypt, aesDecrypt } from './crypto'

const DB = Taro.cloud.database()

// 备份需要加密账号和密码
const setBackupData = async () => {
    Taro.showLoading({ title: '备份中...' })
    let tagList = Taro.getStorageSync('tagList') || []
    let accountList = Taro.getStorageSync('accountList') || []

    tagList = tagList.filter(item => item.id !== 'all')
    accountList = accountList.map(item => {
        return {
            ...item,
            username: aesEncrypt(item.username),
            password: aesEncrypt(item.password)
        }
    })

    const { result: _openid } = await Taro.cloud.callFunction({ name: 'getOpenId' })
    await updateData('tagList', tagList, _openid)
    await updateData('accountList', accountList, _openid)

    showToast('备份成功')
    Taro.hideLoading()
}

const updateData = async (key, value, _openid) => {
    const data = {
        [key]: value,
        updateTime: getTimeStr()
    }
    const res = await DB.collection(key).where({
        _openid
    }).update({
        data
    })

    if (res?.stats?.updated !== 0) return
    // 没有备份记录
    await DB.collection(key).add({
        data
    })
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
    setBackupData
}
